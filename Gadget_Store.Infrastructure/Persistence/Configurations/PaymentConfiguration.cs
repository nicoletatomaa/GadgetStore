using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Method).IsRequired().HasMaxLength(50);
        builder.Property(p => p.Amount).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(p => p.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Pending");
        builder.Property(p => p.TransactionId).HasMaxLength(200);
        builder.Property(p => p.FailureReason).HasMaxLength(500);

        builder.HasIndex(p => p.OrderId);
        builder.HasIndex(p => p.TransactionId);
    }
}
