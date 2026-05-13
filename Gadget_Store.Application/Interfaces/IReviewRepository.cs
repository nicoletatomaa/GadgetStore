using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface IReviewRepository
{
    Task<IEnumerable<Review>> GetByProductAsync(Guid productId);
    Task<Review?> GetByIdAsync(int id);
    Task AddAsync(Review review);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(Guid productId, Guid userId);
}
