using GadgetStore.Domain.Entities;

namespace GadgetStore.Patterns.Creational.Builder;

public interface IOrderBuilder
{
     IOrderBuilder AddItem(string productName, decimal unitPrice, int quantity);
     IOrderBuilder SetRegion(string region);
     IOrderBuilder SetPaymentMethod(string method);
     IOrderBuilder SetDiscount(decimal discountAmount);
     IOrderBuilder SetTax(decimal taxAmount);
     IOrderBuilder SetShipping(decimal shippingCost);
     IOrderBuilder SetExpress(bool isExpress);
     IOrderBuilder SetNotes(string notes);
     OrderSummary Build();
}