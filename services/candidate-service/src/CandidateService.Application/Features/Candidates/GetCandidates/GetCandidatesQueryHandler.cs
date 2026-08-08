using CandidateService.Application.Features.Candidates.Common;
using CandidateService.Domain.Repositories;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Application.Features.Candidates.GetCandidates;

public sealed class GetCandidatesQueryHandler
    : IRequestHandler<GetCandidatesQuery, PagedResponse<CandidateResponse>>
{
    private readonly ICandidateRepository _candidates;

    public GetCandidatesQueryHandler(ICandidateRepository candidates)
    {
        _candidates = candidates;
    }

    public async Task<PagedResponse<CandidateResponse>> Handle(
        GetCandidatesQuery request,
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _candidates.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.Search,
            request.Stage,
            request.Status,
            request.SortBy,
            request.SortDirection,
            cancellationToken);

        return new PagedResponse<CandidateResponse>
        {
            Items = items.Select(x => x.ToResponse()).ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}
