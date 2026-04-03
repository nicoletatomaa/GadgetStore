using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using GadgetStore.Domain.Interfaces;

namespace GadgetStore.Patterns.Behavioral.Observer;

public class EmailAlertObserver : IProductObserver
{
    public string Email { get; }
    public List<string> ReceivedAlerts { get; } = new();

    public EmailAlertObserver(string email)
    {
        Email = email;
    }

    public void OnStockChanged(Guid productId, string productName, int newStock)
    {
        var msg = newStock == 0
            ? $"[EMAIL → {Email}] STOC EPUIZAT: {productName}"
            : $"[EMAIL → {Email}] Stoc actualizat: {productName} — {newStock} buc.";
        Console.WriteLine(msg);
        ReceivedAlerts.Add(msg);
    }

    public void OnPriceChanged(Guid productId, string productName, decimal newPrice)
    {
        var msg = $"[EMAIL → {Email}] Preț nou: {productName} — {newPrice} lei";
        Console.WriteLine(msg);
        ReceivedAlerts.Add(msg);
    }
}