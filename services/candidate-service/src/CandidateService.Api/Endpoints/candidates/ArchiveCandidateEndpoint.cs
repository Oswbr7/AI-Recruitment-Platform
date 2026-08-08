using CandidateService.Application.Features.Candidates.Archive;
using CandidateService.Application.Features.Candidates.GetCandidates;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class ArchiveCandidateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/candidates/{id:guid}/archive", Handle)
            .WithName("ArchiveCandidate")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new ArchiveCandidateCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Ok(Result<CandidateResponse>.Ok(response, "Candidate archived successfully."));
    }
}
