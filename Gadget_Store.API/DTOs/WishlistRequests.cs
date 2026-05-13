using System.ComponentModel.DataAnnotations;

namespace GadgetStore.API.DTOs;

public record AddToWishlistRequest(
    [Required] Guid ProductId
);
