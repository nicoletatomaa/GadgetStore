using GadgetStore.Infrastructure.Payments;
using GadgetStore.Patterns.Creational;
using GadgetStore.Patterns.Creational.Builder;
using GadgetStore.Patterns.Structural.Facade;
using Microsoft.Extensions.DependencyInjection;

namespace GadgetStore.Infrastructure.Checkout;

/// <summary>
/// Façade: expune un singur punct de intrare pentru checkout.
/// Intern orchestrează:
///   - Abstract Factory  → taxă și livrare specifice regiunii
///   - Builder           → construiește OrderSummary
///   - Factory Method    → selectează și rulează procesorul de plată
/// Clientul nu știe nimic despre aceste subsisteme.
/// </summary>
public class CheckoutFacade : ICheckoutFacade
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PaymentProvider _paymentProvider;

    public CheckoutFacade(IServiceProvider serviceProvider, PaymentProvider paymentProvider)
    {
        _serviceProvider = serviceProvider;
        _paymentProvider = paymentProvider;
    }

    public CheckoutResult ProcessCheckout(CheckoutFacadeRequest request)
    {
        // 1. Abstract Factory — taxă și livrare specifice regiunii
        var regionalFactory = _serviceProvider.GetKeyedService<IRegionalFactory>(request.Region)
            ?? throw new ArgumentException($"Regiune necunoscută: {request.Region}");

        var taxCalculator = regionalFactory.CreateTaxCalculator();
        var shippingProvider = regionalFactory.CreateShippingProvider();

        var subtotal = request.Items.Sum(i => i.Price * i.Qty);
        var tax = taxCalculator.CalculateTax(subtotal);
        var shipping = shippingProvider.GetShippingCost(subtotal);

        // 2. Builder — asamblează comanda
        var builder = new OrderBuilder();
        foreach (var (name, price, qty) in request.Items)
            builder.AddItem(name, price, qty);

        builder
            .SetRegion(request.Region)
            .SetPaymentMethod(request.PaymentMethod)
            .SetDiscount(request.DiscountAmount)
            .SetTax(tax)
            .SetShipping(shipping)
            .SetExpress(false)
            .SetNotes(request.Notes);

        var order = builder.Build();

        // 3. Factory Method — procesează plata
        var paymentFactory = _paymentProvider.GetService(request.PaymentMethod);
        var payment = paymentFactory.Process(order.GrandTotal);

        return new CheckoutResult { Order = order, Payment = payment };
    }
}