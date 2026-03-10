using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Payments;

public class CardPaymentFactory : PaymentProcessorFactory
{
     protected override IPaymentProcessor CreateProcessor() => new CardPaymentProcessor();
}