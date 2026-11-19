using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Applications.GetApplications;

public sealed class GetApplicationsQueryHandler
    : IRequestHandler<GetApplicationsQuery, PagedResponse<ApplicationResponse>>
{
    private readonly IJobApplicationRepository _applications;

    public GetApplicationsQueryHandler(IJobApplicationRepository applications)
    {
        _applications = applications;
    }

    public async Task<PagedResponse<ApplicationResponse>> Handle(
        GetApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _applications.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.CandidateId,
            request.JobId,
            request.Status,
            request.SortBy,
            request.SortDirection,
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
