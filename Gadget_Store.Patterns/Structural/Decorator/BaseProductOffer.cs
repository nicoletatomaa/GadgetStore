using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Structural.Decorator;

/// Componenta concretă de bază — învelește un Product existent.
/// Reprezintă oferta "simplă", fără niciun extra.
/// Toate decoratoarele pornesc de la această clasă.
public class BaseProductOffer : IProductOffer
{
    private readonly Product _product;

    public BaseProductOffer(Product product) => _product = product;

    public string GetName() => _product.Name;
    public decimal GetPrice() => _product.Price;
    public string GetDescription() => _product.GetDescription();

    public IEnumerable<string> GetExtras() => Enumerable.Empty<string>();
}