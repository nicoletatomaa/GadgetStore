using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

public interface IOrderValidationHandler
{
    IOrderValidationHandler SetNext(IOrderValidationHandler next);
    OrderValidationResult Handle(OrderValidationRequest request, OrderValidationResult result);
}