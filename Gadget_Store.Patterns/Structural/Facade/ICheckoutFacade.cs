using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Structural.Facade;

public class CheckoutFacadeRequest
{
    public List<(string Name, decimal Price, int Qty)> Items { get; set; } = new();
    public string Region { get; set; } = "EU";
    public string PaymentMethod { get; set; } = "card";
    public decimal DiscountAmount { get; set; } = 0m;
    public string? Notes { get; set; }
}

public class CheckoutResult
{
    public OrderSummary Order { get; set; } = null!;
    public PaymentResult Payment { get; set; } = null!;
    public bool Success => Payment.Success;
}

public interface ICheckoutFacade
{
    CheckoutResult ProcessCheckout(CheckoutFacadeRequest request);
}