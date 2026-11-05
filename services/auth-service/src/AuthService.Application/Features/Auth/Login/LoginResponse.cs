namespace AuthService.Application.Features.Auth.Login;

/// <summary>
/// Contrato de respuesta de login. Coincide con el tipo LoginResponse del
/// frontend (frontend/web-app/src/features/auth/types/LoginResponse.ts):
/// accessToken, expiresAt y user {id, fullName, email} (camelCase vía JSON).
/// </summary>
public sealed record LoginResponse(
    string AccessToken,
    DateTime ExpiresAt,
    UserSummary User);

public sealed record UserSummary(
    Guid Id,
    string FullName,
    string Email);
