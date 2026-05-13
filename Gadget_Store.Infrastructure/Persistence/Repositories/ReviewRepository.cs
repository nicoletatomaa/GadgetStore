using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class ReviewRepository : BaseRepository<Review>, IReviewRepository
{
    public ReviewRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<Review> GetSet() => Context.Reviews;

    public async Task<IEnumerable<Review>> GetByProductAsync(Guid productId) =>
        await Context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task<Review?> GetByIdAsync(int id) =>
        await Context.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task DeleteAsync(int id)
    {
        var review = await Context.Reviews.FindAsync(id);
        if (review is not null)
        {
            Context.Reviews.Remove(review);
            await Context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid productId, Guid userId) =>
        await Context.Reviews.AnyAsync(r => r.ProductId == productId && r.UserId == userId);
}
