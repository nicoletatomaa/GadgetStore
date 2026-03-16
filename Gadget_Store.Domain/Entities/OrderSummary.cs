namespace GadgetStore.Domain.Entities;

public class OrderSummary
{
     public Guid Id { get; private set; } = Guid.NewGuid();
     public List<OrderSummaryItem> Items { get; private set; } = new();
     public string Region { get; private set; } = string.Empty;
     public string PaymentMethod { get; private set; } = string.Empty;
     public decimal Subtotal { get; private set; }
     public decimal DiscountAmount { get; private set; }
     public decimal TaxAmount { get; private set; }
     public decimal ShippingCost { get; private set; }
     public decimal GrandTotal { get; private set; }
     public bool IsExpress { get; private set; }
     public string? Notes { get; private set; }

     public void SetItems(List<OrderSummaryItem> items)
     {
          Items = items;
          Subtotal = items.Sum(i => i.LineTotal);
     }

     public void SetRegion(string region) => Region = region;
     public void SetPaymentMethod(string method) => PaymentMethod = method;
     public void SetDiscount(decimal discount) => DiscountAmount = discount;
     public void SetTax(decimal tax) => TaxAmount = tax;
     public void SetShipping(decimal shipping) => ShippingCost = shipping;
     public void SetExpress(bool isExpress) => IsExpress = isExpress;
     public void SetNotes(string? notes) => Notes = notes;

     public void CalculateGrandTotal()
     {
          GrandTotal = Subtotal - DiscountAmount + TaxAmount + ShippingCost;
     }

     public void Print()
     {
          Console.WriteLine($"\n=== Sumar Comandă {(IsExpress ? "[EXPRESS]" : "")} ===");
          Console.WriteLine($"ID: {Id}");
          foreach (var item in Items)
               Console.WriteLine($"  - {item.ProductName} x{item.Quantity} = {item.LineTotal} lei");
          Console.WriteLine($"Subtotal:  {Subtotal} lei");
          Console.WriteLine($"Discount:  -{DiscountAmount} lei");
          Console.WriteLine($"Taxă:      {TaxAmount} lei");
          Console.WriteLine($"Livrare:   {ShippingCost} lei");
          Console.WriteLine($"TOTAL:     {GrandTotal} lei");
          Console.WriteLine($"Plată:     {PaymentMethod}");
          Console.WriteLine($"Regiune:   {Region}");
          if (!string.IsNullOrEmpty(Notes))
               Console.WriteLine($"Note:      {Notes}");
          Console.WriteLine("================================\n");
     }
}

public class OrderSummaryItem
{
     public string ProductName { get; set; } = string.Empty;
     public decimal UnitPrice { get; set; }
     public int Quantity { get; set; }
     public decimal LineTotal => UnitPrice * Quantity;
}