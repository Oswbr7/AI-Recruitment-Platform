using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Enums;
using MediatR;

namespace JobService.Application.Features.Jobs.Update;

public record UpdateJobCommand(
    Guid Id,
    string Title,
    string Description,
    string Department,
    string Location,
    EmploymentType EmploymentType,
    ExperienceLevel ExperienceLevel,
    RemoteType RemoteType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string? Currency) : IRequest<JobResponse?>;
