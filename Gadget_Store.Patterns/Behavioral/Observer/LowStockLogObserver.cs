using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GadgetStore.Domain.Interfaces;

namespace GadgetStore.Patterns.Behavioral.Observer;

public class LowStockLogObserver : IProductObserver
{
    private const int LowStockThreshold = 3;
    public List<string> Log { get; } = new();

    public void OnStockChanged(Guid productId, string productName, int newStock)
    {
        if (newStock <= LowStockThreshold)
        {
            var msg = $"[LOG] Stoc critic ({newStock} buc.) pentru: {productName} [ID: {productId}]";
            Console.WriteLine(msg);
            Log.Add(msg);
        }
    }

    public void OnPriceChanged(Guid productId, string productName, decimal newPrice) { }
}