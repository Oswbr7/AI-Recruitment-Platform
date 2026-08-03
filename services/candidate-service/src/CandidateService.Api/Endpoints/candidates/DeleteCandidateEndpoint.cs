using CandidateService.Application.Features.Candidates.Delete;
using CandidateService.Shared.Common;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class DeleteCandidateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/candidates/{id:guid}", Handle)
            .WithName("DeleteCandidate")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(
            new DeleteCandidateCommand(id),
            cancellationToken);

        if (!deleted)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.NoContent();
    }
}
