using GadgetStore.API.DTOs;
using GadgetStore.Patterns.Creational.Prototype;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
     private readonly ProductTemplateRegistry _registry;

     public ProductsController(ProductTemplateRegistry registry)
     {
          _registry = registry;
     }

     /// <summary>
     /// Returnează toate cheile de prototipuri înregistrate în registry.
     /// </summary>
     [HttpGet("templates")]
     public IActionResult GetTemplates()
     {
          return Ok(_registry.GetRegisteredKeys());
     }

     /// <summary>
     /// Clonează un prototip folosind Shallow Copy.
     /// Tags-urile sunt partajate cu originalul — modificarea lor pe clonă
     /// afectează și prototipul original.
     ///
     /// Pattern: Prototype (Shallow Copy) — MemberwiseClone() copiază
     /// valori primitive dar păstrează aceeași referință pentru obiecte.
     /// </summary>
     [HttpPost("clone/shallow")]
     public IActionResult ShallowClone([FromBody] CloneProductRequest request)
     {
          try
          {
               var clone = _registry.ShallowClone(request.TemplateKey);

               if (request.Name is not null) clone.UpdateName(request.Name);
               if (request.Price is not null) clone.UpdatePrice(request.Price.Value);
               if (request.Stock is not null) clone.UpdateStock(request.Stock.Value);

               // Shallow: adăugăm direct în lista partajată
               foreach (var tag in request.ExtraTags)
                    clone.Tags.Add(tag);

               return Ok(new
               {
                    clone.Id,
                    clone.Name,
                    clone.Price,
                    clone.Stock,
                    clone.Tags,
                    Description = clone.GetDescription(),
                    CopyType = "Shallow"
               });
          }
          catch (KeyNotFoundException ex)
          {
               return NotFound(new { message = ex.Message });
          }
     }

     /// <summary>
     /// Clonează un prototip folosind Deep Copy.
     /// Tags-urile sunt independente față de original — modificările
     /// pe clonă nu afectează prototipul.
     ///
     /// Pattern: Prototype (Deep Copy) — se creează o nouă listă de Tags,
     /// garantând izolarea completă față de original.
     /// </summary>
     [HttpPost("clone/deep")]
     public IActionResult DeepClone([FromBody] CloneProductRequest request)
     {
          try
          {
               var clone = _registry.DeepClone(request.TemplateKey);

               if (request.Name is not null) clone.UpdateName(request.Name);
               if (request.Price is not null) clone.UpdatePrice(request.Price.Value);
               if (request.Stock is not null) clone.UpdateStock(request.Stock.Value);

               // Deep: adăugăm în lista nouă, independentă de original
               foreach (var tag in request.ExtraTags)
                    clone.Tags.Add(tag);

               return Ok(new
               {
                    clone.Id,
                    clone.Name,
                    clone.Price,
                    clone.Stock,
                    clone.Tags,
                    Description = clone.GetDescription(),
                    CopyType = "Deep"
               });
          }
          catch (KeyNotFoundException ex)
          {
               return NotFound(new { message = ex.Message });
          }
     }
}