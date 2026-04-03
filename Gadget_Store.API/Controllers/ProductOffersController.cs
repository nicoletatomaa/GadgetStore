using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Creational.Prototype;
using GadgetStore.Patterns.Structural.Decorator;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/products/offers")]
public class ProductOffersController : ControllerBase
{
    private readonly ProductTemplateRegistry _registry;

    public ProductOffersController(ProductTemplateRegistry registry)
    {
        _registry = registry;
    }

    /// Construiește o ofertă de produs cu extra-uri opționale.
    ///
    /// Pattern: Decorator — fiecare extra învelește oferta precedentă
    /// adăugând preț și descriere fără a modifica clasa Product.
    /// Decoratoarele se compun în lanț: ordinea din "extras" contează.
    ///
    /// Extras acceptate: warranty | giftWrap | insurance
    ///
    /// Exemplu: ["warranty", "insurance"] → asigurarea se calculează
    /// pe prețul deja majorat cu garanția (compunere corectă).
    [HttpPost]
    public IActionResult BuildOffer([FromBody] ProductOfferRequest request)
    {
        try
        {
            var product = _registry.DeepClone(request.TemplateKey);
            var basePrice = product.Price;

            IProductOffer offer = new BaseProductOffer(product);

            foreach (var extra in request.Extras)
            {
                offer = extra.ToLower() switch
                {
                    "warranty" => new WarrantyDecorator(offer),
                    "giftwrap" => new GiftWrapDecorator(offer),
                    "insurance" => new InsuranceDecorator(offer),
                    _ => throw new ArgumentException(
                        $"Extra necunoscut: '{extra}'. Valori acceptate: warranty, giftWrap, insurance")
                };
            }

            // Construim vizual lanțul de decoratoare pentru răspuns
            var chain = new[] { "BaseProductOffer" }
                .Concat(request.Extras.Select(e => char.ToUpper(e[0]) + e[1..] + "Decorator"))
                .ToList();

            return Ok(new
            {
                Product = offer.GetName(),
                TemplateKey = request.TemplateKey,
                BasePrice = basePrice,
                FinalPrice = offer.GetPrice(),
                PriceIncrease = Math.Round(offer.GetPrice() - basePrice, 2),
                Description = offer.GetDescription(),
                Extras = offer.GetExtras().ToList(),
                DecoratorChain = string.Join(" → ", chain)
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}