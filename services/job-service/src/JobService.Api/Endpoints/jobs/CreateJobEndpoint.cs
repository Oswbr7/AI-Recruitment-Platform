using JobService.Application.Features.Jobs.Create;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class CreateJobEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/jobs", Handle)
            .WithName("CreateJob")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        CreateJobCommand command,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(command, cancellationToken);

        return Results.Created(
            $"/api/jobs/{response.Id}",
            Result<CreateJobResponse>.Ok(
                response,
                "Job created successfully."));
    }
}