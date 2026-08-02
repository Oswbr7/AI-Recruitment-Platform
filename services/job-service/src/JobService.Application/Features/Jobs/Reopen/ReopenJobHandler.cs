using JobService.Application.Features.Jobs.Common;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Reopen;

public sealed class ReopenJobHandler
    : IRequestHandler<ReopenJobCommand, JobResponse?>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public ReopenJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<JobResponse?> Handle(
        ReopenJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = await _jobs.GetByIdAsync(request.Id, cancellationToken);

        if (job is null)
            return null;

        job.Reopen();

        await _jobs.UpdateAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return job.ToResponse();
    }
}
