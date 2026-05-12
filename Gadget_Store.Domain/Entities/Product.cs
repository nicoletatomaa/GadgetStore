using GadgetStore.Domain.Interfaces;
using GadgetStore.Patterns.Creational.Prototype;

namespace GadgetStore.Domain.Entities;

public abstract class Product : ICloneableProduct, IProductSubject
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public string Name { get; protected set; } = string.Empty;
    public decimal Price { get; protected set; }
    public int Stock { get; protected set; }
    public List<string> Tags { get; protected set; } = new();

    // Persistence properties
    public int CategoryId { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public bool IsTemplate { get; set; }
    public string? TemplateName { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Category? Category { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<PriceHistory> PriceHistories { get; set; } = new List<PriceHistory>();
    public ICollection<StockAlert> StockAlerts { get; set; } = new List<StockAlert>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();

    private readonly List<IProductObserver> _observers = new();

    protected Product() { }

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
        UpdatedAt = DateTime.UtcNow;
        NotifyStockChanged(newStock);
    }

    public void UpdatePrice(decimal newPrice)
    {
        Price = newPrice;
        UpdatedAt = DateTime.UtcNow;
        NotifyPriceChanged(newPrice);
    }

    public void UpdateName(string newName)
    {
        Name = newName;
        UpdatedAt = DateTime.UtcNow;
    }

    public abstract string GetDescription();
    public abstract ICloneableProduct Clone();
    public abstract ICloneableProduct DeepClone();
}
