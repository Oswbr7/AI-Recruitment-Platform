using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Applications.GetMyApplications;

public sealed class GetMyApplicationsQueryHandler
    : IRequestHandler<GetMyApplicationsQuery, PagedResponse<ApplicationResponse>>
{
    private readonly ICandidateRepository _candidates;
    private readonly IJobApplicationRepository _applications;

    public GetMyApplicationsQueryHandler(
        ICandidateRepository candidates,
        IJobApplicationRepository applications)
    {
        _candidates = candidates;
        _applications = applications;
    }

    public async Task<PagedResponse<ApplicationResponse>> Handle(
        GetMyApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        // sub -> candidato -> aplicaciones: la resolución es interna; el
        // candidato JAMAS pasa un candidateId por URL (privacidad).
        var candidate = await _candidates.GetByUserIdAsync(request.UserId, cancellationToken);

        if (candidate is null)
        {
            return new PagedResponse<ApplicationResponse>
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = 0
            };
        }

        var (items, totalCount) = await _applications.GetPagedAsync(
            request.Page,
            request.PageSize,
            candidate.Id,
            jobId: null,
            status: null,
            sortBy: null,
            sortDirection: "desc",
            cancellationToken);

        return new PagedResponse<ApplicationResponse>
        {
            Items = items.Select(x => x.ToResponse()).ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}
