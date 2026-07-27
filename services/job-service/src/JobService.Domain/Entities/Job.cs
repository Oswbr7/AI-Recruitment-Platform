using JobService.Domain.Enums;

namespace JobService.Domain.Entities;

public class Job
{
    public Guid Id { get; private set; }

    public string Title { get; private set; }

    public string Description { get; private set; }

    public string Department { get; private set; }

    public string Location { get; private set; }

    public EmploymentType EmploymentType { get; private set; }

    public ExperienceLevel ExperienceLevel { get; private set; }

    public RemoteType RemoteType { get; private set; }

    public decimal? SalaryMin { get; private set; }

    public decimal? SalaryMax { get; private set; }

    public string? Currency { get; private set; }

    public JobStatus Status { get; private set; }

    public DateTime? PublishedAt { get; private set; }

    public DateTime? ClosedAt { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private Job() { }

    private Job(
        string title,
        string description,
        string department,
        string location,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        RemoteType remoteType,
        decimal? salaryMin,
        decimal? salaryMax,
        string? currency)
    {
        Id = Guid.NewGuid();

        Title = title;

        Description = description;

        Department = department;

        Location = location;

        EmploymentType = employmentType;

        ExperienceLevel = experienceLevel;

        RemoteType = remoteType;

        SalaryMin = salaryMin;

        SalaryMax = salaryMax;

        Currency = currency;

        Status = JobStatus.Draft;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public static Job Create(
        string title,
        string description,
        string department,
        string location,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        RemoteType remoteType,
        decimal? salaryMin = null,
        decimal? salaryMax = null,
        string? currency = null)
    {
        return new Job(
            title,
            description,
            department,
            location,
            employmentType,
            experienceLevel,
            remoteType,
            salaryMin,
            salaryMax,
            currency);
    }

    public void Publish()
    {
        Status = JobStatus.Published;
        PublishedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Close()
    {
        Status = JobStatus.Closed;
        ClosedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string title,
        string description,
        string department,
        string location,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        RemoteType remoteType,
        decimal? salaryMin,
        decimal? salaryMax,
        string? currency)
    {
        Title = title;
        Description = description;
        Department = department;
        Location = location;
        EmploymentType = employmentType;
        ExperienceLevel = experienceLevel;
        RemoteType = remoteType;
        SalaryMin = salaryMin;
        SalaryMax = salaryMax;
        Currency = currency;

        UpdatedAt = DateTime.UtcNow;
    }
}
