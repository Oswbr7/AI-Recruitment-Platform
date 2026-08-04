using AuthService.Application.Features.Users.GetUsers;
using AuthService.Domain.Entities;

namespace AuthService.Application.Features.Users.Common;

public static class UserResponseExtensions
{
    public static UserResponse ToResponse(this User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
}
