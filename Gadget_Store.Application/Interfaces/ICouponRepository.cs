using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface ICouponRepository
{
    Task<Coupon?> GetByCodeAsync(string code);
    Task<IEnumerable<Coupon>> GetAllAsync();
    Task AddAsync(Coupon coupon);
    Task UpdateAsync(Coupon coupon);
}
