using GadgetStore.Application.Interfaces;
using GadgetStore.Patterns.Creational;

namespace GadgetStore.Infrastructure.Payments;

public class CryptoPaymentFactory : PaymentProcessorFactory
{
     protected override IPaymentProcessor CreateProcessor() => new CryptoPaymentProcessor();
}