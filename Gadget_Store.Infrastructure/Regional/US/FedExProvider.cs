using GadgetStore.Application.Interfaces;

namespace GadgetStore.Infrastructure.Regional.US;

public class FedExProvider : IShippingProvider
{
     public decimal GetShippingCost(decimal orderTotal) => orderTotal > 500m ? 0m : 35m;
     public string GetProviderName() => "FedEx (SUA)";
}