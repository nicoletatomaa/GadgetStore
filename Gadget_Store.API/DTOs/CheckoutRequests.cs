namespace GadgetStore.API.DTOs;

public class CheckoutRequest
{
    public List<OrderItemDto> Items { get; set; } = new();
    public string Region { get; set; } = "EU";
    public string PaymentMethod { get; set; } = "card";
    public decimal DiscountAmount { get; set; } = 0m;

    /// <summary>
    /// none | percentage | fixed
    /// percentage: DiscountAmount = procentul (ex: 10 = 10%)
    /// fixed:      DiscountAmount = suma fixă în lei
    /// </summary>
    public string DiscountType { get; set; } = "none";
    public string? Notes { get; set; }
}