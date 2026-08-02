using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Delete;

public sealed class DeleteJobHandler
    : IRequestHandler<DeleteJobCommand, bool>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = await _jobs.GetByIdAsync(request.Id, cancellationToken);

        if (job is null)
            return false;

        await _jobs.DeleteAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
