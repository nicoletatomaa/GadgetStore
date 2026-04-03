using GadgetStore.Domain.Interfaces;
using GadgetStore.Patterns.Creational.Prototype;

namespace GadgetStore.Domain.Entities;

public abstract class Product : ICloneableProduct, IProductSubject
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public string Name { get; protected set; }
    public decimal Price { get; protected set; }
    public int Stock { get; protected set; }
    public List<string> Tags { get; protected set; } = new();

    private readonly List<IProductObserver> _observers = new();

    protected Product(string name, decimal price, int stock)
    {
        Name = name;
        Price = price;
        Stock = stock;
    }

    public void Subscribe(IProductObserver observer)
    {
        if (!_observers.Contains(observer))
            _observers.Add(observer);
    }

    public void Unsubscribe(IProductObserver observer) =>
        _observers.Remove(observer);

    public void NotifyStockChanged(int newStock)
    {
        foreach (var o in _observers)
            o.OnStockChanged(Id, Name, newStock);
    }

    public void NotifyPriceChanged(decimal newPrice)
    {
        foreach (var o in _observers)
            o.OnPriceChanged(Id, Name, newPrice);
    }

    public void UpdateStock(int newStock)
    {
        Stock = newStock;
        NotifyStockChanged(newStock);
    }

    public void UpdatePrice(decimal newPrice)
    {
        Price = newPrice;
        NotifyPriceChanged(newPrice);
    }

    public void UpdateName(string newName) => Name = newName;

    public abstract string GetDescription();
    public abstract ICloneableProduct Clone();
    public abstract ICloneableProduct DeepClone();
}