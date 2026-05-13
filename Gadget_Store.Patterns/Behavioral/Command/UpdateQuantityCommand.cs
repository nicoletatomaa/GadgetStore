namespace GadgetStore.Patterns.Behavioral.Command;

// Command pentru actualizarea cantitatii unui produs din cos — cu suport undo.
// Execute: seteaza noua cantitate; Undo: restaureaza cantitatea anterioara.
public class UpdateQuantityCommand : ICartCommand
{
    private readonly Cart    _cart;
    private readonly string  _productName;
    private readonly decimal _unitPrice;
    private readonly int     _newQty;
    private          int     _oldQty;

    public UpdateQuantityCommand(Cart cart, string productName, decimal unitPrice, int newQty)
    {
        _cart        = cart;
        _productName = productName;
        _unitPrice   = unitPrice;
        _newQty      = newQty;
    }

    public string Description =>
        $"Cantitate actualizata: {_productName} — {_oldQty} → {_newQty} buc.";

    public void Execute()
    {
        // Salveaza cantitatea veche inainte de modificare (necesar pentru Undo)
        _oldQty = _cart.UpdateItemQuantity(_productName, _unitPrice, _newQty) ?? _newQty;
    }

    public void Undo() => _cart.UpdateItemQuantity(_productName, _unitPrice, _oldQty);
}
