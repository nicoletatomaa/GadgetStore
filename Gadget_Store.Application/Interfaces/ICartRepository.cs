using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface ICartRepository
{
    Task<IEnumerable<CartItem>> GetByUserAsync(Guid userId);
    Task<CartItem?> GetItemAsync(Guid userId, Guid productId);
    Task AddAsync(CartItem item);
    Task UpdateAsync(CartItem item);
    Task RemoveAsync(int itemId);
    Task ClearAsync(Guid userId);
}
