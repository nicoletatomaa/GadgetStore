using GadgetStore.Application.Interfaces;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

// Handler 5: verifica stocul disponibil in DB pentru fiecare produs din comanda.
// Integreaza Chain of Responsibility cu Repository pattern (acces DB real).
public class StockAvailabilityHandler : BaseOrderValidationHandler
{
    private readonly IProductRepository _products;

    public StockAvailabilityHandler(IProductRepository products)
    {
        _products = products;
    }

    public override OrderValidationResult Handle(
        OrderValidationRequest request,
        OrderValidationResult result)
    {
        foreach (var item in request.Items.Where(i => i.ProductId != Guid.Empty))
        {
            // .GetAwaiter().GetResult() — apel sync necesar deoarece interfata lantului e sincrona
            var product = _products.GetByIdAsync(item.ProductId).GetAwaiter().GetResult();

            if (product is null || product.Stock < item.Qty)
            {
                result.IsValid = false;
                var available = product?.Stock ?? 0;
                result.Errors.Add(
                    $"Stoc insuficient pentru '{item.Name}' — disponibil: {available} buc., cerut: {item.Qty} buc.");
                return result;
            }
        }

        result.PassedHandlers.Add(nameof(StockAvailabilityHandler));
        return base.Handle(request, result);
    }
}
