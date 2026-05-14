using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Structural.Composite;
using Microsoft.AspNetCore.Mvc;

namespace GadgetStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogComponent  _catalog;
    private readonly ICategoryRepository _categories;

    public CatalogController(ICatalogComponent catalog, ICategoryRepository categories)
    {
        _catalog    = catalog;
        _categories = categories;
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

    // Categorii din BD cu ID-uri reale — folosit de admin pentru dropdown
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var cats = await _categories.GetRootCategoriesAsync();
        return Ok(cats.Select(c => new
        {
            c.Id,
            c.Name,
            children = c.SubCategories.Select(s => new { s.Id, s.Name })
        }));
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