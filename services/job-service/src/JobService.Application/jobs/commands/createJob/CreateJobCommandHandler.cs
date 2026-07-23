using JobService.Domain.Entities;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Jobs.Commands.CreateJob;

public class CreateJobCommandHandler
    : IRequestHandler<CreateJobCommand, Guid>
{
    private readonly IJobRepository _repository;

    private readonly IUnitOfWork _unitOfWork;

    public CreateJobCommandHandler(
        IJobRepository repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(
        CreateJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = new Job(
            request.Title,
            request.Department,
            request.Location,
            request.Description);

        await _repository.AddAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return job.Id;
    }
}