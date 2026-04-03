using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Structural.Decorator;

public interface IProductOffer
{
    string GetName();
    decimal GetPrice();
    string GetDescription();

    /// Returnează lista de extra-uri adăugate prin decoratoare, pentru afișare transparentă
    IEnumerable<string> GetExtras();
}
