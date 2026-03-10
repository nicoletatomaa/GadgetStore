namespace GadgetStore.Domain.Entities;

public class PaymentResult
{
     public bool Success { get; private set; }
     public string Message { get; private set; }
     public string TransactionId { get; private set; }

     public PaymentResult(bool success, string message, string transactionId)
     {
          Success = success;
          Message = message;
          TransactionId = transactionId;
     }
}