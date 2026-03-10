using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;

namespace GadgetStore.Infrastructure.Payments;

public class PayPalPaymentProcessor : IPaymentProcessor
{
     public PaymentResult ProcessPayment(decimal amount)
     {
          Console.WriteLine($"[PAYPAL] Redirecționare către PayPal pentru {amount} lei...");
          var txId = $"PP-{Guid.NewGuid().ToString()[..8].ToUpper()}";
          Console.WriteLine($"[PAYPAL] Confirmare primită. TxID: {txId}");
          return new PaymentResult(true, "Plată prin PayPal confirmată.", txId);
     }
}