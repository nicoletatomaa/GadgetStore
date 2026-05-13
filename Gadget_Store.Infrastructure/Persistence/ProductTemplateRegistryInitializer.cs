using GadgetStore.Patterns.Creational.Prototype;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence;

// Incarca template-urile de produse din DB in ProductTemplateRegistry la startup.
// Inlocuieste valorile hardcodate din Program.cs cu date reale din baza de date.
public static class ProductTemplateRegistryInitializer
{
    public static async Task LoadFromDbAsync(
        ProductTemplateRegistry registry,
        GadgetStoreDbContext     context)
    {
        var templates = await context.Products
            .Where(p => p.IsTemplate && p.IsActive)
            .ToListAsync();

        foreach (var product in templates)
        {
            // Cheia template-ului: TemplateName din DB sau numele normalizat
            var key = !string.IsNullOrWhiteSpace(product.TemplateName)
                ? product.TemplateName
                : product.Name.ToLower().Replace(" ", "-");

            registry.Register(key, product);
        }

        if (templates.Count > 0)
            Console.WriteLine($"[TemplateRegistry] {templates.Count} template(uri) incarcate din DB: {string.Join(", ", templates.Select(t => t.TemplateName ?? t.Name))}");
        else
            Console.WriteLine("[TemplateRegistry] Niciun template in DB — registry populat cu valori hardcodate.");
    }
}
