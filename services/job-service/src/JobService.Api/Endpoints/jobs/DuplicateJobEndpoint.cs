using JobService.Application.Features.Jobs.Create;
using JobService.Application.Features.Jobs.Duplicate;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class DuplicateJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/jobs/{id:guid}/duplicate", Handle)
            .WithName("DuplicateJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new DuplicateJobCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.Created(
            $"/api/jobs/{response.Id}",
            Result<CreateJobResponse>.Ok(response, "Job duplicated successfully."));
    }
}
