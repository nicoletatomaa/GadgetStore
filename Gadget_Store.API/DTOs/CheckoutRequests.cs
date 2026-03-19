namespace GadgetStore.API.DTOs;

public class CheckoutRequest
{
    public List<OrderItemDto> Items { get; set; } = new();
    public string Region { get; set; } = "EU";
    public string PaymentMethod { get; set; } = "card";
    public decimal DiscountAmount { get; set; } = 0m;
    public string? Notes { get; set; }
}