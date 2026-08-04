using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Enums;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class GetInterviewsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/interviews", Handle)
            .WithName("GetInterviews")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken,
        int page = 1,
        int pageSize = 10,
        string? search = null,
        Guid? candidateId = null,
        Guid? jobId = null,
        Guid? recruiterId = null,
        string? status = null,
        string? stage = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        string? sortBy = null,
        string? sortDirection = null)
    {
        Enum.TryParse<InterviewStatus>(status, true, out var parsedStatus);
        Enum.TryParse<InterviewStage>(stage, true, out var parsedStage);

        var query = new GetInterviewsQuery(
            page < 1 ? 1 : page,
            pageSize < 1 ? 10 : pageSize,
            search,
            candidateId,
            jobId,
            recruiterId,
            string.IsNullOrWhiteSpace(status) ? null : parsedStatus,
            string.IsNullOrWhiteSpace(stage) ? null : parsedStage,
            dateFrom,
            dateTo,
            sortBy,
            sortDirection);

        var response = await sender.Send(query, cancellationToken);

        return Results.Ok(Result<PagedResponse<InterviewResponse>>.Ok(response));
    }
}
