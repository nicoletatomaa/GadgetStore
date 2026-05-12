using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
{
    public void Configure(EntityTypeBuilder<Coupon> builder)
    {
        builder.ToTable("Coupons");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Code).IsRequired().HasMaxLength(50);
        builder.Property(c => c.Type).IsRequired().HasMaxLength(20);
        builder.Property(c => c.Value).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(c => c.MinOrderAmount).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
        builder.Property(c => c.UsedCount).HasDefaultValue(0);
        builder.Property(c => c.IsActive).HasDefaultValue(true);

        builder.HasIndex(c => c.Code).IsUnique();
    }
}
