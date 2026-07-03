using MediatR;

namespace AuthService.Application.Features.Auth.Commands;

public record RegisterUserCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName
) : IRequest<Result<Guid>>;