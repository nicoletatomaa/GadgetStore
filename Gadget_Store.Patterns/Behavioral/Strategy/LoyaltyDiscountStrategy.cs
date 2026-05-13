namespace GadgetStore.Patterns.Behavioral.Strategy;

// Strategy concreta: discount de fidelitate bazat pe numarul de comenzi ale utilizatorului.
// Instanta este creata de DiscountStrategyFactory.CreateFromLoyaltyAsync()
// dupa ce CountOrdersAsync() a interogat DB-ul.
public class LoyaltyDiscountStrategy : IDiscountStrategy
{
    private readonly int     _orderCount;
    private const    decimal LoyaltyRate     = 0.05m;  // 5%
    private const    int     RequiredOrders  = 10;

    public LoyaltyDiscountStrategy(int orderCount)
    {
        _orderCount = orderCount;
    }

    public decimal ApplyDiscount(decimal subtotal) =>
        _orderCount >= RequiredOrders
            ? Math.Round(subtotal * LoyaltyRate, 2)
            : 0m;

    public string GetDescription() =>
        _orderCount >= RequiredOrders
            ? $"Discount fidelitate 5% ({_orderCount} comenzi anterioare)"
            : $"Fara discount fidelitate — necesita {RequiredOrders} comenzi, ai {_orderCount}";
}
