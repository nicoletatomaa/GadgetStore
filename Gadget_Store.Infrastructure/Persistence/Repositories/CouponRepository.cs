using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GadgetStore.Infrastructure.Persistence.Repositories;

public class CouponRepository : BaseRepository<Coupon>, ICouponRepository
{
    public CouponRepository(GadgetStoreDbContext context) : base(context) { }

    protected override DbSet<Coupon> GetSet() => Context.Coupons;

    public async Task<Coupon?> GetByCodeAsync(string code) =>
        await Context.Coupons
            .FirstOrDefaultAsync(c => c.Code == code.ToUpper() && c.IsActive);

    public async Task<IEnumerable<Coupon>> GetAllAsync() =>
        await Context.Coupons.OrderBy(c => c.Code).ToListAsync();
}
