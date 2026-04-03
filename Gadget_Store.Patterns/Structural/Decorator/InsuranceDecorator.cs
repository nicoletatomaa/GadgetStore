namespace GadgetStore.Patterns.Structural.Decorator;

/// Decorator: Asigurare daune accidentale (scăpare, apă).
/// Adaugă 3% din prețul curent al ofertei.
/// Notă: dacă WARRANTY este deja aplicat, calculul se face
/// pe prețul deja majorat — demonstrând compunerea decoratoarelor.
public class InsuranceDecorator : ProductOfferDecorator
{
    private const decimal InsuranceRate = 0.03m;

    public InsuranceDecorator(IProductOffer inner) : base(inner) { }

    public override decimal GetPrice()
    {
        var base_ = _inner.GetPrice();
        return Math.Round(base_ + base_ * InsuranceRate, 2);
    }

    public override string GetDescription() =>
        _inner.GetDescription() + " | + Asigurare daune accidentale";

    public override IEnumerable<string> GetExtras()
    {
        var cost = Math.Round(_inner.GetPrice() * InsuranceRate, 2);
        return _inner.GetExtras().Append($"Asigurare        +{cost} lei  (3%)");
    }
}