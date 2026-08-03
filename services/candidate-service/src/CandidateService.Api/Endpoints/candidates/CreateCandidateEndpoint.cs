using CandidateService.Application.Features.Candidates.Create;
using CandidateService.Shared.Common;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class CreateCandidateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/candidates", Handle)
            .WithName("CreateCandidate")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        CreateCandidateCommand command,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(command, cancellationToken);

        return Results.Created(
            $"/api/candidates/{response.Id}",
            Result<CreateCandidateResponse>.Ok(
                response,
                "Candidate created successfully."));
    }
}
