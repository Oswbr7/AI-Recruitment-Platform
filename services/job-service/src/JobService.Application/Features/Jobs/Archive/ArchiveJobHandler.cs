using JobService.Application.Features.Jobs.Common;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Archive;

public sealed class ArchiveJobHandler
    : IRequestHandler<ArchiveJobCommand, JobResponse?>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public ArchiveJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<JobResponse?> Handle(
        ArchiveJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = await _jobs.GetByIdAsync(request.Id, cancellationToken);

        if (job is null)
            return null;

        job.Archive();

        await _jobs.UpdateAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return job.ToResponse();
    }
}
