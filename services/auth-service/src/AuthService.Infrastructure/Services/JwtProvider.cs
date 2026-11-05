using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Application.Abstractions.Authentication;
using AuthService.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AuthService.Infrastructure.Services;

public class JwtProvider : IJwtProvider
{
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);

    private readonly IConfiguration _configuration;

    public JwtProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public GeneratedToken Generate(User user)
    {
        var expiresAt = DateTime.UtcNow.Add(TokenLifetime);

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!));

        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

        var subClaim = new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString());
        var emailClaim = new Claim(JwtRegisteredClaimNames.Email, user.Email);
        var roleClaim = new Claim("role", user.Role.ToString());

        var claims = new[] { subClaim, emailClaim, roleClaim };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var accessToken = new JwtSecurityTokenHandler()
            .WriteToken(token);

        return new GeneratedToken(accessToken, expiresAt);
    }
}
