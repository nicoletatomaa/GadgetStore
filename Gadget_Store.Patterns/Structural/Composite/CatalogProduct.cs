namespace GadgetStore.Patterns.Structural.Composite;

public class CatalogProduct : ICatalogComponent
{
    public string Name { get; }
    public decimal Price { get; }
    public bool IsLeaf => true;

    public CatalogProduct(string name, decimal price)
    {
        Name = name;
        Price = price;
    }

    public string GetName() => Name;
    public decimal GetTotalPrice() => Price;

    public string Display(int depth = 0) =>
        $"{new string(' ', depth * 2)}[Produs] {Name} — {Price} lei";
}