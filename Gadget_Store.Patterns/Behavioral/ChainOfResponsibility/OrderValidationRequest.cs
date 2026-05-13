namespace GadgetStore.Patterns.Behavioral.ChainOfResponsibility;

// Reprezinta un produs din cererea de validare.
// ProductId este folosit de StockAvailabilityHandler pentru query DB.
public class OrderValidationItem
{
    public Guid   ProductId { get; set; }
    public string Name      { get; set; } = string.Empty;
    public decimal Price    { get; set; }
    public int    Qty       { get; set; }
}

public class OrderValidationRequest
{
    public List<OrderValidationItem> Items          { get; set; } = new();
    public string                    Region         { get; set; } = "EU";
    public decimal                   DiscountAmount { get; set; } = 0m;
    // UserId folosit de LoyaltyDiscountStrategy pentru numararea comenzilor
    public Guid?                     UserId         { get; set; }
}

public class OrderValidationResult
{
    public bool         IsValid        { get; set; } = true;
    public List<string> Errors         { get; set; } = new();
    public List<string> PassedHandlers { get; set; } = new();
}
