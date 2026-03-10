using GadgetStore.Application.Interfaces;

namespace GadgetStore.Infrastructure.Regional.EU;

public class VATCalculator : ITaxCalculator
{
     private const decimal VATRate = 0.19m;

     public decimal CalculateTax(decimal amount) => Math.Round(amount * VATRate, 2);
     public string GetTaxDescription() => "TVA Europa (19%)";
}