using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id).ValueGeneratedNever();

        builder.Property(o => o.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Pending");
        builder.Property(o => o.Region).IsRequired().HasMaxLength(10);
        builder.Property(o => o.PaymentMethod).IsRequired().HasMaxLength(50);
        builder.Property(o => o.Subtotal).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(o => o.DiscountAmount).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
        builder.Property(o => o.TaxAmount).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(o => o.ShippingCost).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(o => o.ShippingAddress).HasColumnType("nvarchar(max)");
        builder.Property(o => o.BillingAddress).HasColumnType("nvarchar(max)");
        builder.Property(o => o.CouponCode).HasMaxLength(50);
        builder.Property(o => o.Notes).HasMaxLength(1000);
        builder.Property(o => o.CreatedAt).IsRequired();
        builder.Property(o => o.UpdatedAt).IsRequired();

        builder.HasMany(o => o.Items)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.Payments)
            .WithOne(p => p.Order)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(o => o.UserId);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.CreatedAt);
    }
}
