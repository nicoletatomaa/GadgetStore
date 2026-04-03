namespace GadgetStore.Patterns.Structural.Decorator;

/// Decorator: Ambalaj cadou premium.
/// Cost fix de 25 lei, indiferent de prețul produsului.
/// Demonstrează că decoratoarele nu trebuie să fie neapărat procentuale.
public class GiftWrapDecorator : ProductOfferDecorator
{
    private const decimal GiftWrapCost = 25m;

    public GiftWrapDecorator(IProductOffer inner) : base(inner) { }

    public override decimal GetPrice() => _inner.GetPrice() + GiftWrapCost;

    public override string GetDescription() =>
        _inner.GetDescription() + " | + Ambalaj cadou premium";

    public override IEnumerable<string> GetExtras() =>
        _inner.GetExtras().Append($"Ambalaj cadou    +{GiftWrapCost} lei  (fix)");
}