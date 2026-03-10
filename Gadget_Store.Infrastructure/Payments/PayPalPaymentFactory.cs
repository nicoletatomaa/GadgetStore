using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Payments;

public class PayPalPaymentFactory : PaymentProcessorFactory
{
     protected override IPaymentProcessor CreateProcessor() => new PayPalPaymentProcessor();
}