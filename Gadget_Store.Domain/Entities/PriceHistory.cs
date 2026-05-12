namespace GadgetStore.Domain.Entities;

public class PriceHistory
{
    public int Id { get; private set; }
    public Guid ProductId { get; private set; }
    public decimal OldPrice { get; private set; }
    public decimal NewPrice { get; private set; }
    public DateTime ChangedAt { get; private set; } = DateTime.UtcNow;
    public Guid? ChangedBy { get; private set; }

    public Product? Product { get; private set; }

    protected PriceHistory() { }

    public PriceHistory(Guid productId, decimal oldPrice, decimal newPrice, Guid? changedBy = null)
    {
        ProductId = productId;
        OldPrice = oldPrice;
        NewPrice = newPrice;
        ChangedBy = changedBy;
    }
}
