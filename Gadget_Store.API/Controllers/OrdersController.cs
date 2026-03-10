using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Creational.Builder;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
     /// <summary>
     /// Creează o comandă standard folosind Builder + Director.
     /// Pașii de construire: items → regiune → plată → discount → taxă → transport → note.
     ///
     /// Pattern: Builder — Director coordonează pașii, Builder asamblează
     /// obiectul OrderSummary fără ca clientul să cunoască logica internă.
     /// </summary>
     [HttpPost("standard")]
     public IActionResult CreateStandardOrder([FromBody] BuildOrderRequest request)
     {
          var builder = new OrderBuilder();
          var director = new OrderDirector(builder);

          var items = request.Items
              .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
              .ToList();

          var order = director.BuildStandardOrder(
              items,
              request.Region,
              request.PaymentMethod,
              request.TaxRate,
              request.DiscountAmount,
              request.Notes);

          return Ok(new
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
               order.Notes
          });
     }

     /// <summary>
     /// Creează o comandă express folosind Builder + Director.
     /// Livrare fixă 50 lei, fără discount, fără note.
     ///
     /// Pattern: Builder — același Builder, altă rețetă de construire în Director.
     /// </summary>
     [HttpPost("express")]
     public IActionResult CreateExpressOrder([FromBody] BuildExpressOrderRequest request)
     {
          var builder = new OrderBuilder();
          var director = new OrderDirector(builder);

          var items = request.Items
              .Select(i => (i.ProductName, i.UnitPrice, i.Quantity))
              .ToList();

          var order = director.BuildExpressOrder(
              items,
              request.PaymentMethod,
              request.TaxRate);

          return Ok(new
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
               order.GrandTotal
          });
     }
}