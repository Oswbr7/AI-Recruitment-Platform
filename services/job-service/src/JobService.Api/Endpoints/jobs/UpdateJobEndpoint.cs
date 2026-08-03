using JobService.Application.Features.Jobs.Update;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Domain.Enums;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class UpdateJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/jobs/{id:guid}", Handle)
            .WithName("UpdateJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        UpdateJobRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new UpdateJobCommand(
            id,
            body.Title,
            body.Description,
            body.Department,
            body.Location,
            body.EmploymentType,
            body.ExperienceLevel,
            body.RemoteType,
            body.SalaryMin,
            body.SalaryMax,
            body.Currency,
            body.CompanyId);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.Ok(Result<JobResponse>.Ok(response, "Job updated successfully."));
    }
}

public sealed record UpdateJobRequestBody(
    string Title,
    string Description,
    string Department,
    string Location,
    EmploymentType EmploymentType,
    ExperienceLevel ExperienceLevel,
    RemoteType RemoteType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string? Currency,
    Guid? CompanyId);
