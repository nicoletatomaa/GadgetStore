namespace GadgetStore.API.DTOs;

public class BuildOrderRequest
{
     public List<OrderItemDto> Items { get; set; } = new();
     public string Region { get; set; } = "EU";
     public string PaymentMethod { get; set; } = "card";
     public decimal TaxRate { get; set; } = 0.19m;
     public decimal DiscountAmount { get; set; } = 0m;
     public string? Notes { get; set; }
}

public class BuildExpressOrderRequest
{
     public List<OrderItemDto> Items { get; set; } = new();
     public string PaymentMethod { get; set; } = "card";
     public decimal TaxRate { get; set; } = 0.19m;
}

public class OrderItemDto
{
     public string ProductName { get; set; } = string.Empty;
     public decimal UnitPrice { get; set; }
     public int Quantity { get; set; }
}