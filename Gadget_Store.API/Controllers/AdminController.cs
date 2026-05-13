using GadgetStore.API.DTOs;
using GadgetStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IProductRepository  _products;
    private readonly IOrderRepository    _orders;
    private readonly IUserRepository     _users;
    private readonly IReviewRepository   _reviews;

    public AdminController(
        IProductRepository products,
        IOrderRepository   orders,
        IUserRepository    users,
        IReviewRepository  reviews)
    {
        _products = products;
        _orders   = orders;
        _users    = users;
        _reviews  = reviews;
    }

    /// <summary>
    /// Dashboard admin: statistici sumar — produse, comenzi, utilizatori, stoc critic.
    /// Necesita rol Admin.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var totalProducts  = await _products.CountAsync();
        var allProducts    = await _products.GetAllAsync(1, 100);
        var criticalStock  = allProducts.Where(p => p.Stock <= 5).ToList();

        var allOrders   = await _orders.GetAllAsync(1, 50);
        var today       = DateTime.UtcNow.Date;
        var todayOrders = allOrders.Where(o => o.CreatedAt.Date == today).ToList();

        var allUsers = await _users.GetAllAsync(1, 50);

        var thisMonth     = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var ordersThisMonth = allOrders.Count(o => o.CreatedAt >= thisMonth);

        return Ok(new
        {
            salesToday      = todayOrders.Sum(o => o.TotalAmount),
            newOrders       = todayOrders.Count,
            criticalStock   = criticalStock.Count,
            newUsers        = allUsers.Count(u => u.CreatedAt.Date == today),
            totalRevenue    = allOrders.Sum(o => o.TotalAmount),
            ordersThisMonth,
        });
    }

    /// <summary>Lista toti utilizatorii paginat. Necesita rol Admin.</summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20)
    {
        var users = await _users.GetAllAsync(page, pageSize);
        var result = users.Select(u => new
        {
            u.Id,
            u.Email,
            u.Role,
            u.FirstName,
            u.LastName,
            u.Phone,
            u.IsActive,
            u.CreatedAt
        });
        return Ok(result);
    }

    /// <summary>Schimba rolul unui utilizator (Customer/Admin). Necesita rol Admin.</summary>
    [HttpPatch("users/{id:guid}/role")]
    public async Task<IActionResult> ChangeUserRole(Guid id, [FromBody] ChangeRoleRequest req)
    {
        if (req.Role is not ("Customer" or "Admin"))
            return BadRequest(new { message = "Rol invalid. Valorile acceptate: Customer, Admin." });

        var user = await _users.GetByIdAsync(id);
        if (user is null) return NotFound(new { message = "Utilizatorul nu a fost gasit." });

        user.SetRole(req.Role);
        await _users.UpdateAsync(user);

        return Ok(new { user.Id, user.Email, user.Role });
    }

    /// <summary>
    /// Raport vanzari: lista comenzilor cu totaluri, sortate descrescator.
    /// Necesita rol Admin.
    /// </summary>
    [HttpGet("reports/sales")]
    public async Task<IActionResult> SalesReport(
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 20)
    {
        var orders = await _orders.GetAllAsync(page, pageSize);

        var report = orders.Select(o => new
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
            ItemsCount = o.Items.Count
        });

        return Ok(new
        {
            Page     = page,
            PageSize = pageSize,
            Data     = report,
            Total    = orders.Count()
        });
    }
}
