using JobService.Application.Features.Jobs.Archive;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class ArchiveJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/jobs/{id:guid}/archive", Handle)
            .WithName("ArchiveJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new ArchiveJobCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.Ok(Result<JobResponse>.Ok(response, "Job archived successfully."));
    }
}
