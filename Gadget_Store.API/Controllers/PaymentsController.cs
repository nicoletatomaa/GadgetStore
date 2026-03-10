using GadgetStore.API.DTOs;
using GadgetStore.Infrastructure.Payments;
using GadgetStore.Patterns.Creational;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
     private readonly PaymentProvider _paymentProvider;

     public PaymentsController(PaymentProvider paymentProvider)
     {
          _paymentProvider = paymentProvider;
     }

     /// <summary>
     /// Procesează o plată folosind metoda selectată.
     /// Method acceptat: card | paypal | crypto
     ///
     /// Pattern: Factory Method — PaymentProvider selectează factory-ul
     /// corect la runtime; controllerul nu știe ce processor se folosește.
     /// </summary>
     [HttpPost]
     public IActionResult ProcessPayment([FromBody] ProcessPaymentRequest request)
     {
          PaymentProcessorFactory factory;
          try
          {
               factory = _paymentProvider.GetService(request.Method);
          }
          catch (ArgumentException ex)
          {
               return BadRequest(new { message = ex.Message });
          }

          var result = factory.Process(request.Amount);

          return Ok(new
          {
               Method = request.Method,
               Amount = request.Amount,
               result.Success,
               result.Message,
               result.TransactionId
          });
     }
}