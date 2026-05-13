using System.ComponentModel.DataAnnotations;

namespace GadgetStore.API.DTOs;

public class AddToCartRequest
{
    [Required] public string  ProductName { get; set; } = string.Empty;
    [Range(0.01, double.MaxValue)] public decimal UnitPrice  { get; set; }
    [Range(1, 999)]                public int     Quantity   { get; set; } = 1;
}

public class RemoveFromCartRequest
{
    [Required] public string  ProductName { get; set; } = string.Empty;
    [Range(0.01, double.MaxValue)] public decimal UnitPrice  { get; set; }
    [Range(1, 999)]                public int     Quantity   { get; set; } = 1;
}

public class UpdateCartQuantityRequest
{
    [Required] public string  ProductName  { get; set; } = string.Empty;
    [Range(0.01, double.MaxValue)] public decimal UnitPrice    { get; set; }
    [Range(0, 999, ErrorMessage = "Cantitate invalida. 0 = elimina produsul.")]
    public int NewQuantity { get; set; }
}