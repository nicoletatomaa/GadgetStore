using System.Security.Claims;
using System.Text.Json;
using GadgetStore.API.DTOs;
using GadgetStore.API.Services;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Infrastructure.Payments;
using GadgetStore.Patterns.Behavioral.ChainOfResponsibility;
using GadgetStore.Patterns.Creational;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/checkout")]
[Authorize]
public class CheckoutController : ControllerBase
{
    private readonly ICartRepository    _cartRepo;
    private readonly IOrderRepository   _orderRepo;
    private readonly IProductRepository _products;
    private readonly ICouponRepository  _coupons;
    private readonly PaymentProvider    _paymentProvider;
    private readonly CartUndoManager    _undoManager;
    private readonly IServiceProvider   _services;

    public CheckoutController(
        ICartRepository    cartRepo,
        IOrderRepository   orderRepo,
        IProductRepository products,
        ICouponRepository  coupons,
        PaymentProvider    paymentProvider,
        CartUndoManager    undoManager,
        IServiceProvider   services)
    {
        _cartRepo        = cartRepo;
        _orderRepo       = orderRepo;
        _products        = products;
        _coupons         = coupons;
        _paymentProvider = paymentProvider;
        _undoManager     = undoManager;
        _services        = services;
    }

    private Guid GetUserId()
    {
        var str = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(str, out var id) ? id : Guid.Empty;
    }

    // ── POST /api/checkout/validate — Chain of Responsibility ─────────────────
    /// <summary>
    /// Valideaza cosul de cumparaturi folosind lantul de responsabilitate.
    /// Pattern: Chain of Responsibility — EmptyCart → NegativePrice → MinimumOrder → Region → StockAvailability
    /// </summary>
    [HttpPost("validate")]
    public async Task<IActionResult> Validate()
    {
        var userId    = GetUserId();
        var cartItems = (await _cartRepo.GetByUserAsync(userId)).ToList();

        var req = new OrderValidationRequest
        {
            UserId = userId,
            Items  = cartItems.Select(ci => new OrderValidationItem
            {
                ProductId = ci.ProductId,
                Name      = ci.Product?.Name ?? "Produs",
                Price     = ci.Product?.Price ?? 0,
                Qty       = ci.Quantity,
            }).ToList(),
            Region = "EU",
        };

        var chain  = OrderValidationChain.Build();
        var result = chain.Handle(req, new OrderValidationResult());

        return Ok(new
        {
            isValid        = result.IsValid,
            errors         = result.Errors,
            passedHandlers = result.PassedHandlers,
        });
    }

    // ── POST /api/checkout/summary — Abstract Factory ─────────────────────────
    /// <summary>
    /// Calculeaza totalurile checkout-ului pentru o regiune specificata.
    /// Pattern: Abstract Factory — fiecare regiune are propriul calculator de taxa si livrare.
    /// </summary>
    [HttpPost("summary")]
    public async Task<IActionResult> GetSummary([FromBody] FrontendCheckoutRequest req)
    {
        var userId    = GetUserId();
        var cartItems = (await _cartRepo.GetByUserAsync(userId)).ToList();

        var regionalFactory = _services.GetKeyedService<IRegionalFactory>(req.Region);
        if (regionalFactory is null) return BadRequest(new { message = "Regiune invalida." });

        var taxCalc  = regionalFactory.CreateTaxCalculator();
        var shipping = regionalFactory.CreateShippingProvider();

        var subtotal     = cartItems.Sum(ci => (ci.Product?.Price ?? 0) * ci.Quantity);
        var taxAmount    = taxCalc.CalculateTax(subtotal);
        var shippingCost = shipping.GetShippingCost(subtotal);

        decimal discountAmount = 0;
        if (!string.IsNullOrWhiteSpace(req.CouponCode))
        {
            var coupon = await _coupons.GetByCodeAsync(req.CouponCode.ToUpper());
            if (coupon is not null && coupon.IsValid(subtotal))
            {
                discountAmount = coupon.Type == "Percentage"
                    ? subtotal * coupon.Value / 100m
                    : coupon.Value;
            }
        }

        return Ok(new
        {
            subtotal,
            discountAmount,
            taxAmount,
            taxRate     = taxCalc.GetTaxDescription(),
            shippingCost,
            shippingMethod  = shipping.GetProviderName(),
            totalAmount     = subtotal - discountAmount + taxAmount + shippingCost,
            region          = req.Region,
        });
    }

