using System.ComponentModel.DataAnnotations;

namespace GadgetStore.API.DTOs;

// ── Request DTOs ───────────────────────────────────────────────────────────────

public record RegisterRequest(
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, MinLength(8), MaxLength(100)] string Password,
    [MaxLength(100)] string? FirstName,
    [MaxLength(100)] string? LastName,
    [MaxLength(20)]  string? Phone
);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required]               string Password
);

public record RefreshTokenRequest(
    [Required] string RefreshToken
);

public record LogoutRequest(
    [Required] string RefreshToken
);

public record UpdateProfileRequest(
    [MaxLength(100)] string? FirstName,
    [MaxLength(100)] string? LastName,
    [MaxLength(20)]  string? Phone
);

public record ChangePasswordRequest(
    [Required]               string CurrentPassword,
    [Required, MinLength(8)] string NewPassword
);

public record ChangeRoleRequest(
    [Required] string Role
);

// ── Response DTOs ──────────────────────────────────────────────────────────────

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserInfo User
);

public record UserInfo(
    Guid   Id,
    string Email,
    string Role,
    string? FirstName,
    string? LastName
);
