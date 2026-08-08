using JobService.Application.Features.Jobs.Publish;
using JobService.Application.Jobs.Queries.GetJobs;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class PublishJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/jobs/{id:guid}/publish", Handle)
            .WithName("PublishJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new PublishJobCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.Ok(Result<JobResponse>.Ok(response, "Job published successfully."));
    }
}
