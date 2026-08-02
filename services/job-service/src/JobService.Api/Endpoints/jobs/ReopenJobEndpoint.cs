using JobService.Application.Features.Jobs.Reopen;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class ReopenJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/jobs/{id:guid}/reopen", Handle)
            .WithName("ReopenJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new ReopenJobCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.Ok(Result<JobResponse>.Ok(response, "Job reopened successfully."));
    }
}
