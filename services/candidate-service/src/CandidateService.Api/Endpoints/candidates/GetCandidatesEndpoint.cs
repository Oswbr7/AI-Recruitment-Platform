using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Enums;
using CandidateService.Shared.Common;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class GetCandidatesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/candidates", Handle)
            .WithName("GetCandidates")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken,
        int page = 1,
        int pageSize = 10,
        string? search = null,
        string? stage = null,
        string? status = null,
        string? sortBy = null,
        string? sortDirection = null)
    {
        Enum.TryParse<CandidateStage>(stage, true, out var parsedStage);
        Enum.TryParse<CandidateStatus>(status, true, out var parsedStatus);

        var query = new GetCandidatesQuery(
            page < 1 ? 1 : page,
            pageSize < 1 ? 10 : pageSize,
            search,
            string.IsNullOrWhiteSpace(stage) ? null : parsedStage,
            string.IsNullOrWhiteSpace(status) ? null : parsedStatus,
            sortBy,
            sortDirection);

        var response = await sender.Send(query, cancellationToken);

        return Results.Ok(Result<PagedResponse<CandidateResponse>>.Ok(response));
    }
}
