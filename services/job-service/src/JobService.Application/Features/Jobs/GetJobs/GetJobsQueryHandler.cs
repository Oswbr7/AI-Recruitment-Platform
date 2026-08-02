using JobService.Application.Features.Jobs.Common;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Jobs.Queries.GetJobs;

public sealed class GetJobsQueryHandler
    : IRequestHandler<GetJobsQuery, List<JobResponse>>
{
    private readonly IJobRepository _repository;

    public GetJobsQueryHandler(IJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<JobResponse>> Handle(
        GetJobsQuery request,
        CancellationToken cancellationToken)
    {
        var jobs = await _repository.GetAllAsync(cancellationToken);

        return jobs.Select(job => job.ToResponse()).ToList();
    }
}