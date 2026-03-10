using GadgetStore.Application.Interfaces;

namespace GadgetStore.Infrastructure.Regional.EU;

public class FanCourierProvider : IShippingProvider
{
     public decimal GetShippingCost(decimal orderTotal) => orderTotal > 300m ? 0m : 20m;
     public string GetProviderName() => "FanCourier (România/EU)";
}