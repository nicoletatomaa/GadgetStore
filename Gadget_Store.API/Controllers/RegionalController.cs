using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Creational;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegionalController : ControllerBase
{
     private readonly IServiceProvider _serviceProvider;

     public RegionalController(IServiceProvider serviceProvider)
     {
          _serviceProvider = serviceProvider;
     }

     /// <summary>
     /// Calculează taxe și transport pentru o sumă, în funcție de regiune.
     /// Region acceptat: EU | US | Asia
     ///
     /// Pattern: Abstract Factory — fiecare regiune are propria fabrică
     /// care creează combinația corectă de ITaxCalculator + IShippingProvider.
     /// </summary>
     [HttpPost("{region}/summary")]
     public IActionResult GetSummary(string region, [FromBody] RegionalSummaryRequest request)
     {
          IRegionalFactory? factory;
          try
          {
               factory = _serviceProvider.GetKeyedService<IRegionalFactory>(region)
                         ?? throw new ArgumentException($"Regiune necunoscută: {region}. Valori acceptate: EU, US, Asia");
          }
          catch (ArgumentException ex)
          {
               return BadRequest(new { message = ex.Message });
          }

          var taxCalc = factory.CreateTaxCalculator();
          var shipping = factory.CreateShippingProvider();
          var tax = taxCalc.CalculateTax(request.Amount);
          var shippingCost = shipping.GetShippingCost(request.Amount);

          return Ok(new
          {
               region,
               subtotal = request.Amount,
               tax = new { amount = tax, description = taxCalc.GetTaxDescription() },
               shipping = new { cost = shippingCost, provider = shipping.GetProviderName() },
               grandTotal = request.Amount + tax + shippingCost
          });
     }
}