using JobService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace JobService.Application.Features.Jobs.GetJobs;

public sealed record GetJobsQuery(
    int Page = 1,
    int PageSize = 10,
    string? Search = null,
    JobStatus? Status = null,
    Guid? CompanyId = null,
    string? SortBy = null,
    string? SortDirection = null
) : IRequest<PagedResponse<JobResponse>>;
