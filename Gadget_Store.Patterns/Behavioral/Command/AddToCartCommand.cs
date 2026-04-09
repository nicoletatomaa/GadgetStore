using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Command;

public class AddToCartCommand : ICartCommand
{
    private readonly Cart _cart;
    private readonly CartItem _item;

    public AddToCartCommand(Cart cart, CartItem item)
    {
        _cart = cart;
        _item = item;
    }

    public string Description =>
        $"Adăugat: {_item.ProductName} x{_item.Quantity} ({_item.LineTotal} lei)";

    public void Execute() => _cart.AddItem(_item);

    public void Undo() =>
        _cart.RemoveItem(_item.ProductName, _item.UnitPrice, _item.Quantity);
}