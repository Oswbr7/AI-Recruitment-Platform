using AuthService.Domain.Entities;

namespace AuthService.Application.Abstractions.Authentication;

public interface IJwtProvider
{
    string Generate(User user);
}