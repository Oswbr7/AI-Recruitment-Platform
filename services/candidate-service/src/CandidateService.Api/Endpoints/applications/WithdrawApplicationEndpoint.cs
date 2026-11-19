using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.Withdraw;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

public sealed class WithdrawApplicationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/applications/{id:guid}/withdraw", Handle)
            .WithName("WithdrawApplication")
            .WithTags("Applications")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new WithdrawApplicationCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Application not found."));

        return Results.Ok(Result<ApplicationResponse>.Ok(response));
    }
}
