using GadgetStore.Domain.Entities;
using GadgetStore.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence;

public class GadgetStoreDbContext : DbContext
{
    public GadgetStoreDbContext(DbContextOptions<GadgetStoreDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ElectronicsProduct> ElectronicsProducts => Set<ElectronicsProduct>();
    public DbSet<AccessoryProduct> AccessoryProducts => Set<AccessoryProduct>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<PriceHistory> PriceHistories => Set<PriceHistory>();
    public DbSet<StockAlert> StockAlerts => Set<StockAlert>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GadgetStoreDbContext).Assembly);
    }
}
