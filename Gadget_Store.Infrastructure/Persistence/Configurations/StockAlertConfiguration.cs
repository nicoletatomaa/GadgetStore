using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class StockAlertConfiguration : IEntityTypeConfiguration<StockAlert>
{
    public void Configure(EntityTypeBuilder<StockAlert> builder)
    {
        builder.ToTable("StockAlerts");
        builder.HasKey(sa => sa.Id);

        builder.Property(sa => sa.ThresholdQty).HasDefaultValue(5);
        builder.Property(sa => sa.AlertOnPriceDrop).HasDefaultValue(false);
        builder.Property(sa => sa.IsActive).HasDefaultValue(true);

        builder.HasIndex(sa => new { sa.ProductId, sa.UserId }).IsUnique();
    }
}
