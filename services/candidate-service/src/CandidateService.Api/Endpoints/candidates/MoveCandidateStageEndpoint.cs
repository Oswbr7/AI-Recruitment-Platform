using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Application.Features.Candidates.MoveStage;
using CandidateService.Domain.Enums;
using CandidateService.Shared.Common;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class MoveCandidateStageEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/candidates/{id:guid}/move", Handle)
            .WithName("MoveCandidateStage")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        MoveCandidateStageRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<CandidateStage>(body.Stage, true, out var stage))
            return Results.BadRequest(Result.Failure("Invalid stage value."));

        var response = await sender.Send(
            new MoveCandidateStageCommand(id, stage),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Ok(Result<CandidateResponse>.Ok(response, "Candidate moved successfully."));
    }
}

public sealed record MoveCandidateStageRequestBody(string Stage);
