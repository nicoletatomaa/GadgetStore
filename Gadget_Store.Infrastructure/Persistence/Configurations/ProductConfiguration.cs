using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).ValueGeneratedNever();

        builder.Property(p => p.Name).IsRequired().HasMaxLength(300);
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(p => p.Stock).IsRequired();
        builder.Property(p => p.ImageUrl).HasMaxLength(500);
        builder.Property(p => p.Description).HasColumnType("nvarchar(max)");
        builder.Property(p => p.TemplateName).HasMaxLength(200);
        builder.Property(p => p.IsTemplate).HasDefaultValue(false);
        builder.Property(p => p.IsActive).HasDefaultValue(true);
        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt).IsRequired();

        // Tags stored as JSON column with value comparer for change tracking
        var tagsComparer = new ValueComparer<List<string>>(
            (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );
        builder.Property(p => p.Tags)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            )
            .HasColumnType("nvarchar(max)")
            .HasColumnName("Tags")
            .Metadata.SetValueComparer(tagsComparer);

        // TPH discriminator
        builder.HasDiscriminator<string>("ProductType")
            .HasValue<ElectronicsProduct>("Electronics")
            .HasValue<AccessoryProduct>("Accessory");

        // Relationships
        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.OrderItems)
            .WithOne(oi => oi.Product)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.CartItems)
            .WithOne(ci => ci.Product)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.PriceHistories)
            .WithOne(ph => ph.Product)
            .HasForeignKey(ph => ph.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.StockAlerts)
            .WithOne(sa => sa.Product)
            .HasForeignKey(sa => sa.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.WishlistItems)
            .WithOne(wi => wi.Product)
            .HasForeignKey(wi => wi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Ignore("_observers");

        builder.HasIndex(p => p.CategoryId);
        builder.HasIndex(p => p.IsActive);
        builder.HasIndex(p => p.IsTemplate);
    }
}

public class ElectronicsProductConfiguration : IEntityTypeConfiguration<ElectronicsProduct>
{
    public void Configure(EntityTypeBuilder<ElectronicsProduct> builder)
    {
        builder.Property(p => p.Brand).IsRequired().HasMaxLength(100);
    }
}

public class AccessoryProductConfiguration : IEntityTypeConfiguration<AccessoryProduct>
{
    public void Configure(EntityTypeBuilder<AccessoryProduct> builder)
    {
        builder.Property(p => p.CompatibleWith).IsRequired().HasMaxLength(200);
    }
}
