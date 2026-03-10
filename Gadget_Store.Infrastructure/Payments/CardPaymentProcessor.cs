using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;

namespace GadgetStore.Infrastructure.Payments;

public class CardPaymentProcessor : IPaymentProcessor
{
     public PaymentResult ProcessPayment(decimal amount)
     {
          Console.WriteLine($"[CARD] Tokenizare card... Trimitere cerere la bancă pentru {amount} lei...");
          var txId = $"CARD-{Guid.NewGuid().ToString()[..8].ToUpper()}";
          Console.WriteLine($"[CARD] Aprobare primită. TxID: {txId}");
          return new PaymentResult(true, "Plată prin card aprobată.", txId);
     }
}