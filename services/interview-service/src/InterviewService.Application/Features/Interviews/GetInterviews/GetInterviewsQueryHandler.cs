using InterviewService.Application.Features.Interviews.Common;
using InterviewService.Domain.Repositories;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Application.Features.Interviews.GetInterviews;

public sealed class GetInterviewsQueryHandler
    : IRequestHandler<GetInterviewsQuery, PagedResponse<InterviewResponse>>
{
    private readonly IInterviewRepository _interviews;

    public GetInterviewsQueryHandler(IInterviewRepository interviews)
    {
        _interviews = interviews;
    }

    public async Task<PagedResponse<InterviewResponse>> Handle(
        GetInterviewsQuery request,
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _interviews.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.Search,
            request.CandidateId,
            request.JobId,
            request.RecruiterId,
            request.Status,
            request.Stage,
            request.DateFrom,
            request.DateTo,
            request.SortBy,
            request.SortDirection,
            cancellationToken);

        return new PagedResponse<InterviewResponse>
        {
            Items = items.Select(x => x.ToResponse()).ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}
