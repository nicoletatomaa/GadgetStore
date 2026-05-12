using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class CouponRepository : ICouponRepository
{
    private readonly GadgetStoreDbContext _context;

    public CouponRepository(GadgetStoreDbContext context) => _context = context;

    public async Task<Coupon?> GetByCodeAsync(string code) =>
        await _context.Coupons
            .FirstOrDefaultAsync(c => c.Code == code.ToUpper() && c.IsActive);

    public async Task<IEnumerable<Coupon>> GetAllAsync() =>
        await _context.Coupons.OrderBy(c => c.Code).ToListAsync();

    public async Task AddAsync(Coupon coupon)
    {
        await _context.Coupons.AddAsync(coupon);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Coupon coupon)
    {
        _context.Coupons.Update(coupon);
        await _context.SaveChangesAsync();
    }
}
