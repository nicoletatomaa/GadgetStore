using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GadgetStore.Infrastructure.Persistence.Configurations;

public class WishlistItemConfiguration : IEntityTypeConfiguration<WishlistItem>
{
    public void Configure(EntityTypeBuilder<WishlistItem> builder)
    {
        builder.ToTable("Wishlists");
        builder.HasKey(wi => wi.Id);

        builder.Property(wi => wi.AddedAt).IsRequired();

        builder.HasIndex(wi => new { wi.UserId, wi.ProductId }).IsUnique();
    }
}
