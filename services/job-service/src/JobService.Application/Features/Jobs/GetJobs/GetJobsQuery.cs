using MediatR;

namespace JobService.Application.Jobs.Queries.GetJobs;

public sealed record GetJobsQuery(Guid? CompanyId = null)
    : IRequest<List<JobResponse>>;
