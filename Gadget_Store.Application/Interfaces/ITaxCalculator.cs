namespace GadgetStore.Application.Interfaces;

public interface ITaxCalculator
{
     decimal CalculateTax(decimal amount);
     string GetTaxDescription();
}