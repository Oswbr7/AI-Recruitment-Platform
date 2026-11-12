using JobService.Application.Features.Jobs.Common;
using JobService.Domain.Repositories;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace JobService.Application.Features.Jobs.GetJobs;

public sealed class GetJobsQueryHandler
    : IRequestHandler<GetJobsQuery, PagedResponse<JobResponse>>
{
    private readonly IJobRepository _repository;

    public GetJobsQueryHandler(IJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResponse<JobResponse>> Handle(
        GetJobsQuery request,
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.Search,
            request.Status,
            request.CompanyId,
            request.SortBy,
            request.SortDirection,
            cancellationToken);

        return new PagedResponse<JobResponse>
        {
            Items = items.Select(job => job.ToResponse()).ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}
