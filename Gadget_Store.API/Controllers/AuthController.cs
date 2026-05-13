using GadgetStore.API.DTOs;
using GadgetStore.Application.Interfaces;
using GadgetStore.Domain.Entities;
using GadgetStore.Infrastructure.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace GadgetStore.API.Controllers;

/// <summary>
/// Autentificare si gestionare token-uri JWT.
/// Endpoints: POST /api/auth/register, /login, /refresh, /logout, /logout-all
/// </summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository  _users;
    private readonly ITokenService    _tokens;
    private readonly JwtSettings      _jwtSettings;

    public AuthController(
        IUserRepository users,
        ITokenService tokens,
        IOptions<JwtSettings> jwtSettings)
    {
        _users       = users;
        _tokens      = tokens;
        _jwtSettings = jwtSettings.Value;
    }

    // ── POST /api/auth/register ───────────────────────────────────────────────
    /// <summary>Inregistreaza un utilizator nou si returneaza token-uri JWT.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _users.ExistsByEmailAsync(req.Email))
            return Conflict(new { message = $"Email-ul '{req.Email}' este deja folosit." });

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
        var user = new User(req.Email, passwordHash, "Customer");
        user.UpdateProfile(req.FirstName, req.LastName, req.Phone);

        await _users.AddAsync(user);

        return Created("", await BuildAuthResponse(user));
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    /// <summary>Autentificare cu email si parola. Returneaza access token + refresh token.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _users.GetByEmailAsync(req.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email sau parola incorecta." });

        return Ok(await BuildAuthResponse(user));
    }

    // ── POST /api/auth/refresh ────────────────────────────────────────────────
    /// <summary>
    /// Rotatie refresh token: invalideaza token-ul vechi si emite un access token
    /// nou + un refresh token nou (refresh token rotation pentru securitate maxima).
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req)
    {
        var stored = await _tokens.ValidateRefreshTokenAsync(req.RefreshToken);

        if (stored?.User is null)
            return Unauthorized(new { message = "Refresh token invalid sau expirat." });

        // Rotatie: revoca token-ul vechi, emite unul nou
        await _tokens.RevokeRefreshTokenAsync(req.RefreshToken);
        return Ok(await BuildAuthResponse(stored.User));
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────────
    /// <summary>Delogheaza pe acest dispozitiv — revoca refresh token-ul curent.</summary>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
    {
        await _tokens.RevokeRefreshTokenAsync(req.RefreshToken);
        return NoContent();
    }

    // ── POST /api/auth/logout-all ─────────────────────────────────────────────
    /// <summary>Delogheaza de pe toate dispozitivele — revoca toate refresh token-urile.</summary>
    [HttpPost("logout-all")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LogoutAll()
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty) return Unauthorized();

        await _tokens.RevokeAllUserTokensAsync(userId);
        return NoContent();
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────────
    /// <summary>Returneaza datele utilizatorului autentificat curent.</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Me()
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var user = await _users.GetByIdAsync(userId);
        if (user is null) return Unauthorized();

        return Ok(new UserInfo(user.Id, user.Email, user.Role, user.FirstName, user.LastName));
    }

    // ── PATCH /api/auth/profile ───────────────────────────────────────────────
    /// <summary>Actualizeaza profilul utilizatorului autentificat.</summary>
    [HttpPatch("profile")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfo), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var user = await _users.GetByIdAsync(userId);
        if (user is null) return Unauthorized();

        user.UpdateProfile(req.FirstName, req.LastName, req.Phone);
        await _users.UpdateAsync(user);

        return Ok(new UserInfo(user.Id, user.Email, user.Role, user.FirstName, user.LastName));
    }

    // ── PATCH /api/auth/password ──────────────────────────────────────────────
    /// <summary>Schimba parola utilizatorului autentificat.</summary>
    [HttpPatch("password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        var userId = GetCurrentUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var user = await _users.GetByIdAsync(userId);
        if (user is null) return Unauthorized();

        if (!BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Parola curenta este incorecta." });

        user.UpdatePassword(BCrypt.Net.BCrypt.HashPassword(req.NewPassword));
        await _users.UpdateAsync(user);

        return NoContent();
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                 ?? User.FindFirst("sub")?.Value;
        return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    private async Task<AuthResponse> BuildAuthResponse(User user)
    {
        var accessToken  = _tokens.GenerateAccessToken(user);
        var refreshToken = _tokens.GenerateRefreshToken();

        await _tokens.SaveRefreshTokenAsync(user.Id, refreshToken);

        return new AuthResponse(
            AccessToken:  accessToken,
            RefreshToken: refreshToken,
            ExpiresAt:    DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            User:         new UserInfo(user.Id, user.Email, user.Role, user.FirstName, user.LastName)
        );
    }
}
