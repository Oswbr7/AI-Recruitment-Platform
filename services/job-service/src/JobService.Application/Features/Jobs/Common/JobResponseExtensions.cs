using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Entities;

namespace JobService.Application.Features.Jobs.Common;

public static class JobResponseExtensions
{
    public static JobResponse ToResponse(this Job job)
    {
        return new JobResponse
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Department = job.Department,
            Location = job.Location,
            EmploymentType = job.EmploymentType.ToString(),
            ExperienceLevel = job.ExperienceLevel.ToString(),
            RemoteType = job.RemoteType.ToString(),
            SalaryMin = job.SalaryMin,
            SalaryMax = job.SalaryMax,
            Currency = job.Currency,
            Status = job.Status.ToString(),
            PublishedAt = job.PublishedAt,
            ClosedAt = job.ClosedAt,
            CreatedAt = job.CreatedAt,
            UpdatedAt = job.UpdatedAt
        };
    }
}
