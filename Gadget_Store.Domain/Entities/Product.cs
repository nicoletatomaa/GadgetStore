using GadgetStore.Patterns.Creational.Prototype;

namespace GadgetStore.Domain.Entities;

public abstract class Product : ICloneableProduct
{
     public Guid Id { get; protected set; } = Guid.NewGuid();
     public string Name { get; protected set; }
     public decimal Price { get; protected set; }
     public int Stock { get; protected set; }

     /// <summary>
     /// Listă de etichete — folosită pentru a demonstra shallow vs deep copy.
     /// </summary>
     public List<string> Tags { get; protected set; } = new();

     protected Product(string name, decimal price, int stock)
     {
          Name = name;
          Price = price;
          Stock = stock;
     }

     public void UpdateStock(int newStock) => Stock = newStock;
     public void UpdatePrice(decimal newPrice) => Price = newPrice;
     public void UpdateName(string newName) => Name = newName;

     public abstract string GetDescription();
     public abstract ICloneableProduct Clone();
     public abstract ICloneableProduct DeepClone();
}