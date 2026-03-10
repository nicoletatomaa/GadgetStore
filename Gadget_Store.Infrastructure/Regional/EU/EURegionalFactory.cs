using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Regional.EU;

public class EURegionalFactory : IRegionalFactory
{
     public ITaxCalculator CreateTaxCalculator() => new VATCalculator();
     public IShippingProvider CreateShippingProvider() => new FanCourierProvider();
}