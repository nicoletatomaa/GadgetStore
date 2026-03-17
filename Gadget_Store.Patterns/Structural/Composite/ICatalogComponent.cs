namespace GadgetStore.Patterns.Structural.Composite;

public interface ICatalogComponent
{
    string GetName();
    decimal GetTotalPrice();
    string Display(int depth = 0);
    bool IsLeaf { get; }
}