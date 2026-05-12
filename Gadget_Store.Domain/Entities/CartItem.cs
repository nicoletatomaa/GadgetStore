namespace GadgetStore.Domain.Entities;

public class CartItem
{
    public int Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public string? Decorators { get; private set; }
    public DateTime AddedAt { get; private set; } = DateTime.UtcNow;

    public User? User { get; private set; }
    public Product? Product { get; private set; }

    protected CartItem() { }

    public CartItem(Guid userId, Guid productId, int quantity, string? decorators = null)
    {
        UserId = userId;
        ProductId = productId;
        Quantity = quantity;
        Decorators = decorators;
    }

    public void UpdateQuantity(int quantity) => Quantity = quantity;
    public void UpdateDecorators(string? decorators) => Decorators = decorators;
}
