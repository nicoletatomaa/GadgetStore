namespace GadgetStore.Domain.Entities;

public class Payment
{
    public int Id { get; private set; }
    public Guid OrderId { get; private set; }
    public string Method { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public string Status { get; private set; } = "Pending";
    public string? TransactionId { get; private set; }
    public DateTime? ProcessedAt { get; private set; }
    public string? FailureReason { get; private set; }

    public Order? Order { get; private set; }

    protected Payment() { }

    public Payment(Guid orderId, string method, decimal amount)
    {
        OrderId = orderId;
        Method = method;
        Amount = amount;
    }

    public void MarkSuccess(string transactionId)
    {
        Status = "Success";
        TransactionId = transactionId;
        ProcessedAt = DateTime.UtcNow;
    }

    public void MarkFailed(string reason)
    {
        Status = "Failed";
        FailureReason = reason;
        ProcessedAt = DateTime.UtcNow;
    }
}