    // ── POST /api/checkout/process — Facade + Builder + Strategy + Factory ────
    /// <summary>
    /// Proceseaza checkout-ul complet: valideaza, calculeaza, creeaza comanda in DB, proceseaza plata.
    /// Patterns: Chain of Responsibility + Abstract Factory + Strategy (discount) +
    ///           Builder (Order) + Factory Method (Payment) + Facade (orchestrare)
    /// </summary>
    [HttpPost("process")]
    public async Task<IActionResult> ProcessCheckout([FromBody] FrontendCheckoutRequest req)
    {
        var userId    = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var cartItems = (await _cartRepo.GetByUserAsync(userId)).ToList();

        // ── Chain of Responsibility — validare cos ────────────────────────────
        var validationReq = new OrderValidationRequest
        {
            UserId = userId,
            Region = req.Region,
            Items  = cartItems.Select(ci => new OrderValidationItem
            {
                ProductId = ci.ProductId,
                Name      = ci.Product?.Name ?? "Produs",
                Price     = ci.Product?.Price ?? 0,
                Qty       = ci.Quantity,
            }).ToList(),
        };

        var chain      = OrderValidationChain.Build();
        var validation = chain.Handle(validationReq, new OrderValidationResult());

        if (!validation.IsValid)
            return BadRequest(new { message = "Validare esuata.", errors = validation.Errors });

        // ── Abstract Factory — taxa si livrare regionale ──────────────────────
        var regionalFactory = _services.GetKeyedService<IRegionalFactory>(req.Region);
        if (regionalFactory is null) return BadRequest(new { message = "Regiune invalida." });

        var taxCalc      = regionalFactory.CreateTaxCalculator();
        var shippingProv = regionalFactory.CreateShippingProvider();

        var subtotal     = cartItems.Sum(ci => (ci.Product?.Price ?? 0) * ci.Quantity);
        var taxAmount    = taxCalc.CalculateTax(subtotal);
        var shippingCost = shippingProv.GetShippingCost(subtotal);

        // ── Strategy — discount ───────────────────────────────────────────────
        decimal discountAmount = 0;
        Coupon? usedCoupon     = null;

        if (!string.IsNullOrWhiteSpace(req.CouponCode))
        {
            var coupon = await _coupons.GetByCodeAsync(req.CouponCode.ToUpper());
            if (coupon is not null && coupon.IsValid(subtotal))
            {
                discountAmount = coupon.Type == "Percentage"
                    ? subtotal * coupon.Value / 100m
                    : coupon.Value;
                usedCoupon = coupon;
            }
        }

        var grandTotal = subtotal - discountAmount + taxAmount + shippingCost;

        // ── Builder — construieste Order in DB ────────────────────────────────
        var paymentMethodNorm = req.PaymentMethod.ToLower();
        var order = new Order(userId, req.Region, req.PaymentMethod);
        order.SetTotals(subtotal, discountAmount, taxAmount, shippingCost);
        order.SetAddresses(
            JsonSerializer.Serialize(req.ShippingAddress),
            JsonSerializer.Serialize(req.BillingAddress));
        order.SetCoupon(req.CouponCode);
        order.SetNotes(req.Notes);

        foreach (var ci in cartItems)
        {
            var decorators = ci.Decorators is not null
                ? (JsonSerializer.Deserialize<string[]>(ci.Decorators) ?? Array.Empty<string>())
                : Array.Empty<string>();

            var unitPrice   = ci.Product?.Price ?? 0;
            var finalPrice  = unitPrice + CalculateDecoratorExtra(decorators, unitPrice);

            order.Items.Add(new OrderItem(
                order.Id, ci.ProductId, ci.Quantity,
                unitPrice, finalPrice, ci.Decorators));
        }

        // ── Factory Method — procesare plata ──────────────────────────────────
        PaymentResult paymentResult;
        try
        {
            var factory  = _paymentProvider.GetService(paymentMethodNorm);
            paymentResult = factory.Process(grandTotal);
        }
        catch
        {
            paymentResult = new PaymentResult(
                true,
                "Plata simulata cu succes",
                $"SIM-{Guid.NewGuid().ToString()[..8].ToUpper()}");
        }

        var payment = new Payment(order.Id, req.PaymentMethod, grandTotal);
        if (paymentResult.Success)
            payment.MarkSuccess(paymentResult.TransactionId ?? $"TXN-{Guid.NewGuid().ToString()[..8]}");
        else
            payment.MarkFailed(paymentResult.Message ?? "Plata refuzata");

        order.Payments.Add(payment);

        // ── Salveaza in DB ────────────────────────────────────────────────────
        await _orderRepo.AddAsync(order);

        if (usedCoupon is not null)
        {
            usedCoupon.IncrementUsage();
            await _coupons.UpdateAsync(usedCoupon);
        }

        // Goleste cosul dupa checkout reusit
        await _cartRepo.ClearAsync(userId);
        _undoManager.Clear(userId);

        return Ok(new
        {
            success    = true,
            orderId    = order.Id,
            message    = "Comanda a fost plasata cu succes!",
            orderTotal = grandTotal,
        });
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private static decimal CalculateDecoratorExtra(string[] decorators, decimal basePrice)
    {
        return decorators.Sum(d => d switch
        {
            "Warranty"  => 49m,
            "GiftWrap"  => 15m,
            "Insurance" => basePrice * 0.02m,
            _           => 0m
        });
    }
}
