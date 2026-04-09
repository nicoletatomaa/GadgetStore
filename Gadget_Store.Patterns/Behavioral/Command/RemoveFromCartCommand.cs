using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GadgetStore.Patterns.Behavioral.Command;

public class RemoveFromCartCommand : ICartCommand
{
    private readonly Cart _cart;
    private readonly string _productName;
    private readonly decimal _unitPrice;
    private readonly int _quantity;
    private bool _wasRemoved;

    public RemoveFromCartCommand(Cart cart, string productName, decimal unitPrice, int quantity)
    {
        _cart = cart;
        _productName = productName;
        _unitPrice = unitPrice;
        _quantity = quantity;
    }

    public string Description =>
        $"Eliminat: {_productName} x{_quantity} ({_unitPrice * _quantity} lei)";

    public void Execute() =>
        _wasRemoved = _cart.RemoveItem(_productName, _unitPrice, _quantity);

    public void Undo()
    {
        if (_wasRemoved)
            _cart.AddItem(new CartItem
            {
                ProductName = _productName,
                UnitPrice = _unitPrice,
                Quantity = _quantity
            });
    }
}