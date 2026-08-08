using CandidateService.Application.Features.Candidates.GetCandidateById;
using CandidateService.Application.Features.Candidates.GetCandidates;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class GetCandidateByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/candidates/{id:guid}", Handle)
            .WithName("GetCandidateById")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetCandidateByIdQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Ok(Result<CandidateResponse>.Ok(response));
    }
}
