using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;

namespace GadgetStore.Infrastructure.Payments;

public class CryptoPaymentProcessor : IPaymentProcessor
{
     public PaymentResult ProcessPayment(decimal amount)
     {
          Console.WriteLine($"[CRYPTO] Generare adresă portofel...");
          Console.WriteLine($"[CRYPTO] Așteptare confirmări blockchain pentru {amount} lei...");
          var txId = $"0x{Guid.NewGuid().ToString("N")[..16].ToUpper()}";
          Console.WriteLine($"[CRYPTO] Tranzacție confirmată. TxID: {txId}");
          return new PaymentResult(true, "Plată crypto confirmată.", txId);
     }
}