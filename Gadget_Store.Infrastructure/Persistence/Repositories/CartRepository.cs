using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class CartRepository : BaseRepository<CartItem>, ICartRepository
{
    public CartRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<CartItem> GetSet() => Context.CartItems;

    public async Task<IEnumerable<CartItem>> GetByUserAsync(Guid userId) =>
        await Context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
            .OrderBy(ci => ci.AddedAt)
            .ToListAsync();

    public async Task<CartItem?> GetItemAsync(Guid userId, Guid productId) =>
        await Context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

    public async Task RemoveAsync(int itemId)
    {
        var item = await Context.CartItems.FindAsync(itemId);
        if (item != null)
        {
            Context.CartItems.Remove(item);
            await Context.SaveChangesAsync();
        }
    }

    public async Task ClearAsync(Guid userId)
    {
        var items = await Context.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
        Context.CartItems.RemoveRange(items);
        await Context.SaveChangesAsync();
    }
}
