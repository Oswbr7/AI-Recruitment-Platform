using AuthService.Application.Common.Results;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<Result<string>>;