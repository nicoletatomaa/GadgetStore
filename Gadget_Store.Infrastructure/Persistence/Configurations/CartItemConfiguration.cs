using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("CartItems");
        builder.HasKey(ci => ci.Id);

        builder.Property(ci => ci.Quantity).IsRequired();
        builder.Property(ci => ci.Decorators).HasMaxLength(500);
        builder.Property(ci => ci.AddedAt).IsRequired();

        builder.HasIndex(ci => new { ci.UserId, ci.ProductId }).IsUnique();
    }
}
