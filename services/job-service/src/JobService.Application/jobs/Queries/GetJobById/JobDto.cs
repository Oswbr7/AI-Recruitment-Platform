namespace JobService.Application.Jobs.DTOs;

public sealed class JobDto
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string Department { get; init; } = string.Empty;

    public string Location { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;
}