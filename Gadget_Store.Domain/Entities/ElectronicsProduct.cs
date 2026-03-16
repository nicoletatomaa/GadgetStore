using GadgetStore.Patterns.Creational.Prototype;

namespace GadgetStore.Domain.Entities;

public class ElectronicsProduct : Product
{
     public string Brand { get; private set; }

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
     /// Modificările în Tags pe clonă afectează și originalul.
     /// </summary>
     public override ICloneableProduct Clone()
     {
          var clone = (ElectronicsProduct)MemberwiseClone();
          clone.Id = Guid.NewGuid(); // ID nou, restul identic
          return clone;
     }

     /// <summary>
     /// Deep copy — Tags este o nouă listă, independentă de original.
     /// Modificările în Tags pe clonă NU afectează originalul.
     /// </summary>
     public override ICloneableProduct DeepClone()
     {
          var clone = (ElectronicsProduct)MemberwiseClone();
          clone.Id = Guid.NewGuid();
          clone.Tags = new List<string>(Tags); // copie independentă
          return clone;
     }
}