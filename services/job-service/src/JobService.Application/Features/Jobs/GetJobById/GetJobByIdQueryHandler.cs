using JobService.Application.Features.Jobs.Common;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.GetJobById;

public sealed class GetJobByIdQueryHandler
    : IRequestHandler<GetJobByIdQuery, JobResponse?>
{
    private readonly IJobRepository _repository;

    public GetJobByIdQueryHandler(IJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<JobResponse?> Handle(
        GetJobByIdQuery request,
        CancellationToken cancellationToken)
    {
        var job = await _repository.GetByIdAsync(request.Id, cancellationToken);

        return job?.ToResponse();
    }
}
