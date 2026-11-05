using AuthService.Application.Features.Auth.Login;
using BuildingBlocks.Application.Common.Errors;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<Result<LoginResponse>>;
