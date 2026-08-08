using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Application.Features.Candidates.Restore;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class RestoreCandidateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/candidates/{id:guid}/restore", Handle)
            .WithName("RestoreCandidate")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new RestoreCandidateCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Ok(Result<CandidateResponse>.Ok(response, "Candidate restored successfully."));
    }
}
