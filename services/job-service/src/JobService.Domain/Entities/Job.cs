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

    public Guid? CompanyId { get; private set; }

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
        string? currency,
        Guid? companyId)
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

        CompanyId = companyId;

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
        string? currency = null,
        Guid? companyId = null)
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
            currency,
            companyId);
    }

    public void AssignCompany(Guid? companyId)
    {
        CompanyId = companyId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        if (Status != JobStatus.Draft)
            throw new InvalidOperationException(
                $"Cannot publish a job in '{Status}' status. Only draft jobs can be published.");

        Status = JobStatus.Published;
        PublishedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reopen()
    {
        if (Status != JobStatus.Closed && Status != JobStatus.Archived)
            throw new InvalidOperationException(
                $"Cannot reopen a job in '{Status}' status. Only closed or archived jobs can be reopened.");

        Status = JobStatus.Published;
        PublishedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Close()
    {
        if (Status != JobStatus.Published)
            throw new InvalidOperationException(
                $"Cannot close a job in '{Status}' status. Only published jobs can be closed.");

        Status = JobStatus.Closed;
        ClosedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        if (Status == JobStatus.Archived)
            throw new InvalidOperationException(
                "This job is already archived.");

        Status = JobStatus.Archived;
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
