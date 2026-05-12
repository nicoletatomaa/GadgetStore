using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<User> GetSet() => Context.Users;

    public async Task<User?> GetByIdAsync(Guid id) =>
        await Context.Users.FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

    public async Task<User?> GetByEmailAsync(string email) =>
        await Context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

    public async Task<IEnumerable<User>> GetAllAsync(int page = 1, int pageSize = 20) =>
        await Context.Users
            .OrderBy(u => u.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<bool> ExistsByEmailAsync(string email) =>
        await Context.Users.AnyAsync(u => u.Email == email);

    public async Task<int> CountOrdersAsync(Guid userId) =>
        await Context.Orders.CountAsync(o => o.UserId == userId);
}
