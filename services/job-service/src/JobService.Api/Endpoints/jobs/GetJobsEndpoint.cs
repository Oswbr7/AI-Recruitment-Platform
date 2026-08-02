using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class GetJobsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/jobs", Handle)
            .WithName("GetJobs")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetJobsQuery(),
            cancellationToken);

        return Results.Ok(
            Result<List<JobResponse>>.Ok(response));
    }
}
