using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Behavioral.Command;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly Cart _cart;
    private readonly CartInvoker _invoker;

    public CartController(Cart cart, CartInvoker invoker)
    {
        _cart = cart;
        _invoker = invoker;
    }

    /// <summary>
    /// Returnează conținutul curent al coșului.
    /// </summary>
    [HttpGet]
    public IActionResult GetCart() => Ok(BuildCartResponse());

    /// <summary>
    /// Adaugă un produs în coș.
    /// Pattern: Command — AddToCartCommand este creat și executat prin CartInvoker.
    /// Comanda este stocată în stivă pentru undo ulterior.
    /// </summary>
    [HttpPost("add")]
    public IActionResult Add([FromBody] AddToCartRequest request)
    {
        var item = new CartItem
        {
            ProductName = request.ProductName,
            UnitPrice = request.UnitPrice,
            Quantity = request.Quantity
        };

        var command = new AddToCartCommand(_cart, item);
        _invoker.ExecuteCommand(command);

        return Ok(BuildCartResponse("Produs adăugat."));
    }

    /// <summary>
    /// Elimină un produs din coș.
    /// Pattern: Command — RemoveFromCartCommand stochează starea
    /// pentru a putea fi inversat prin undo.
    /// </summary>
    [HttpDelete("remove")]
    public IActionResult Remove([FromBody] RemoveFromCartRequest request)
    {
        var command = new RemoveFromCartCommand(
            _cart, request.ProductName, request.UnitPrice, request.Quantity);
        _invoker.ExecuteCommand(command);

        return Ok(BuildCartResponse("Produs eliminat."));
    }

    /// <summary>
    /// Anulează ultima operație efectuată pe coș.
    /// Pattern: Command — Invoker scoate ultima comandă din stivă și apelează Undo().
    /// </summary>
    [HttpPost("undo")]
    public IActionResult Undo()
    {
        var undone = _invoker.Undo();
        if (undone is null)
            return BadRequest(new { message = "Nu există operații de anulat." });

        return Ok(BuildCartResponse($"Undo executat: {undone}"));
    }

    private object BuildCartResponse(string? message = null) => new
    {
        Message = message,
        Items = _cart.Items.Select(i => new
        {
            i.ProductName,
            i.UnitPrice,
            i.Quantity,
            i.LineTotal
        }),
        Total = _cart.Total,
        History = _invoker.GetHistory().ToList()
    };
}