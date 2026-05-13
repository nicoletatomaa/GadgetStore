using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface IWishlistRepository
{
    Task<IEnumerable<WishlistItem>> GetByUserAsync(Guid userId);
    Task<IEnumerable<WishlistItem>> GetByProductAsync(Guid productId);
    Task AddAsync(WishlistItem item);
    Task RemoveAsync(Guid userId, Guid productId);
    Task<bool> ExistsAsync(Guid userId, Guid productId);
}
