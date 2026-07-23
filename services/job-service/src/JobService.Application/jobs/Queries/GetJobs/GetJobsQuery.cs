using MediatR;

namespace JobService.Application.Jobs.Queries.GetJobs;

public sealed record GetJobsQuery()
    : IRequest<List<JobResponse>>;