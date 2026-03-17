using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Payments;

public class PaymentProvider
{
     private readonly Dictionary<string, Func<PaymentProcessorFactory>> _creators = new()
     {
         ["card"] = () => new CardPaymentFactory(),
         ["paypal"] = () => new PayPalPaymentFactory(),
         ["crypto"] = () => new CryptoPaymentFactory(),
         ["stripe"] = () => new StripePaymentFactory()  
     };

     public PaymentProcessorFactory GetService(string type)
     {
          if (!_creators.ContainsKey(type))
               throw new ArgumentException($"Metodă de plată necunoscută: {type}");

          return _creators[type]();
     }
}