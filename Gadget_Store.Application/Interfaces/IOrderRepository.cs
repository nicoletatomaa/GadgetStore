using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id);
    Task<IEnumerable<Order>> GetByUserAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<Order>> GetAllAsync(int page = 1, int pageSize = 20);
    Task AddAsync(Order order);
    Task UpdateAsync(Order order);
}
