using GadgetStore.Application.Interfaces;

namespace GadgetStore.Patterns.Creational;

public interface IRegionalFactory
{
     ITaxCalculator CreateTaxCalculator();
     IShippingProvider CreateShippingProvider();
}