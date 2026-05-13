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

/// <summary>Request primit de la frontend pentru procesarea checkout-ului.</summary>
public class FrontendCheckoutRequest
{
    public AddressDto ShippingAddress { get; set; } = new();
    public AddressDto BillingAddress  { get; set; } = new();
    public string     PaymentMethod   { get; set; } = "Card";
    public string     Region          { get; set; } = "EU";
    public string?    CouponCode      { get; set; }
    public string?    Notes           { get; set; }
}

public class AddressDto
{
    public string Street     { get; set; } = string.Empty;
    public string City       { get; set; } = string.Empty;
    public string Country    { get; set; } = "Romania";
    public string PostalCode { get; set; } = string.Empty;
    public string? Region    { get; set; }
}