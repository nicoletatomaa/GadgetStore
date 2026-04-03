using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Domain.Interfaces;

public interface IProductObserver
{
    void OnStockChanged(Guid productId, string productName, int newStock);
    void OnPriceChanged(Guid productId, string productName, decimal newPrice);
}