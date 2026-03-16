using GadgetStore.Patterns.Creational.Prototype;

namespace GadgetStore.Domain.Entities;

public class AccessoryProduct : Product
{
     public string CompatibleWith { get; private set; }

     public AccessoryProduct(string name, decimal price, int stock, string compatibleWith)
         : base(name, price, stock)
     {
          CompatibleWith = compatibleWith;
     }

     public override string GetDescription()
     {
          var tags = Tags.Count > 0 ? $" | Tags: {string.Join(", ", Tags)}" : "";
          return $"Accesoriu | Compatibil cu: {CompatibleWith} | Preț: {Price} lei | Stoc: {Stock}{tags}";
     }

     /// <summary>
     /// Shallow copy — Tags este aceeași referință ca originalul.
     /// </summary>
     public override ICloneableProduct Clone()
     {
          var clone = (AccessoryProduct)MemberwiseClone();
          clone.Id = Guid.NewGuid();
          return clone;
     }

     /// <summary>
     /// Deep copy — Tags este o nouă listă, independentă de original.
     /// </summary>
     public override ICloneableProduct DeepClone()
     {
          var clone = (AccessoryProduct)MemberwiseClone();
          clone.Id = Guid.NewGuid();
          clone.Tags = new List<string>(Tags);
          return clone;
     }
}