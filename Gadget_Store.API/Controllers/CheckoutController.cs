using GadgetStore.API.DTOs;
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
    /// Checkout complet într-un singur request.
    /// Pattern: Façade — ascunde Abstract Factory + Builder + Factory Method.
    /// </summary>
    [HttpPost]
    public IActionResult Checkout([FromBody] CheckoutRequest request)
    {
        try
        {
            var facadeRequest = new CheckoutFacadeRequest
            {
                Items = request.Items
                    .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
                    .ToList(),
                Region = request.Region,
                PaymentMethod = request.PaymentMethod,
                DiscountAmount = request.DiscountAmount,
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
                result.Order.DiscountAmount,
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