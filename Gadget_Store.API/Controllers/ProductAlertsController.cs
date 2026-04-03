using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Behavioral.Observer;
using GadgetStore.Patterns.Creational.Prototype;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductAlertsController : ControllerBase
{
    private readonly ProductTemplateRegistry _registry;

    public ProductAlertsController(ProductTemplateRegistry registry)
    {
        _registry = registry;
    }

    /// <summary>
    /// Actualizează stocul unui produs și notifică toți observatorii abonați.
    /// Pattern: Observer — Product este subiectul; EmailAlertObserver
    /// și LowStockLogObserver sunt notificați automat la schimbare.
    /// </summary>
    [HttpPost("{templateKey}/update-stock")]
    public IActionResult UpdateStock(string templateKey, [FromBody] UpdateStockRequest request)
    {
        try
        {
            var product = _registry.DeepClone(templateKey);

            var emailObserver = new EmailAlertObserver("admin@gadgetstore.ro");
            var lowStockObserver = new LowStockLogObserver();

            product.Subscribe(emailObserver);
            product.Subscribe(lowStockObserver);

            product.UpdateStock(request.NewStock);

            return Ok(new
            {
                ProductName = product.Name,
                NewStock = product.Stock,
                EmailAlerts = emailObserver.ReceivedAlerts,
                LowStockLog = lowStockObserver.Log,
                ObserversNotified = 2
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Actualizează prețul unui produs și notifică toți observatorii abonați.
    /// Pattern: Observer — același mecanism ca la stoc, alt eveniment.
    /// </summary>
    [HttpPost("{templateKey}/update-price")]
    public IActionResult UpdatePrice(string templateKey, [FromBody] UpdatePriceRequest request)
    {
        try
        {
            var product = _registry.DeepClone(templateKey);

            var emailObserver = new EmailAlertObserver("admin@gadgetstore.ro");
            product.Subscribe(emailObserver);

            product.UpdatePrice(request.NewPrice);

            return Ok(new
            {
                ProductName = product.Name,
                OldPrice = product.Price,
                NewPrice = request.NewPrice,
                EmailAlerts = emailObserver.ReceivedAlerts
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}