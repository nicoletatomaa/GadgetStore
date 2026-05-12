namespace GadgetStore.Domain.Entities;

public class Order
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid UserId { get; private set; }
    public string Status { get; private set; } = "Pending";
    public string Region { get; private set; } = string.Empty;
    public decimal Subtotal { get; private set; }
    public decimal DiscountAmount { get; private set; }
    public decimal TaxAmount { get; private set; }
    public decimal ShippingCost { get; private set; }
    public decimal TotalAmount { get; private set; }
    public string? ShippingAddress { get; private set; }
    public string? BillingAddress { get; private set; }
    public string? CouponCode { get; private set; }
    public string? Notes { get; private set; }
    public bool IsExpress { get; private set; }
    public string PaymentMethod { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    public User? User { get; private set; }
    public ICollection<OrderItem> Items { get; private set; } = new List<OrderItem>();
    public ICollection<Payment> Payments { get; private set; } = new List<Payment>();

    protected Order() { }

    public Order(Guid userId, string region, string paymentMethod, bool isExpress = false)
    {
        UserId = userId;
        Region = region;
        PaymentMethod = paymentMethod;
        IsExpress = isExpress;
    }

    public void SetTotals(decimal subtotal, decimal discount, decimal tax, decimal shipping)
    {
        Subtotal = subtotal;
        DiscountAmount = discount;
        TaxAmount = tax;
        ShippingCost = shipping;
        TotalAmount = subtotal - discount + tax + shipping;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetAddresses(string? shippingAddress, string? billingAddress)
    {
        ShippingAddress = shippingAddress;
        BillingAddress = billingAddress;
    }

    public void SetCoupon(string? couponCode) => CouponCode = couponCode;
    public void SetNotes(string? notes) => Notes = notes;

    public void UpdateStatus(string status)
    {
        Status = status;
        UpdatedAt = DateTime.UtcNow;
    }
}
