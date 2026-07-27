using BuildingBlocks.Application.Common.Errors;
using JobService.Domain.Enums;
using MediatR;

namespace JobService.Application.Features.Jobs.Create;

public record CreateJobCommand(
    string Title,
    string Description,
    string Department,
    string Location,
    EmploymentType EmploymentType,
    ExperienceLevel ExperienceLevel,
    RemoteType RemoteType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string? Currency) : IRequest<Result<Guid>>;
