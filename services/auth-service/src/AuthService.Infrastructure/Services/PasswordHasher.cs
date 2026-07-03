// namespace AuthService.Infrastructure.Services;

// public class PasswordHasher
// {
//     public string Hash(string password)
//     {
//         return BCrypt.Net.BCrypt.HashPassword(password);
//     }

//     public bool Verify(string password, string hash)
//     {
//         return BCrypt.Net.BCrypt.Verify(password, hash);
//     }
// }

using AuthService.Application.Abstractions.Security;
using BCrypt.Net;

namespace AuthService.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password);

    public bool Verify(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(password, hash);
}