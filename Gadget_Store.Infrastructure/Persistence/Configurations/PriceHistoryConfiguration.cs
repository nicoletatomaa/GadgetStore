using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class PriceHistoryConfiguration : IEntityTypeConfiguration<PriceHistory>
{
    public void Configure(EntityTypeBuilder<PriceHistory> builder)
    {
        builder.ToTable("PriceHistory");
        builder.HasKey(ph => ph.Id);

        builder.Property(ph => ph.OldPrice).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(ph => ph.NewPrice).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(ph => ph.ChangedAt).IsRequired();

        builder.HasIndex(ph => ph.ProductId);
        builder.HasIndex(ph => ph.ChangedAt);
    }
}
