using System;
using System.Collections.Generic;

namespace AuthService.Application.Features.Auth.Register
{
    public record Response
    {
        public bool Success { get; init; }
        public string? Message { get; init; }
        public string? UserId { get; init; }
        public string? Email { get; init; }
        public string? FullName { get; init; }
        public string? Token { get; init; }
        public string? RefreshToken { get; init; }
        public DateTime? ExpiresAt { get; init; }
        public IReadOnlyList<string>? Errors { get; init; }

        public static Response Ok(string userId, string email, string fullName, string token, string refreshToken, DateTime expiresAt)
            => new Response
            {
                Success = true,
                Message = "Registration successful",
                UserId = userId,
                Email = email,
                FullName = fullName,
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                Errors = Array.Empty<string>()
            };

        public static Response Fail(params string[] errors)
            => new Response
            {
                Success = false,
                Message = "Registration failed",
                Errors = errors
            };
    }
}
