using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface IPaymentProcessor
{
     PaymentResult ProcessPayment(decimal amount);
}