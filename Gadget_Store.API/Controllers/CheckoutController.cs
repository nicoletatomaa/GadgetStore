using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Behavioral.ChainOfResponsibility;
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
    /// Checkout cu validare în lanț (Chain of Responsibility) și discount dinamic (Strategy).
    /// Cererea trece prin: EmptyCart → NegativePrice → MinimumOrder → Region.
    /// Dacă oricare handler eșuează, comanda este respinsă cu motivul specific.
    /// </summary>
    [HttpPost]
    public IActionResult Checkout([FromBody] CheckoutRequest request)
    {
        try
        {
            // ── Chain of Responsibility — validare ────────────────────
            var validationRequest = new OrderValidationRequest
            {
                Items = request.Items
                    .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
                    .ToList(),
                Region = request.Region,
                DiscountAmount = request.DiscountAmount
            };

            var chain = OrderValidationChain.Build();
            var validation = chain.Handle(validationRequest, new OrderValidationResult());

            if (!validation.IsValid)
                return BadRequest(new
                {
                    message = "Validarea comenzii a eșuat.",
                    errors = validation.Errors,
                    passedValidators = validation.PassedHandlers
                });

            // ── Strategy — discount ───────────────────────────────────
            var discountStrategy = DiscountStrategyFactory.Create(
                request.DiscountType, request.DiscountAmount);

            var subtotal = request.Items.Sum(i => i.UnitPrice * i.Quantity);
            var discountAmount = discountStrategy.ApplyDiscount(subtotal);

            // ── Façade — procesează comanda ───────────────────────────
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
                },
                Validation = new
                {
                    PassedHandlers = validation.PassedHandlers
                }
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}