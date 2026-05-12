namespace GadgetStore.Domain.Entities;

public class User
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Role { get; private set; } = "Customer";
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public string? Phone { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;
    public bool IsActive { get; private set; } = true;

    public ICollection<Order> Orders { get; private set; } = new List<Order>();
    public ICollection<CartItem> CartItems { get; private set; } = new List<CartItem>();
    public ICollection<Review> Reviews { get; private set; } = new List<Review>();
    public ICollection<StockAlert> StockAlerts { get; private set; } = new List<StockAlert>();
    public ICollection<WishlistItem> WishlistItems { get; private set; } = new List<WishlistItem>();
    public ICollection<RefreshToken> RefreshTokens { get; private set; } = new List<RefreshToken>();

    protected User() { }

    public User(string email, string passwordHash, string role = "Customer")
    {
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
    }

    public void UpdateProfile(string? firstName, string? lastName, string? phone)
    {
        FirstName = firstName;
        LastName = lastName;
        Phone = phone;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }
}
