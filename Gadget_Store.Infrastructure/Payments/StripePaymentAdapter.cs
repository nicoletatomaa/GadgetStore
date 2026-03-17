using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Infrastructure.Payments.External;

namespace GadgetStore.Infrastructure.Payments;

/// <summary>
/// Adapter: traduce IPaymentProcessor → StripeGateway.
/// Sistemul intern lucrează cu decimal lei;
/// Stripe lucrează cu long cenți + currency string.
/// Adaptorul face conversia și ascunde incompatibilitatea.
/// </summary>
public class StripePaymentAdapter : IPaymentProcessor
{
    private readonly StripeGateway _stripe = new();

    public PaymentResult ProcessPayment(decimal amount)
    {
        var amountInCents = (long)(amount * 100);
        var result = _stripe.CreateCharge(amountInCents, "RON", "GadgetStore order");

        return new PaymentResult(
            result.Paid,
            result.Paid ? "Plată prin Stripe confirmată." : "Plată Stripe eșuată.",
            result.ChargeId
        );
    }
}