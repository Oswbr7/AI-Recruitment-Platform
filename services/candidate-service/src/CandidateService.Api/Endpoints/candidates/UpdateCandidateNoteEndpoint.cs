using CandidateService.Application.Features.Candidates.Notes.Common;
using CandidateService.Application.Features.Candidates.Notes.UpdateCandidateNote;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class UpdateCandidateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/candidates/{id:guid}/notes/{noteId:guid}", Handle)
            .WithName("UpdateCandidateNote")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        Guid noteId,
        UpdateCandidateNoteRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new UpdateCandidateNoteCommand(noteId, body.Content),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Note not found."));

        return Results.Ok(Result<CandidateNoteResponse>.Ok(response, "Note updated successfully."));
    }
}

public sealed record UpdateCandidateNoteRequestBody(string Content);
