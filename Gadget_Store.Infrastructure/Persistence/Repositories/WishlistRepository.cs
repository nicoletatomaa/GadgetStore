using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class WishlistRepository : BaseRepository<WishlistItem>, IWishlistRepository
{
    public WishlistRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<WishlistItem> GetSet() => Context.WishlistItems;

    public async Task<IEnumerable<WishlistItem>> GetByUserAsync(Guid userId) =>
        await Context.WishlistItems
            .Include(w => w.Product)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.AddedAt)
            .ToListAsync();

    public async Task<IEnumerable<WishlistItem>> GetByProductAsync(Guid productId) =>
        await Context.WishlistItems
            .Include(w => w.User)
            .Where(w => w.ProductId == productId)
            .ToListAsync();

    public async Task RemoveAsync(Guid userId, Guid productId)
    {
        var item = await Context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (item is not null)
        {
            Context.WishlistItems.Remove(item);
            await Context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid productId) =>
        await Context.WishlistItems
            .AnyAsync(w => w.UserId == userId && w.ProductId == productId);
}
