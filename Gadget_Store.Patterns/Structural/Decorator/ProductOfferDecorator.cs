namespace GadgetStore.Patterns.Structural.Decorator;

/// Decorator abstract — menține referința la componenta învelită (_inner)
/// și delegă toate metodele implicit spre ea.
/// Subclasele suprascriu doar metodele pe care le modifică,
/// fără a atinge niciodată clasa Product originală.
public abstract class ProductOfferDecorator : IProductOffer
{
    protected readonly IProductOffer _inner;

    protected ProductOfferDecorator(IProductOffer inner) => _inner = inner;

    public virtual string GetName() => _inner.GetName();
    public virtual decimal GetPrice() => _inner.GetPrice();
    public virtual string GetDescription() => _inner.GetDescription();
    public virtual IEnumerable<string> GetExtras() => _inner.GetExtras();
}