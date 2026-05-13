using System.ComponentModel.DataAnnotations;

namespace GadgetStore.API.DTOs;

public record AddReviewRequest(
    [Required, Range(1, 5, ErrorMessage = "Rating trebuie sa fie intre 1 si 5.")]
    byte Rating,
    [MaxLength(2000)] string? Comment
);
