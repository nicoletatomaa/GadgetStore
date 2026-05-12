using GadgetStore.Patterns.Creational.Prototype;

namespace GadgetStore.Domain.Entities;

public class ElectronicsProduct : Product
{
    public string Brand { get; protected set; } = string.Empty;

    protected ElectronicsProduct() { }

    public ElectronicsProduct(string name, decimal price, int stock, string brand)
        : base(name, price, stock)
    {
        Brand = brand;
    }

    public override string GetDescription()
    {
        var tags = Tags.Count > 0 ? $" | Tags: {string.Join(", ", Tags)}" : "";
        return $"Produs electronic | Brand: {Brand} | Preț: {Price} lei | Stoc: {Stock}{tags}";
    }

    /// <summary>
    /// Shallow copy — Tags este aceeași referință ca originalul.
    /// </summary>
    public override ICloneableProduct Clone()
    {
        var clone = (ElectronicsProduct)MemberwiseClone();
        clone.Id = Guid.NewGuid();
        clone.CreatedAt = DateTime.UtcNow;
        clone.UpdatedAt = DateTime.UtcNow;
        return clone;
    }

    /// <summary>
    /// Deep copy — Tags este o nouă listă, independentă de original.
    /// </summary>
    public override ICloneableProduct DeepClone()
    {
        var clone = (ElectronicsProduct)MemberwiseClone();
        clone.Id = Guid.NewGuid();
        clone.Tags = new List<string>(Tags);
        clone.CreatedAt = DateTime.UtcNow;
        clone.UpdatedAt = DateTime.UtcNow;
        return clone;
    }
}
