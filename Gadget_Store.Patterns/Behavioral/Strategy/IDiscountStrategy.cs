using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Strategy;

public interface IDiscountStrategy
{
    decimal ApplyDiscount(decimal subtotal);
    string GetDescription();
}