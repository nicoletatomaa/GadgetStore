using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

/// Asamblează lanțul în ordinea corectă.
public static class OrderValidationChain
{
    public static IOrderValidationHandler Build()
    {
        var empty = new EmptyCartHandler();
        var price = new NegativePriceHandler();
        var minimum = new MinimumOrderHandler();
        var region = new RegionHandler();

        empty.SetNext(price).SetNext(minimum).SetNext(region);

        return empty;
    }
}