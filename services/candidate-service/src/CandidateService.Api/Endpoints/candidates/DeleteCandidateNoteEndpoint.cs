using CandidateService.Application.Features.Candidates.Notes.DeleteCandidateNote;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class DeleteCandidateNoteEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/candidates/{id:guid}/notes/{noteId:guid}", Handle)
            .WithName("DeleteCandidateNote")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        Guid noteId,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(
            new DeleteCandidateNoteCommand(noteId),
            cancellationToken);

        if (!deleted)
            return Results.NotFound(Result.Failure("Note not found."));

        return Results.NoContent();
    }
}
