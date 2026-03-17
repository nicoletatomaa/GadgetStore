namespace GadgetStore.Infrastructure.Payments.External;

public class StripeChargeResult
{
    public string ChargeId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool Paid { get; set; }
}

/// <summary>
/// Simulează un SDK extern cu API incompatibil față de IPaymentProcessor.
/// Lucrează cu long (cenți) și string (currency) — nu cu decimal (lei).
/// </summary>
public class StripeGateway
{
    public StripeChargeResult CreateCharge(long amountInCents, string currency, string description)
    {
        Console.WriteLine($"[STRIPE SDK] Creare charge: {amountInCents} {currency} — {description}");
        var chargeId = $"ch_{Guid.NewGuid().ToString("N")[..16]}";
        Console.WriteLine($"[STRIPE SDK] Charge confirmat. ID: {chargeId}");
        return new StripeChargeResult { ChargeId = chargeId, Status = "succeeded", Paid = true };
    }
}