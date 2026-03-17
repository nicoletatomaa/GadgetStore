namespace GadgetStore.Patterns.Structural.Composite;

public class CatalogCategory : ICatalogComponent
{
    private readonly List<ICatalogComponent> _children = new();

    public string Name { get; }
    public bool IsLeaf => false;

    public CatalogCategory(string name) => Name = name;

    public void Add(ICatalogComponent component) => _children.Add(component);
    public void Remove(ICatalogComponent component) => _children.Remove(component);
    public IReadOnlyList<ICatalogComponent> GetChildren() => _children.AsReadOnly();

    public string GetName() => Name;
    public decimal GetTotalPrice() => _children.Sum(c => c.GetTotalPrice());

    public string Display(int depth = 0)
    {
        var indent = new string(' ', depth * 2);
        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"{indent}[Categorie] {Name} (total: {GetTotalPrice()} lei)");
        foreach (var child in _children)
            sb.AppendLine(child.Display(depth + 1));
        return sb.ToString().TrimEnd();
    }
}