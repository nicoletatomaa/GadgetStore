using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

/// Handler 3: valoarea minimă a comenzii este 50 lei.
public class MinimumOrderHandler : BaseOrderValidationHandler
{
    private const decimal MinimumOrder = 50m;

    public override OrderValidationResult Handle(
        OrderValidationRequest request,
        OrderValidationResult result)
    {
        var subtotal = request.Items.Sum(i => i.Price * i.Qty);
        if (subtotal < MinimumOrder)
        {
            result.IsValid = false;
            result.Errors.Add(
                $"Valoarea comenzii ({subtotal} lei) este sub minimul de {MinimumOrder} lei.");
            return result;
        }

        result.PassedHandlers.Add(nameof(MinimumOrderHandler));
        return base.Handle(request, result);
    }
}