namespace GadgetStore.Domain.Entities;

public class StockAlert
{
    public int Id { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid UserId { get; private set; }
    public int ThresholdQty { get; private set; } = 5;
    public bool AlertOnPriceDrop { get; private set; }
    public bool IsActive { get; private set; } = true;

    public Product? Product { get; private set; }
    public User? User { get; private set; }

    protected StockAlert() { }

    public StockAlert(Guid productId, Guid userId, int thresholdQty = 5, bool alertOnPriceDrop = false)
    {
        ProductId = productId;
        UserId = userId;
        ThresholdQty = thresholdQty;
        AlertOnPriceDrop = alertOnPriceDrop;
    }

    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;
}
