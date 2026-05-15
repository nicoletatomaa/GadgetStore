using GadgetStore.API.DTOs;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Patterns.Behavioral.Observer;
using GadgetStore.Patterns.Creational.Prototype;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository          _products;
    private readonly ProductTemplateRegistry     _registry;
    private readonly WishlistNotificationObserver _wishlistObserver;
    private readonly PriceDropObserver           _priceDropObserver;

    public ProductsController(
        IProductRepository           products,
        ProductTemplateRegistry      registry,
        WishlistNotificationObserver wishlistObserver,
        PriceDropObserver            priceDropObserver)
    {
        _products          = products;
        _registry          = registry;
        _wishlistObserver  = wishlistObserver;
        _priceDropObserver = priceDropObserver;
    }

    // ── GET /api/products ──────────────────────────────────────────────────────
    /// <summary>Lista produse cu filtre si paginare.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int?    categoryId = null,
        [FromQuery] string? search     = null,
        [FromQuery] decimal? minPrice  = null,
        [FromQuery] decimal? maxPrice  = null,
        [FromQuery] bool?   inStock    = null,
        [FromQuery] string? sortBy     = null,
        [FromQuery] int     page       = 1,
        [FromQuery] int     pageSize   = 20)
    {
        bool hasInMemoryFilters = minPrice.HasValue || maxPrice.HasValue || inStock == true;

        IEnumerable<Product> products;

        if (hasInMemoryFilters)
        {
            // Incarca toate produsele din scope pentru filtrare + paginare corecta in memorie
            if (!string.IsNullOrWhiteSpace(search))
                products = await _products.SearchAsync(search, 1, 10_000);
            else if (categoryId.HasValue)
                products = await _products.GetByCategoryAsync(categoryId.Value, 1, 10_000);
            else
                products = await _products.GetAllAsync(1, 10_000);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(search))
                products = await _products.SearchAsync(search, page, pageSize);
            else if (categoryId.HasValue)
                products = await _products.GetByCategoryAsync(categoryId.Value, page, pageSize);
            else
                products = await _products.GetAllAsync(page, pageSize);
        }

        var query = products.AsQueryable();

        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
        if (inStock == true)   query = query.Where(p => p.Stock > 0);

        query = sortBy switch
        {
            "price_asc"  => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "newest"     => query.OrderByDescending(p => p.CreatedAt),
            _            => query.OrderBy(p => p.Name),
        };

        int total;
        List<Product> items;

        if (hasInMemoryFilters)
        {
            var allFiltered = query.ToList();
            total = allFiltered.Count;
            items = allFiltered.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }
        else
        {
            items = query.ToList();
            total = await _products.CountAsync();
        }

        return Ok(new
        {
            Items      = items.Select(MapProduct),
            TotalCount = total,
            Page       = page,
            PageSize   = pageSize,
            TotalPages = (int)Math.Ceiling((double)total / pageSize),
        });
    }

    // ── GET /api/products/{id} ─────────────────────────────────────────────────
    /// <summary>Returneaza detaliile unui produs.</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _products.GetByIdAsync(id);
        if (product is null) return NotFound(new { message = "Produsul nu a fost gasit." });

        return Ok(MapProduct(product));
    }

    // ── POST /api/products ─────────────────────────────────────────────────────
    /// <summary>Creeaza un produs nou [Admin].</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest req)
    {
        Product product = req.Type == "Accessory"
            ? new AccessoryProduct(req.Name, req.Price, req.Stock, req.Brand)
            : new ElectronicsProduct(req.Name, req.Price, req.Stock, req.Brand);

        if (req.CategoryId.HasValue) product.CategoryId = req.CategoryId.Value;
        product.ImageUrl    = req.ImageUrl;
        product.Description = req.Description;

        await _products.AddAsync(product);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapProduct(product));
    }

    // ── PUT /api/products/{id} ─────────────────────────────────────────────────
    /// <summary>Actualizeaza un produs existent [Admin].</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest req)
    {
        var product = await _products.GetByIdAsync(id);
        if (product is null) return NotFound(new { message = "Produsul nu a fost gasit." });

        if (req.Name is not null)        product.UpdateName(req.Name);
        if (req.Price.HasValue)          product.UpdatePrice(req.Price.Value);
        if (req.Stock.HasValue)          product.UpdateStock(req.Stock.Value);
        if (req.CategoryId.HasValue)     product.CategoryId  = req.CategoryId.Value;
        if (req.ImageUrl is not null)    product.ImageUrl    = req.ImageUrl;
        if (req.Description is not null) product.Description = req.Description;
        if (req.IsActive.HasValue)       product.IsActive    = req.IsActive.Value;

        await _products.UpdateAsync(product);
        return Ok(MapProduct(product));
    }

    // ── DELETE /api/products/{id} ──────────────────────────────────────────────
    /// <summary>Dezactiveaza (soft delete) un produs [Admin].</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await _products.ExistsAsync(id))
            return NotFound(new { message = "Produsul nu a fost gasit." });

        await _products.DeleteAsync(id);
        return NoContent();
    }

    // ── PATCH /api/products/{id}/stock — Observer pattern ─────────────────────
    /// <summary>
    /// Actualizeaza stocul si notifica observatorii subscriși.
    /// Pattern: Observer — WishlistNotificationObserver + LowStockLogObserver sunt
    /// subscriși la produs înainte de UpdateStock(); notificarea e automată.
    /// </summary>
    [HttpPatch("{id:guid}/stock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStock(Guid id, [FromBody] UpdateStockRequest req)
    {
        var product = await _products.GetByIdAsync(id);
        if (product is null) return NotFound(new { message = "Produsul nu a fost gasit." });

        // Observer pattern — subscribe înainte de modificare
        var lowStockObserver = new LowStockLogObserver();
        product.Subscribe(_wishlistObserver);
        product.Subscribe(lowStockObserver);

        product.UpdateStock(req.NewStock);   // notifică automat observatorii
        await _products.UpdateAsync(product);

        return Ok(new
        {
            product.Id,
            product.Name,
            product.Stock,
            LowStockLog       = lowStockObserver.Log,
            ObserversNotified = 2,
        });
    }

    // ── PATCH /api/products/{id}/price — Observer pattern ─────────────────────
    /// <summary>
    /// Actualizeaza pretul si notifica observatorii subscriși.
    /// Pattern: Observer — PriceDropObserver e subscris la produs înainte de
    /// UpdatePrice(); utilizatorii din wishlist sunt notificați automat.
    /// </summary>
    [HttpPatch("{id:guid}/price")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePrice(Guid id, [FromBody] UpdatePriceRequest req)
    {
        var product = await _products.GetByIdAsync(id);
        if (product is null) return NotFound(new { message = "Produsul nu a fost gasit." });

        // Observer pattern — subscribe înainte de modificare
        product.Subscribe(_priceDropObserver);

        product.UpdatePrice(req.NewPrice);   // notifică automat observatorii
        await _products.UpdateAsync(product);

        return Ok(new
        {
            product.Id,
            product.Name,
            product.Price,
            ObserversNotified = 1,
        });
    }

    // ── GET /api/products/templates — Prototype pattern ───────────────────────
    /// <summary>Returneaza cheile de prototipuri din registry.</summary>
    [HttpGet("templates")]
    public IActionResult GetTemplates()
    {
        return Ok(_registry.GetRegisteredKeys());
    }

    // ── POST /api/products/clone/shallow — Prototype pattern ──────────────────
    /// <summary>
    /// Cloneaza un prototip (Shallow Copy) — Tags partajate cu originalul.
    /// Pattern: Prototype (Shallow Copy) — MemberwiseClone() copie superficiala.
    /// </summary>
    [HttpPost("clone/shallow")]
    public IActionResult ShallowClone([FromBody] CloneProductRequest request)
    {
        try
        {
            var clone = _registry.ShallowClone(request.TemplateKey);

            if (request.Name is not null)  clone.UpdateName(request.Name);
            if (request.Price is not null) clone.UpdatePrice(request.Price.Value);
            if (request.Stock is not null) clone.UpdateStock(request.Stock.Value);

            foreach (var tag in request.ExtraTags)
                clone.Tags.Add(tag);

            return Ok(new { clone.Id, clone.Name, clone.Price, clone.Stock, clone.Tags,
                Description = clone.GetDescription(), CopyType = "Shallow" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── POST /api/products/clone/deep — Prototype pattern ─────────────────────
    /// <summary>
    /// Cloneaza un prototip (Deep Copy) — Tags independente de original.
    /// Pattern: Prototype (Deep Copy) — lista noua de Tags, izolare completa.
    /// </summary>
    [HttpPost("clone/deep")]
    public IActionResult DeepClone([FromBody] CloneProductRequest request)
    {
        try
        {
            var clone = _registry.DeepClone(request.TemplateKey);

            if (request.Name is not null)  clone.UpdateName(request.Name);
            if (request.Price is not null) clone.UpdatePrice(request.Price.Value);
            if (request.Stock is not null) clone.UpdateStock(request.Stock.Value);

            foreach (var tag in request.ExtraTags)
                clone.Tags.Add(tag);

            return Ok(new { clone.Id, clone.Name, clone.Price, clone.Stock, clone.Tags,
                Description = clone.GetDescription(), CopyType = "Deep" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private static object MapProduct(Product p) => new
    {
        p.Id,
        p.Name,
        p.Description,
        p.Price,
        p.Stock,
        p.CategoryId,
        CategoryName = p.Category?.Name,
        Brand        = p is ElectronicsProduct ep ? ep.Brand
                     : p is AccessoryProduct  ap ? ap.CompatibleWith
                     : string.Empty,
        Type         = p is ElectronicsProduct ? "Electronics" : "Accessory",
        p.ImageUrl,
        p.IsTemplate,
        p.TemplateName,
        p.IsActive,
        p.CreatedAt,
        p.UpdatedAt,
    };
}
