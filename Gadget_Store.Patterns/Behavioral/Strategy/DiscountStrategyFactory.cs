using GadgetStore.Application.Interfaces;

namespace GadgetStore.Patterns.Behavioral.Strategy;

public static class DiscountStrategyFactory
{
    // Factory sincrona — pentru strategii fara acces DB
    public static IDiscountStrategy Create(string type, decimal value = 0m) =>
        type.ToLower() switch
        {
            "percentage" => new PercentageDiscountStrategy(value),
            "fixed"      => new FixedDiscountStrategy(value),
            _            => new NoDiscountStrategy()
        };

    // Factory asincrona — valideaza cuponul in DB si returneaza strategia potrivita
    public static async Task<IDiscountStrategy> CreateFromCouponAsync(
        string code, ICouponRepository coupons)
    {
        var coupon = await coupons.GetByCodeAsync(code);

        if (coupon is null || !coupon.IsActive)
            return new NoDiscountStrategy();

        if (coupon.ExpiresAt.HasValue && coupon.ExpiresAt.Value < DateTime.UtcNow)
            return new NoDiscountStrategy();

        if (coupon.MaxUses.HasValue && coupon.UsedCount >= coupon.MaxUses.Value)
            return new NoDiscountStrategy();

        return new CouponDiscountStrategy(coupon.Code, coupon.Type, coupon.Value);
    }

    // Factory asincrona — numara comenzile utilizatorului si aplica discount de fidelitate
    public static async Task<IDiscountStrategy> CreateFromLoyaltyAsync(
        Guid userId, IUserRepository users)
    {
        var orderCount = await users.CountOrdersAsync(userId);
        return new LoyaltyDiscountStrategy(orderCount);
    }
}
