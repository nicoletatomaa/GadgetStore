using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<Order> GetSet() => Context.Orders;

    public async Task<Order?> GetByIdAsync(Guid id) =>
        await Context.Orders
            .Include(o => o.Items)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<IEnumerable<Order>> GetByUserAsync(Guid userId, int page = 1, int pageSize = 20) =>
        await Context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<IEnumerable<Order>> GetAllAsync(int page = 1, int pageSize = 20) =>
        await Context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
}
