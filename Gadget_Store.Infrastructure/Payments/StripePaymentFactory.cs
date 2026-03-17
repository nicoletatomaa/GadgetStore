using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Payments;

public class StripePaymentFactory : PaymentProcessorFactory
{
    protected override IPaymentProcessor CreateProcessor() => new StripePaymentAdapter();
}