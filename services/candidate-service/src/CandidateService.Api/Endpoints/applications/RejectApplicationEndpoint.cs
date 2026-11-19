using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.Reject;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

public sealed class RejectApplicationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/applications/{id:guid}/reject", Handle)
            .WithName("RejectApplication")
            .WithTags("Applications")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new RejectApplicationCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Application not found."));

        return Results.Ok(Result<ApplicationResponse>.Ok(response));
    }
}
