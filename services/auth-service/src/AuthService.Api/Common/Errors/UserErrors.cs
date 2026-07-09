using BuildingBlocks.Application.Common.Errors;

namespace AuthService.Application.Common.Errors;

public static class UserErrors
{
    public static readonly Error EmailAlreadyExists =
        new(
            "User.EmailAlreadyExists",
            "Email already exists.",
            ErrorType.Conflict);

    public static readonly Error InvalidCredentials =
        new(
            "User.InvalidCredentials",
            "Invalid email or password.",
            ErrorType.Unauthorized);

    public static readonly Error UserNotFound =
        new(
            "User.NotFound",
            "User was not found.",
            ErrorType.NotFound);
}