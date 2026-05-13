using System.ComponentModel.DataAnnotations;

namespace GadgetStore.API.DTOs;

public class AddToCartRequest
{
    [Required] public Guid   ProductId  { get; set; }
    [Range(1, 999)] public int Quantity   { get; set; } = 1;
    public List<string> Decorators { get; set; } = new();
}

public class UpdateCartItemRequest
{
    [Range(1, 999)] public int Quantity { get; set; }
}
