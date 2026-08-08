using CandidateService.Application.Features.Candidates.Notes.AddCandidateNote;
using CandidateService.Application.Features.Candidates.Notes.Common;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class AddCandidateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/candidates/{id:guid}/notes", Handle)
            .WithName("AddCandidateNote")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        AddCandidateNoteRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new AddCandidateNoteCommand(id, body.Content),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Created(
            $"/api/candidates/{id}/notes/{response.Id}",
            Result<CandidateNoteResponse>.Ok(response, "Note added successfully."));
    }
}

public sealed record AddCandidateNoteRequestBody(string Content);
