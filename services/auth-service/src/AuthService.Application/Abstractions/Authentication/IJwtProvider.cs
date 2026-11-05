using AuthService.Domain.Entities;

namespace AuthService.Application.Abstractions.Authentication;

public interface IJwtProvider
{
    GeneratedToken Generate(User user);
}
