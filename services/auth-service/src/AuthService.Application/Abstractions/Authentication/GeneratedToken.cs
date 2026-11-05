namespace AuthService.Application.Abstractions.Authentication;

/// <summary>
/// Token JWT generado junto con su fecha de expiración, para que la capa
/// Application pueda construir respuestas completas sin duplicar la
/// lógica de duración que vive en Infrastructure (JwtProvider).
/// </summary>
public sealed record GeneratedToken(
    string AccessToken,
    DateTime ExpiresAt);
