namespace GadgetStore.Domain.Entities;

public class Review
{
    public int Id { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid UserId { get; private set; }
    public byte Rating { get; private set; }
    public string? Comment { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public bool IsVerified { get; private set; }

    public Product? Product { get; private set; }
    public User? User { get; private set; }

    protected Review() { }

    public Review(Guid productId, Guid userId, byte rating, string? comment, bool isVerified = false)
    {
        if (rating < 1 || rating > 5)
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating trebuie sa fie intre 1 si 5.");

        ProductId = productId;
        UserId = userId;
        Rating = rating;
        Comment = comment;
        IsVerified = isVerified;
    }

    public void Verify() => IsVerified = true;
}
