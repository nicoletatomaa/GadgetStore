namespace GadgetStore.Patterns.Behavioral.Strategy;

// Strategy concreta: aplica discountul unui cupon validat din DB.
// Instanta este creata de DiscountStrategyFactory.CreateFromCouponAsync()
// dupa ce cuponul a fost verificat in baza de date.
public class CouponDiscountStrategy : IDiscountStrategy
{
    private readonly string  _code;
    private readonly string  _type;   // "Fixed" sau "Percentage"
    private readonly decimal _value;

    public CouponDiscountStrategy(string code, string type, decimal value)
    {
        _code  = code;
        _type  = type;
        _value = value;
    }

    public decimal ApplyDiscount(decimal subtotal) =>
        _type.Equals("Percentage", StringComparison.OrdinalIgnoreCase)
            ? Math.Round(subtotal * _value / 100m, 2)
            : Math.Min(_value, subtotal);   // reducere fixa nu poate depasi subtotalul

    public string GetDescription() =>
        _type.Equals("Percentage", StringComparison.OrdinalIgnoreCase)
            ? $"Cupon '{_code}': {_value}% reducere"
            : $"Cupon '{_code}': {_value} lei reducere";
}
