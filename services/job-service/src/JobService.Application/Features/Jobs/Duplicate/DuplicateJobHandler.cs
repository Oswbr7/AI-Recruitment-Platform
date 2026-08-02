using JobService.Application.Features.Jobs.Create;
using JobService.Domain.Entities;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Duplicate;

public sealed class DuplicateJobHandler
    : IRequestHandler<DuplicateJobCommand, CreateJobResponse?>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public DuplicateJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateJobResponse?> Handle(
        DuplicateJobCommand request,
        CancellationToken cancellationToken)
    {
        var source = await _jobs.GetByIdAsync(request.Id, cancellationToken);

        if (source is null)
            return null;

        var duplicate = Job.Create(
            $"{source.Title} (Copy)",
            source.Description,
            source.Department,
            source.Location,
            source.EmploymentType,
            source.ExperienceLevel,
            source.RemoteType,
            source.SalaryMin,
            source.SalaryMax,
            source.Currency);

        await _jobs.AddAsync(duplicate, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateJobResponse(duplicate.Id);
    }
}
