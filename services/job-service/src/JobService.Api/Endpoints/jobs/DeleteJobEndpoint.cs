using JobService.Application.Features.Jobs.Delete;
using JobService.Shared.Common;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class DeleteJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/jobs/{id:guid}", Handle)
            .WithName("DeleteJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(
            new DeleteJobCommand(id),
            cancellationToken);

        if (!deleted)
            return Results.NotFound(Result.Failure("Job not found."));

        return Results.NoContent();
    }
}
