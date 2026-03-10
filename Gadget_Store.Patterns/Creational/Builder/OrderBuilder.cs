using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Creational.Builder;

public class OrderBuilder : IOrderBuilder
{
     private readonly List<OrderSummaryItem> _items = new();
     private string _region = "EU";
     private string _paymentMethod = "card";
     private decimal _discount = 0m;
     private decimal _tax = 0m;
     private decimal _shipping = 0m;
     private bool _isExpress = false;
     private string? _notes = null;

     public IOrderBuilder AddItem(string productName, decimal unitPrice, int quantity)
     {
          _items.Add(new OrderSummaryItem
          {
               ProductName = productName,
               UnitPrice = unitPrice,
               Quantity = quantity
          });
          return this;
     }

     public IOrderBuilder SetRegion(string region)
     {
          _region = region;
          return this;
     }

     public IOrderBuilder SetPaymentMethod(string method)
     {
          _paymentMethod = method;
          return this;
     }

     public IOrderBuilder SetDiscount(decimal discountAmount)
     {
          _discount = discountAmount;
          return this;
     }

     public IOrderBuilder SetTax(decimal taxAmount)
     {
          _tax = taxAmount;
          return this;
     }

     public IOrderBuilder SetShipping(decimal shippingCost)
     {
          _shipping = shippingCost;
          return this;
     }

     public IOrderBuilder SetExpress(bool isExpress)
     {
          _isExpress = isExpress;
          return this;
     }

     public IOrderBuilder SetNotes(string notes)
     {
          _notes = notes;
          return this;
     }

     public OrderSummary Build()
     {
          var order = new OrderSummary();
          order.SetItems(new List<OrderSummaryItem>(_items));
          order.SetRegion(_region);
          order.SetPaymentMethod(_paymentMethod);
          order.SetDiscount(_discount);
          order.SetTax(_tax);
          order.SetShipping(_shipping);
          order.SetExpress(_isExpress);
          order.SetNotes(_notes);
          order.CalculateGrandTotal();
          return order;
     }
}