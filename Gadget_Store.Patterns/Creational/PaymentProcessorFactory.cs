using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Creational;

public abstract class PaymentProcessorFactory
{
     protected abstract IPaymentProcessor CreateProcessor();

     public PaymentResult Process(decimal amount)
     {
          Console.WriteLine("Inițiere procesare plată");
          var processor = CreateProcessor();
          var result = processor.ProcessPayment(amount);
          Console.WriteLine($"Rezultat: {result.Message}");
          return result;
     }
}