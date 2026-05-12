using GadgetStore.Domain.Entities;

namespace GadgetStore.Application.Interfaces;

public interface ITokenService
{
    /// <summary>Genereaza un JWT access token pentru utilizatorul dat.</summary>
    string GenerateAccessToken(User user);

    /// <summary>Genereaza un refresh token aleatoriu (base64, 64 bytes).</summary>
    string GenerateRefreshToken();

    /// <summary>Salveaza refresh token-ul in DB si returneaza entitatea.</summary>
    Task<RefreshToken> SaveRefreshTokenAsync(Guid userId, string token);

    /// <summary>Valideaza refresh token-ul — returneaza entitatea daca e activ, null daca nu.</summary>
    Task<RefreshToken?> ValidateRefreshTokenAsync(string token);

    /// <summary>Revoca refresh token-ul (logout / rotatie).</summary>
    Task RevokeRefreshTokenAsync(string token);

    /// <summary>Revoca TOATE refresh token-urile unui utilizator (logout everywhere).</summary>
    Task RevokeAllUserTokensAsync(Guid userId);
}
