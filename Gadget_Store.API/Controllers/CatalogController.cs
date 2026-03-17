using GadgetStore.Patterns.Structural.Composite;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogComponent _catalog;

    public CatalogController(ICatalogComponent catalog)
    {
        _catalog = catalog;
    }

    [HttpGet]
    public IActionResult GetCatalog()
    {
        return Ok(BuildNode(_catalog));
    }

    [HttpGet("display")]
    public IActionResult DisplayCatalog()
    {
        return Ok(new { tree = _catalog.Display() });
    }

    private static object BuildNode(ICatalogComponent component)
    {
        if (component.IsLeaf)
            return new { name = component.GetName(), price = component.GetTotalPrice(), isLeaf = true };

        var category = (CatalogCategory)component;
        return new
        {
            name = category.GetName(),
            totalPrice = category.GetTotalPrice(),
            isLeaf = false,
            children = category.GetChildren().Select(BuildNode).ToList()
        };
    }
}