namespace GadgetStore.Domain.Entities;

public class OrderItem
{
    public int Id { get; private set; }
    public Guid OrderId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public string? Decorators { get; private set; }
    public decimal FinalPrice { get; private set; }

    public Order? Order { get; private set; }
    public Product? Product { get; private set; }

    protected OrderItem() { }

    public OrderItem(Guid orderId, Guid productId, int quantity, decimal unitPrice, decimal finalPrice, string? decorators = null)
    {
        OrderId = orderId;
        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        FinalPrice = finalPrice;
        Decorators = decorators;
    }
}
