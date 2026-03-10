using GadgetStore.Application.Interfaces;

namespace GadgetStore.Infrastructure.Regional.US;

public class SalesTaxCalculator : ITaxCalculator
{
     private const decimal SalesTaxRate = 0.085m;

     public decimal CalculateTax(decimal amount) => Math.Round(amount * SalesTaxRate, 2);
     public string GetTaxDescription() => "Sales Tax SUA (8.5%)";
}