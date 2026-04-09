using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Command;

/// Receiver: obiectul care știe cum să-și modifice starea.
public class Cart
{
    private readonly List<CartItem> _items = new();
    public IReadOnlyList<CartItem> Items => _items.AsReadOnly();
    public decimal Total => _items.Sum(i => i.LineTotal);

    public void AddItem(CartItem item)
    {
        var existing = _items.FirstOrDefault(i =>
            i.ProductName == item.ProductName && i.UnitPrice == item.UnitPrice);

        if (existing is not null)
            existing.Quantity += item.Quantity;
        else
            _items.Add(item);
    }

    public bool RemoveItem(string productName, decimal unitPrice, int quantity)
    {
        var existing = _items.FirstOrDefault(i =>
            i.ProductName == productName && i.UnitPrice == unitPrice);

        if (existing is null) return false;

        if (existing.Quantity <= quantity)
            _items.Remove(existing);
        else
            existing.Quantity -= quantity;

        return true;
    }
}