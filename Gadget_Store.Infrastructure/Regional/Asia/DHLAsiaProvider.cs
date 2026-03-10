using GadgetStore.Application.Interfaces;

namespace GadgetStore.Infrastructure.Regional.Asia;

public class DHLAsiaProvider : IShippingProvider
{
     public decimal GetShippingCost(decimal orderTotal) => orderTotal > 400m ? 15m : 50m;
     public string GetProviderName() => "DHL Asia-Pacific";
}