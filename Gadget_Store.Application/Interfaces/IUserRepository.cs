using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync(int page = 1, int pageSize = 20);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task<bool> ExistsByEmailAsync(string email);
    Task<int> CountOrdersAsync(Guid userId);
}
