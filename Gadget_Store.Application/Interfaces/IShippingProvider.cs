namespace GadgetStore.Application.Interfaces;

public interface IShippingProvider
{
     decimal GetShippingCost(decimal orderTotal);
     string GetProviderName();
}