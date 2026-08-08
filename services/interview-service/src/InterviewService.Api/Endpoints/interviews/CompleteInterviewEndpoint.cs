using InterviewService.Application.Features.Interviews.Complete;
using InterviewService.Application.Features.Interviews.GetInterviews;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class CompleteInterviewEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/interviews/{id:guid}/complete", Handle)
            .WithName("CompleteInterview")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new CompleteInterviewCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Ok(Result<InterviewResponse>.Ok(response, "Interview completed successfully."));
    }
}
