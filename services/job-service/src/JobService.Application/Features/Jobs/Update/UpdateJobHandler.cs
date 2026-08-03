using JobService.Application.Features.Jobs.Common;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Repositories;
using MediatR;

namespace JobService.Application.Features.Jobs.Update;

public sealed class UpdateJobHandler
    : IRequestHandler<UpdateJobCommand, JobResponse?>
{
    private readonly IJobRepository _jobs;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateJobHandler(
        IJobRepository jobs,
        IUnitOfWork unitOfWork)
    {
        _jobs = jobs;
        _unitOfWork = unitOfWork;
    }

    public async Task<JobResponse?> Handle(
        UpdateJobCommand request,
        CancellationToken cancellationToken)
    {
        var job = await _jobs.GetByIdAsync(request.Id, cancellationToken);

        if (job is null)
            return null;

        job.Update(
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

        job.AssignCompany(request.CompanyId);

        await _jobs.UpdateAsync(job, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return job.ToResponse();
    }
}
