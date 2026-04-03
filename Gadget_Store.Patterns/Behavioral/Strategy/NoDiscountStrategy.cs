using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Strategy;

public class NoDiscountStrategy : IDiscountStrategy
{
    public decimal ApplyDiscount(decimal subtotal) => 0m;
    public string GetDescription() => "Fără discount";
}