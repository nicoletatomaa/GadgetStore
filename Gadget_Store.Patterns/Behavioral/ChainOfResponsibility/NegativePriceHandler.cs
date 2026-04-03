using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

/// Handler 2: verifică că niciun produs nu are preț negativ sau zero.
public class NegativePriceHandler : BaseOrderValidationHandler
{
    public override OrderValidationResult Handle(
        OrderValidationRequest request,
        OrderValidationResult result)
    {
        var invalid = request.Items.Where(i => i.Price <= 0).ToList();
        if (invalid.Any())
        {
            result.IsValid = false;
            foreach (var item in invalid)
                result.Errors.Add($"Preț invalid ({item.Price} lei) pentru: {item.Name}");
            return result;
        }

        result.PassedHandlers.Add(nameof(NegativePriceHandler));
        return base.Handle(request, result);
    }
}