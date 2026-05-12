namespace GadgetStore.Domain.Entities;

public class WishlistItem
{
    public int Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid ProductId { get; private set; }
    public DateTime AddedAt { get; private set; } = DateTime.UtcNow;

    public User? User { get; private set; }
    public Product? Product { get; private set; }

    protected WishlistItem() { }

    public WishlistItem(Guid userId, Guid productId)
    {
        UserId = userId;
        ProductId = productId;
    }
}
