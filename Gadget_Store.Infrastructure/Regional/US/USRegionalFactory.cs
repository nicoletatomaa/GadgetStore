using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Regional.US;

public class USRegionalFactory : IRegionalFactory
{
     public ITaxCalculator CreateTaxCalculator() => new SalesTaxCalculator();
     public IShippingProvider CreateShippingProvider() => new FedExProvider();
}