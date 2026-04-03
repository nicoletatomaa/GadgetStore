using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Strategy;

public static class DiscountStrategyFactory
{
    public static IDiscountStrategy Create(string type, decimal value = 0m) =>
        type.ToLower() switch
        {
            "percentage" => new PercentageDiscountStrategy(value),
            "fixed" => new FixedDiscountStrategy(value),
            _ => new NoDiscountStrategy()
        };
}