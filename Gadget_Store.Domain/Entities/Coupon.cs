namespace GadgetStore.Domain.Entities;

public class Coupon
{
    public int Id { get; private set; }
    public string Code { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty;
    public decimal Value { get; private set; }
    public decimal MinOrderAmount { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public int? MaxUses { get; private set; }
    public int UsedCount { get; private set; }
    public bool IsActive { get; private set; } = true;

    protected Coupon() { }

    public Coupon(string code, string type, decimal value, decimal minOrderAmount = 0, DateTime? expiresAt = null, int? maxUses = null)
    {
        Code = code.ToUpper();
        Type = type;
        Value = value;
        MinOrderAmount = minOrderAmount;
        ExpiresAt = expiresAt;
        MaxUses = maxUses;
    }

    public bool IsValid(decimal orderAmount)
    {
        if (!IsActive) return false;
        if (ExpiresAt.HasValue && ExpiresAt.Value < DateTime.UtcNow) return false;
        if (MaxUses.HasValue && UsedCount >= MaxUses.Value) return false;
        if (orderAmount < MinOrderAmount) return false;
        return true;
    }

    public void IncrementUsage() => UsedCount++;
    public void Deactivate() => IsActive = false;
}
