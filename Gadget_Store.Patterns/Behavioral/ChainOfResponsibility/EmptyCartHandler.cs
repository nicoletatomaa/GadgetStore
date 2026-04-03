using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

/// Handler 1: verifică că există cel puțin un produs în comandă.
public class EmptyCartHandler : BaseOrderValidationHandler
{
    public override OrderValidationResult Handle(
        OrderValidationRequest request,
        OrderValidationResult result)
    {
        if (request.Items == null || request.Items.Count == 0)
        {
            result.IsValid = false;
            result.Errors.Add("Coșul este gol. Adaugă cel puțin un produs.");
            return result;
        }

        result.PassedHandlers.Add(nameof(EmptyCartHandler));
        return base.Handle(request, result);
    }
}