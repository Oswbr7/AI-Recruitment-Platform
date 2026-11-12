using BuildingBlocks.Application.Common.Errors;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands;

public sealed record ChangePasswordCommand(
    Guid UserId,
    string CurrentPassword,
    string NewPassword
) : IRequest<Result>;
