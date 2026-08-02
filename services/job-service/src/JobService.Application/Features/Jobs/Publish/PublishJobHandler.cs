using JobService.Application.Features.Jobs.Common;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Publish;

public sealed class PublishJobHandler
    : IRequestHandler<PublishJobCommand, JobResponse?>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public PublishJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<JobResponse?> Handle(
        PublishJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = await _jobs.GetByIdAsync(request.Id, cancellationToken);

        if (job is null)
            return null;

        job.Publish();

        await _jobs.UpdateAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return job.ToResponse();
    }
}
