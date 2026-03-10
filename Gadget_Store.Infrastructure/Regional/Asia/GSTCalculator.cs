using GadgetStore.Application.Interfaces;

namespace GadgetStore.Infrastructure.Regional.Asia;

public class GSTCalculator : ITaxCalculator
{
     private const decimal GSTRate = 0.12m;

     public decimal CalculateTax(decimal amount) => Math.Round(amount * GSTRate, 2);
     public string GetTaxDescription() => "GST Asia (12%)";
}