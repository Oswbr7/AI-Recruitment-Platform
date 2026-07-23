using JobService.Domain.Enums;

namespace JobService.Domain.Entities;

public class Job
{
    public Guid Id { get; private set; }

    public string Title { get; private set; }

    public string Department { get; private set; }

    public string Location { get; private set; }

    public string Description { get; private set; }

    public JobStatus Status { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private Job() { }

    public Job(
        string title,
        string department,
        string location,
        string description)
    {
        Id = Guid.NewGuid();

        Title = title;

        Department = department;

        Location = location;

        Description = description;

        Status = JobStatus.Draft;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        Status = JobStatus.Published;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Close()
    {
        Status = JobStatus.Closed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string title,
        string department,
        string location,
        string description)
    {
        Title = title;
        Department = department;
        Location = location;
        Description = description;

        UpdatedAt = DateTime.UtcNow;
    }
}