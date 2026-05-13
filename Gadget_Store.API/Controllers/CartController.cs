using System.Security.Claims;
using System.Text.Json;
using GadgetStore.API.DTOs;
using GadgetStore.API.Services;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartRepository    _cartRepo;
    private readonly IProductRepository _products;
    private readonly CartUndoManager    _undoManager;

    public CartController(
        ICartRepository    cartRepo,
        IProductRepository products,
        CartUndoManager    undoManager)
    {
        _cartRepo    = cartRepo;
        _products    = products;
        _undoManager = undoManager;
    }

    private Guid GetUserId()
    {
        var str = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(str, out var id) ? id : Guid.Empty;
    }

    // ── GET /api/cart ─────────────────────────────────────────────────────────
    /// <summary>Returneaza cosul curent al utilizatorului din baza de date.</summary>
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var items  = await _cartRepo.GetByUserAsync(userId);
        return Ok(BuildResponse(items, userId));
    }

    // ── POST /api/cart/items — Command pattern ────────────────────────────────
    /// <summary>
    /// Adauga un produs in cos.
    /// Pattern: Command — operatia este inregistrata in stiva undo (CartUndoManager).
    /// Undo: elimina produsul din cos.
    /// </summary>
    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddToCartRequest req)
    {
        var userId  = GetUserId();
        var product = await _products.GetByIdAsync(req.ProductId);
        if (product is null) return NotFound(new { message = "Produsul nu a fost gasit." });
        if (product.Stock < req.Quantity) return BadRequest(new { message = $"Stoc insuficient. Disponibil: {product.Stock}" });

        var decoratorsJson = req.Decorators.Count > 0
            ? JsonSerializer.Serialize(req.Decorators)
            : null;

        var existing = await _cartRepo.GetItemAsync(userId, req.ProductId);
        int cartItemId;
        int oldQty = 0;
        bool isNew;

        if (existing is not null)
        {
            oldQty = existing.Quantity;
            existing.UpdateQuantity(existing.Quantity + req.Quantity);
            existing.UpdateDecorators(decoratorsJson ?? existing.Decorators);
            await _cartRepo.UpdateAsync(existing);
            cartItemId = existing.Id;
            isNew = false;
        }
        else
        {
            var item = new CartItem(userId, req.ProductId, req.Quantity, decoratorsJson);
            await _cartRepo.AddAsync(item);
            cartItemId = item.Id;
            isNew = true;
        }

        // Command pattern — inregistreaza operatia inversa in stiva undo
        if (isNew)
        {
            _undoManager.Push(userId, async () =>
            {
                await _cartRepo.RemoveAsync(cartItemId);
                return $"Undo: eliminat '{product.Name}' din cos";
            });
        }
        else
        {
            var savedOldQty = oldQty;
            _undoManager.Push(userId, async () =>
            {
                var ci = await _cartRepo.GetItemAsync(userId, req.ProductId);
                if (ci is not null) { ci.UpdateQuantity(savedOldQty); await _cartRepo.UpdateAsync(ci); }
                return $"Undo: cantitate '{product.Name}' restaurata la {savedOldQty}";
            });
        }

        var items = await _cartRepo.GetByUserAsync(userId);
        return Ok(BuildResponse(items, userId));
    }

    // ── DELETE /api/cart/items/{id} — Command pattern ─────────────────────────
    /// <summary>
    /// Elimina un produs din cos.
    /// Pattern: Command — operatia este inregistrata in stiva undo (CartUndoManager).
    /// Undo: readauga produsul cu cantitatea si decoratorii originali.
    /// </summary>
    [HttpDelete("items/{id:int}")]
    public async Task<IActionResult> RemoveItem(int id)
    {
        var userId = GetUserId();
        var items  = await _cartRepo.GetByUserAsync(userId);
        var item   = items.FirstOrDefault(i => i.Id == id);
        if (item is null) return NotFound(new { message = "Produsul nu este in cos." });

        var savedProductId  = item.ProductId;
        var savedQuantity   = item.Quantity;
        var savedDecorators = item.Decorators;

        await _cartRepo.RemoveAsync(id);

        // Command pattern — inregistreaza operatia inversa
        _undoManager.Push(userId, async () =>
        {
            var restore = new CartItem(userId, savedProductId, savedQuantity, savedDecorators);
            await _cartRepo.AddAsync(restore);
            return $"Undo: produs readaugat in cos (qty {savedQuantity})";
        });

        var updated = await _cartRepo.GetByUserAsync(userId);
        return Ok(BuildResponse(updated, userId));
    }

    // ── PUT /api/cart/update — Command pattern ────────────────────────────────
    /// <summary>
    /// Modifica cantitatea unui item din cos.
    /// Pattern: Command — cantitatea anterioara este salvata pentru undo.
    /// </summary>
    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartQuantityRequestNew req)
    {
        var userId = GetUserId();
        var allItems = await _cartRepo.GetByUserAsync(userId);
        var item     = allItems.FirstOrDefault(i => i.Id == req.CartItemId);
        if (item is null) return NotFound(new { message = "Produsul nu este in cos." });

        var oldQty = item.Quantity;
        item.UpdateQuantity(req.Quantity);
        await _cartRepo.UpdateAsync(item);

        // Command pattern — salveaza cantitatea veche pentru undo
        var savedId  = item.Id;
        var savedOld = oldQty;
        _undoManager.Push(userId, async () =>
        {
            var ci = (await _cartRepo.GetByUserAsync(userId)).FirstOrDefault(i => i.Id == savedId);
            if (ci is not null) { ci.UpdateQuantity(savedOld); await _cartRepo.UpdateAsync(ci); }
            return $"Undo: cantitate restaurata la {savedOld}";
        });

        var updated = await _cartRepo.GetByUserAsync(userId);
        return Ok(BuildResponse(updated, userId));
    }

    // ── POST /api/cart/undo — Command pattern ─────────────────────────────────
    /// <summary>
    /// Anuleaza ultima operatie efectuata pe cos.
    /// Pattern: Command — CartUndoManager scoate ultima actiune din stiva si o executa invers.
    /// </summary>
    [HttpPost("undo")]
    public async Task<IActionResult> Undo()
    {
        var userId = GetUserId();
        var description = await _undoManager.Undo(userId);
        if (description is null)
            return BadRequest(new { message = "Nu exista operatii de anulat." });

        var items = await _cartRepo.GetByUserAsync(userId);
        var response = BuildResponse(items, userId);
        return Ok(new { message = description, cart = response });
    }

    // ── DELETE /api/cart ──────────────────────────────────────────────────────
    /// <summary>Goleste complet cosul si stiva de undo.</summary>
    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        var userId = GetUserId();
        await _cartRepo.ClearAsync(userId);
        _undoManager.Clear(userId);
        return Ok(BuildResponse(Enumerable.Empty<CartItem>(), userId));
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private object BuildResponse(IEnumerable<CartItem> items, Guid userId)
    {
        var list = items.Select(i =>
        {
            var decorators = i.Decorators is not null
                ? JsonSerializer.Deserialize<string[]>(i.Decorators) ?? Array.Empty<string>()
                : Array.Empty<string>();

            var unitPrice   = i.Product?.Price ?? 0m;
            var extraPrice  = CalculateDecoratorExtra(decorators, unitPrice);
            var finalPrice  = unitPrice + extraPrice;

            return new
            {
                i.Id,
                ProductId   = i.ProductId,
                ProductName = i.Product?.Name ?? "—",
                UnitPrice   = unitPrice,
                i.Quantity,
                Decorators  = decorators,
                FinalPrice  = finalPrice,
            };
        }).ToList();

        var subtotal  = list.Sum(i => (decimal)i.FinalPrice * i.Quantity);
        var itemCount = list.Sum(i => i.Quantity);

        return new
        {
            Items     = list,
            Subtotal  = subtotal,
            ItemCount = itemCount,
            CanUndo   = _undoManager.CanUndo(userId),
        };
    }

    private static decimal CalculateDecoratorExtra(string[] decorators, decimal basePrice)
    {
        var extra = 0m;
        foreach (var d in decorators)
        {
            extra += d switch
            {
                "Warranty"  => 49m,
                "GiftWrap"  => 15m,
                "Insurance" => basePrice * 0.02m,
                _           => 0m
            };
        }
        return extra;
    }
}

// DTO pentru update cantitate (separat pentru a evita conflicte cu vechiul DTO)
public class UpdateCartQuantityRequestNew
{
    public int CartItemId { get; set; }
    public int Quantity   { get; set; }
}
