using GadgetStore.API.DTOs;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Patterns.Creational.Builder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository   _orders;
    private readonly IUserRepository    _users;

    public OrdersController(IOrderRepository orders, IUserRepository users)
    {
        _orders = orders;
        _users  = users;
    }

    // ── GET /api/orders ───────────────────────────────────────────────────────
    /// <summary>Returneaza comenzile utilizatorului autentificat.</summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMyOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var orders = await _orders.GetByUserAsync(userId, page, pageSize);
        return Ok(orders.Select(MapOrder));
    }

    // ── GET /api/orders/{id} ──────────────────────────────────────────────────
    /// <summary>Returneaza detaliile unei comenzi (proprietar sau Admin).</summary>
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId   = GetCurrentUserId();
        var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
                     ?? User.FindFirst("role")?.Value;

        var order = await _orders.GetByIdAsync(id);
        if (order is null) return NotFound(new { message = "Comanda nu a fost gasita." });

        if (order.UserId != userId && roleClaim != "Admin")
            return Forbid();

        return Ok(MapOrderDetail(order));
    }

    // ── PATCH /api/orders/{id}/status ─────────────────────────────────────────
    /// <summary>Actualizeaza statusul comenzii [Admin].</summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest req)
    {
        var order = await _orders.GetByIdAsync(id);
        if (order is null) return NotFound(new { message = "Comanda nu a fost gasita." });

        order.UpdateStatus(req.Status);
        await _orders.UpdateAsync(order);

        return Ok(new { order.Id, order.Status });
    }

    // ── POST /api/orders/standard — Builder pattern ────────────────────────────
    /// <summary>
    /// Creeaza o comanda standard folosind Builder + Director.
    /// Pattern: Builder — Director coordoneaza pasii, Builder asambleaza OrderSummary.
    /// </summary>
    [HttpPost("standard")]
    public IActionResult CreateStandardOrder([FromBody] BuildOrderRequest request)
    {
        var builder  = new OrderBuilder();
        var director = new OrderDirector(builder);

        var items = request.Items
            .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
            .ToList();

        var order = director.BuildStandardOrder(
            items, request.Region, request.PaymentMethod,
            request.TaxRate, request.DiscountAmount, request.Notes);

        return Ok(MapBuilderOrder(order));
    }

    // ── POST /api/orders/express — Builder pattern ─────────────────────────────
    /// <summary>
    /// Creeaza o comanda express folosind Builder + Director.
    /// Pattern: Builder — aceeasi interfata, alta reteta de construire in Director.
    /// </summary>
    [HttpPost("express")]
    public IActionResult CreateExpressOrder([FromBody] BuildExpressOrderRequest request)
    {
        var builder  = new OrderBuilder();
        var director = new OrderDirector(builder);

        var items = request.Items
            .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
            .ToList();

        var order = director.BuildExpressOrder(items, request.PaymentMethod, request.TaxRate);

        return Ok(MapBuilderOrder(order));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;
        return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    private static object MapOrder(Order o) => new
    {
        o.Id,
        o.Status,
        o.Region,
        o.Subtotal,
        o.DiscountAmount,
        o.TaxAmount,
        o.ShippingCost,
        o.TotalAmount,
        o.CreatedAt,
        o.UpdatedAt,
        ItemsCount = o.Items.Count,
    };

    private static object MapOrderDetail(Order o)
    {
        var shippingAddr = o.ShippingAddress is not null
            ? JsonSerializer.Deserialize<object>(o.ShippingAddress)
            : null;
        var billingAddr = o.BillingAddress is not null
            ? JsonSerializer.Deserialize<object>(o.BillingAddress)
            : null;

        var lastPayment = o.Payments.OrderByDescending(p => p.ProcessedAt).FirstOrDefault();

        return new
        {
            o.Id,
            o.UserId,
            o.Status,
            o.Region,
            o.Subtotal,
            o.DiscountAmount,
            o.TaxAmount,
            o.ShippingCost,
            o.TotalAmount,
            o.Notes,
            o.CreatedAt,
            o.UpdatedAt,
            ShippingAddress = shippingAddr,
            BillingAddress  = billingAddr,
            Items = o.Items.Select(i => new
            {
                i.Id,
                i.ProductId,
                ProductName = i.Product?.Name ?? "—",
                i.Quantity,
                i.UnitPrice,
                Decorators  = i.Decorators is not null ? JsonSerializer.Deserialize<string[]>(i.Decorators) : Array.Empty<string>(),
                i.FinalPrice,
            }),
            Payment = lastPayment is null ? null : new
            {
                lastPayment.Id,
                lastPayment.Method,
                lastPayment.Amount,
                lastPayment.Status,
                lastPayment.TransactionId,
                lastPayment.ProcessedAt,
            },
        };
    }

    private static object MapBuilderOrder(OrderSummary order) => new
    {
        order.Id,
        order.IsExpress,
        order.Region,
        order.PaymentMethod,
        Items = order.Items.Select(i => new
        {
            i.ProductName,
            i.UnitPrice,
            i.Quantity,
            i.LineTotal
        }),
        order.Subtotal,
        order.DiscountAmount,
        order.TaxAmount,
        order.ShippingCost,
        order.GrandTotal,
        order.Notes,
    };
}
