namespace GadgetStore.Patterns.Structural.Decorator;

/// Decorator: Garanție extinsă 2 ani.
/// Adaugă 5% din prețul curent al ofertei.
/// Se poate aplica peste orice IProductOffer — inclusiv peste alte decoratoare.
public class WarrantyDecorator : ProductOfferDecorator
{
    private const decimal WarrantyRate = 0.05m;

    public WarrantyDecorator(IProductOffer inner) : base(inner) { }

    public override decimal GetPrice()
    {
        var base_ = _inner.GetPrice();
        return Math.Round(base_ + base_ * WarrantyRate, 2);
    }

    public override string GetDescription() =>
        _inner.GetDescription() + " | + Garanție extinsă 2 ani";

    public override IEnumerable<string> GetExtras()
    {
        var cost = Math.Round(_inner.GetPrice() * WarrantyRate, 2);
        return _inner.GetExtras().Append($"Garanție 2 ani  +{cost} lei  (5%)");
    }
}