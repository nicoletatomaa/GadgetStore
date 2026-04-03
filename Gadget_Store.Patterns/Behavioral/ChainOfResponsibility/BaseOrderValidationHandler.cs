using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

public abstract class BaseOrderValidationHandler : IOrderValidationHandler
{
    private IOrderValidationHandler? _next;

    public IOrderValidationHandler SetNext(IOrderValidationHandler next)
    {
        _next = next;
        return next;
    }

    public virtual OrderValidationResult Handle(
        OrderValidationRequest request,
        OrderValidationResult result)
    {
        return _next?.Handle(request, result) ?? result;
    }
}