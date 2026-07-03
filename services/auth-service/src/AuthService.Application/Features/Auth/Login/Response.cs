namespace AuthService.Application.Features.Auth.Login;

public sealed record Response(
    string AccessToken,
    DateTime ExpiresAt);