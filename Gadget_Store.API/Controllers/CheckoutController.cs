using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Behavioral.Strategy;
using GadgetStore.Patterns.Structural.Facade;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutFacade _checkout;

    public CheckoutController(ICheckoutFacade checkout)
    {
        _checkout = checkout;
    }

    /// <summary>
    /// Checkout cu discount dinamic selectat la runtime.
    /// Pattern: Strategy — DiscountStrategyFactory alege algoritmul
    /// corect fără if/else în controller.
    /// </summary>
    [HttpPost]
    public IActionResult Checkout([FromBody] CheckoutRequest request)
    {
        try
        {
            // ── Strategy ──────────────────────────────────────────────
            var discountStrategy = DiscountStrategyFactory.Create(
                request.DiscountType, request.DiscountAmount);

            var subtotal = request.Items.Sum(i => i.UnitPrice * i.Quantity);
            var discountAmount = discountStrategy.ApplyDiscount(subtotal);

            // ── Façade ────────────────────────────────────────────────
            var facadeRequest = new CheckoutFacadeRequest
            {
                Items = request.Items
                    .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
                    .ToList(),
                Region = request.Region,
                PaymentMethod = request.PaymentMethod,
                DiscountAmount = discountAmount,
                Notes = request.Notes
            };

            var result = _checkout.ProcessCheckout(facadeRequest);

            if (!result.Success)
                return BadRequest(new { message = result.Payment.Message });

            return Ok(new
            {
                result.Order.Id,
                result.Order.Region,
                result.Order.PaymentMethod,
                Items = result.Order.Items.Select(i => new
                {
                    i.ProductName,
                    i.UnitPrice,
                    i.Quantity,
                    i.LineTotal
                }),
                result.Order.Subtotal,
                Discount = new
                {
                    Strategy = discountStrategy.GetDescription(),
                    Amount = discountAmount
                },
                result.Order.TaxAmount,
                result.Order.ShippingCost,
                result.Order.GrandTotal,
                Payment = new
                {
                    result.Payment.Success,
                    result.Payment.Message,
                    result.Payment.TransactionId
                }
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}