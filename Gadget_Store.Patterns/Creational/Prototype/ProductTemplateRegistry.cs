using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Creational.Prototype;

public class ProductTemplateRegistry
{
     private readonly Dictionary<string, Product> _templates = new();

     /// <summary>
     /// Înregistrează un produs ca prototip cu o cheie unică.
     /// </summary>
     public void Register(string key, Product product)
     {
          _templates[key] = product;
     }

     /// <summary>
     /// Returnează o shallow copy a prototipului.
     /// Tags-urile sunt partajate cu originalul.
     /// </summary>
     public Product ShallowClone(string key)
     {
          if (!_templates.TryGetValue(key, out var template))
               throw new KeyNotFoundException($"Template '{key}' nu există în registry.");

          return (Product)template.Clone();
     }

     /// <summary>
     /// Returnează o deep copy a prototipului.
     /// Tags-urile sunt independente față de original.
     /// </summary>
     public Product DeepClone(string key)
     {
          if (!_templates.TryGetValue(key, out var template))
               throw new KeyNotFoundException($"Template '{key}' nu există în registry.");

          return (Product)template.DeepClone();
     }

     public IEnumerable<string> GetRegisteredKeys() => _templates.Keys;
}