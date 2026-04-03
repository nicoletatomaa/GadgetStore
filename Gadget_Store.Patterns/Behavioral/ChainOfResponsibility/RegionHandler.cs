using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

/// Handler 4: verifică că regiunea este suportată.
public class RegionHandler : BaseOrderValidationHandler
{
    private static readonly HashSet<string> SupportedRegions =
        new(StringComparer.OrdinalIgnoreCase) { "EU", "US", "Asia" };

    public override OrderValidationResult Handle(
        OrderValidationRequest request,
        OrderValidationResult result)
    {
        if (!SupportedRegions.Contains(request.Region))
        {
            result.IsValid = false;
            result.Errors.Add(
                $"Regiune nesuportată: '{request.Region}'. Valori acceptate: EU, US, Asia.");
            return result;
        }

        result.PassedHandlers.Add(nameof(RegionHandler));
        return base.Handle(request, result);
    }
}