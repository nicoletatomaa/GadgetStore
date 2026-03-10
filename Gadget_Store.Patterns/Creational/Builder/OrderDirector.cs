using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Creational.Builder;

public class OrderDirector
{
     private readonly IOrderBuilder _builder;

     public OrderDirector(IOrderBuilder builder)
     {
          _builder = builder;
     }

     /// <summary>
     /// Comandă standard: cu regiune, taxă calculată, discount opțional și note.
     /// </summary>
     public OrderSummary BuildStandardOrder(
         List<(string name, decimal price, int qty)> items,
         string region,
         string paymentMethod,
         decimal taxRate,
         decimal discountAmount = 0m,
         string? notes = null)
     {
          foreach (var (name, price, qty) in items)
               _builder.AddItem(name, price, qty);

          // Calculăm subtotalul pentru taxă — builder-ul nu are subtotal încă,
          // deci îl calculăm manual din items
          var subtotal = items.Sum(i => i.price * i.qty);
          var tax = Math.Round(subtotal * taxRate, 2);
          var shipping = subtotal > 300m ? 0m : 20m;

          _builder
              .SetRegion(region)
              .SetPaymentMethod(paymentMethod)
              .SetDiscount(discountAmount)
              .SetTax(tax)
              .SetShipping(shipping)
              .SetExpress(false)
              .SetNotes(notes);

          return _builder.Build();
     }

     /// <summary>
     /// Comandă express: livrare rapidă fixă (50 lei), fără discount, fără note.
     /// </summary>
     public OrderSummary BuildExpressOrder(
         List<(string name, decimal price, int qty)> items,
         string paymentMethod,
         decimal taxRate)
     {
          foreach (var (name, price, qty) in items)
               _builder.AddItem(name, price, qty);

          var subtotal = items.Sum(i => i.price * i.qty);
          var tax = Math.Round(subtotal * taxRate, 2);

          _builder
              .SetRegion("EU")
              .SetPaymentMethod(paymentMethod)
              .SetDiscount(0m)
              .SetTax(tax)
              .SetShipping(50m)  // livrare express fixă
              .SetExpress(true)
              .SetNotes(null);

          return _builder.Build();
     }
}