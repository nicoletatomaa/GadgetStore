using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Regional.Asia;

public class AsiaRegionalFactory : IRegionalFactory
{
     public ITaxCalculator CreateTaxCalculator() => new GSTCalculator();
     public IShippingProvider CreateShippingProvider() => new DHLAsiaProvider();
}