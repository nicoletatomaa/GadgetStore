namespace GadgetStore.API.DTOs;

public class ProcessPaymentRequest
{
     /// <summary>card | paypal | crypto</summary>
     public string Method { get; set; } = "card";
     public decimal Amount { get; set; }
}

public class RegionalSummaryRequest
{
     public decimal Amount { get; set; }
}