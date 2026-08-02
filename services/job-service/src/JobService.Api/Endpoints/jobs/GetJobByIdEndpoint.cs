using JobService.Application.Features.Jobs.GetJobById;
using JobService.Application.Jobs.Queries.GetJobs;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class GetJobByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/jobs/{id:guid}", Handle)
            .WithName("GetJobById")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetJobByIdQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.Ok(Result<JobResponse>.Ok(response));
    }
}
