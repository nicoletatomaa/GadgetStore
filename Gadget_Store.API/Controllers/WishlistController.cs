using System.Security.Claims;
using GadgetStore.API.DTOs;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Patterns.Behavioral.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/wishlist")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistRepository _wishlist;
    private readonly IProductRepository  _products;
    private readonly Cart                _cart;
    private readonly CartInvoker         _invoker;

    public WishlistController(
        IWishlistRepository wishlist,
        IProductRepository  products,
        Cart                cart,
        CartInvoker         invoker)
    {
        _wishlist = wishlist;
        _products = products;
        _cart     = cart;
        _invoker  = invoker;
    }

    private Guid GetUserId()
    {
        var str = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(str, out var id) ? id : Guid.Empty;
    }

    /// <summary>Returneaza wishlist-ul utilizatorului autentificat.</summary>
    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        var userId = GetUserId();
        var items  = await _wishlist.GetByUserAsync(userId);

        return Ok(items.Select(w => new
        {
            w.Id,
            ProductId   = w.ProductId,
            ProductName = w.Product?.Name,
            Price       = w.Product?.Price,
            w.AddedAt
        }));
    }

    /// <summary>Adauga un produs in wishlist.</summary>
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddToWishlistRequest req)
    {
        var userId = GetUserId();

        if (!await _products.ExistsAsync(req.ProductId))
            return NotFound(new { message = "Produsul nu a fost gasit." });

        if (await _wishlist.ExistsAsync(userId, req.ProductId))
            return Conflict(new { message = "Produsul este deja in wishlist." });

        var item = new WishlistItem(userId, req.ProductId);
        await _wishlist.AddAsync(item);

        return StatusCode(StatusCodes.Status201Created, new { message = "Adaugat in wishlist." });
    }

    /// <summary>Elimina un produs din wishlist.</summary>
    [HttpDelete("{productId:guid}")]
    public async Task<IActionResult> Remove(Guid productId)
    {
        var userId = GetUserId();
        await _wishlist.RemoveAsync(userId, productId);
        return NoContent();
    }

    /// <summary>
    /// Muta un produs din wishlist in cosul de cumparaturi.
    /// Pattern: Command — AddToCartCommand executat prin CartInvoker pentru undo support.
    /// </summary>
    [HttpPost("{productId:guid}/move-to-cart")]
    public async Task<IActionResult> MoveToCart(Guid productId)
    {
        var userId  = GetUserId();
        var product = await _products.GetByIdAsync(productId);

        if (product is null)
            return NotFound(new { message = "Produsul nu a fost gasit." });

        // Command pattern — adauga in cos cu suport undo
        var cartItem = new GadgetStore.Patterns.Behavioral.Command.CartItem
        {
            ProductName = product.Name,
            UnitPrice   = product.Price,
            Quantity    = 1
        };
        _invoker.ExecuteCommand(new AddToCartCommand(_cart, cartItem));

        // Elimina din wishlist dupa mutare
        await _wishlist.RemoveAsync(userId, productId);

        return Ok(new
        {
            message     = $"'{product.Name}' mutat din wishlist in cos.",
            CartTotal   = _cart.Total,
            CartItems   = _cart.Items.Count
        });
    }
}
