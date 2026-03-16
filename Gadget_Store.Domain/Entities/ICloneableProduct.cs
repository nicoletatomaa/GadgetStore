namespace GadgetStore.Patterns.Creational.Prototype;

public interface ICloneableProduct
{
     /// <summary>
     /// Shallow copy — lista de Tags este partajată între original și clonă.
     /// </summary>
     ICloneableProduct Clone();

     /// <summary>
     /// Deep copy — lista de Tags este duplicată independent.
     /// </summary>
     ICloneableProduct DeepClone();
}