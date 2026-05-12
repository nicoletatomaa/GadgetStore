using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class CartRepository : ICartRepository
{
    private readonly GadgetStoreDbContext _context;

    public CartRepository(GadgetStoreDbContext context) => _context = context;

    public async Task<IEnumerable<CartItem>> GetByUserAsync(Guid userId) =>
        await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
            .OrderBy(ci => ci.AddedAt)
            .ToListAsync();

    public async Task<CartItem?> GetItemAsync(Guid userId, Guid productId) =>
        await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);

    public async Task AddAsync(CartItem item)
    {
        await _context.CartItems.AddAsync(item);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(CartItem item)
    {
        _context.CartItems.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(int itemId)
    {
        var item = await _context.CartItems.FindAsync(itemId);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearAsync(Guid userId)
    {
        var items = await _context.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
    }
}
