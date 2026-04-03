using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Strategy;

public class FixedDiscountStrategy : IDiscountStrategy
{
    private readonly decimal _amount;

    public FixedDiscountStrategy(decimal amount)
    {
        _amount = amount;
    }

    public decimal ApplyDiscount(decimal subtotal) =>
        subtotal >= _amount ? _amount : subtotal;

    public string GetDescription() => $"Discount fix {_amount} lei";
}