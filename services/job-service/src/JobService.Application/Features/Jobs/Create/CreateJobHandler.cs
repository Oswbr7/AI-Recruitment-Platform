using JobService.Domain.Entities;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Create;

public sealed class CreateJobHandler
    : IRequestHandler<CreateJobCommand, CreateJobResponse>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public CreateJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateJobResponse> Handle(
        CreateJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = Job.Create(
            request.Title,
            request.Description,
            request.Department,
            request.Location,
            request.EmploymentType,
            request.ExperienceLevel,
            request.RemoteType,
            request.SalaryMin,
            request.SalaryMax,
            request.Currency);

        await _jobs.AddAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateJobResponse(job.Id);
    }
}
