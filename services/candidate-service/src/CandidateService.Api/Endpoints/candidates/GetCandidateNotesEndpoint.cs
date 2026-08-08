using CandidateService.Application.Features.Candidates.Notes.Common;
using CandidateService.Application.Features.Candidates.Notes.GetCandidateNotes;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class GetCandidateNotesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/candidates/{id:guid}/notes", Handle)
            .WithName("GetCandidateNotes")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetCandidateNotesQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Ok(Result<List<CandidateNoteResponse>>.Ok(response));
    }
}
