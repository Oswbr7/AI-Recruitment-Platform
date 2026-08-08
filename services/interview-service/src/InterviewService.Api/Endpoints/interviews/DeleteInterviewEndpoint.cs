using InterviewService.Application.Features.Interviews.Delete;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class DeleteInterviewEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/interviews/{id:guid}", Handle)
            .WithName("DeleteInterview")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(
            new DeleteInterviewCommand(id),
            cancellationToken);

        if (!deleted)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.NoContent();
    }
}
