using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Strategy;

public class PercentageDiscountStrategy : IDiscountStrategy
{
    private readonly decimal _percent;

    public PercentageDiscountStrategy(decimal percent)
    {
        _percent = percent;
    }

    public decimal ApplyDiscount(decimal subtotal) =>
        Math.Round(subtotal * (_percent / 100m), 2);

    public string GetDescription() => $"Discount procentual {_percent}%";
}