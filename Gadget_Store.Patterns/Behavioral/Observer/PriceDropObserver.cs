using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Interfaces;

namespace GadgetStore.Patterns.Behavioral.Observer;

// Observer care notifica utilizatorii cu produsul in wishlist
// atunci cand pretul acestuia scade.
// Integreaza Observer pattern cu Repository pattern (acces DB real).
public class PriceDropObserver : IProductObserver
{
    private readonly IWishlistRepository _wishlist;

    public PriceDropObserver(IWishlistRepository wishlist)
    {
        _wishlist = wishlist;
    }

    // Nu reactioneaza la schimbari de stoc — WishlistNotificationObserver se ocupa
    public void OnStockChanged(Guid productId, string productName, int newStock) { }

    public void OnPriceChanged(Guid productId, string productName, decimal newPrice)
    {
        var subscribers = _wishlist.GetByProductAsync(productId).GetAwaiter().GetResult();

        foreach (var sub in subscribers)
        {
            var userId = sub.User?.Email ?? sub.UserId.ToString();
            var msg = $"[PRET-DROP] {userId}: Preț nou pentru '{productName}': {newPrice:F2} lei — verifica wishlist-ul!";
            Console.WriteLine(msg);
        }
    }
}
