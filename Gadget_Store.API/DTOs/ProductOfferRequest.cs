namespace GadgetStore.API.DTOs;

public class ProductOfferRequest
{
    /// Cheia prototipului din registry.
    /// Exemplu: "iphone15-base" | "airpods-base" | "macbook-base"
    public string TemplateKey { get; set; } = string.Empty;

    /// Extras de aplicat, în ordinea dorită.
    /// Valori acceptate: "warranty" | "giftWrap" | "insurance"
    /// Ordinea contează: warranty → insurance calculează asigurarea pe prețul cu garanție.
    public List<string> Extras { get; set; } = new();
}