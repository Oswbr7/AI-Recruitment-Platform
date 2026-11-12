using MediatR;

namespace JobService.Application.Features.Jobs.GetJobs;

public sealed record GetJobsQuery(Guid? CompanyId = null)
    : IRequest<List<JobResponse>>;
