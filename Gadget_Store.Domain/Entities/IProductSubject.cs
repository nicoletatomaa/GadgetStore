using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Domain.Interfaces;

public interface IProductSubject
{
    void Subscribe(IProductObserver observer);
    void Unsubscribe(IProductObserver observer);
    void NotifyStockChanged(int newStock);
    void NotifyPriceChanged(decimal newPrice);
}