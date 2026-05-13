using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Interfaces;

namespace GadgetStore.Patterns.Behavioral.Observer;

// Observer care notifica toti utilizatorii ce au un produs in wishlist
// atunci cand stocul acestuia se modifica.
// Integreaza Observer pattern cu Repository pattern (acces DB real).
public class WishlistNotificationObserver : IProductObserver
{
    private readonly IWishlistRepository _wishlist;

    public WishlistNotificationObserver(IWishlistRepository wishlist)
    {
        _wishlist = wishlist;
    }

    public void OnStockChanged(Guid productId, string productName, int newStock)
    {
        var subscribers = _wishlist.GetByProductAsync(productId).GetAwaiter().GetResult();

        foreach (var sub in subscribers)
        {
            var userId = sub.User?.Email ?? sub.UserId.ToString();
            var msg = newStock == 0
                ? $"[WISHLIST] {userId}: '{productName}' s-a epuizat."
                : $"[WISHLIST] {userId}: Stoc actualizat pentru '{productName}' — {newStock} buc. disponibile.";
            Console.WriteLine(msg);
        }
    }

    // Nu reactioneaza la schimbari de pret — PriceDropObserver se ocupa de asta
    public void OnPriceChanged(Guid productId, string productName, decimal newPrice) { }
}
