using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetAllAsync(int page = 1, int pageSize = 20);
    Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId, int page = 1, int pageSize = 20);
    Task<IEnumerable<Product>> SearchAsync(string query, int page = 1, int pageSize = 20);
    Task<IEnumerable<Product>> GetTemplatesAsync();
    Task<int> CountAsync();
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
