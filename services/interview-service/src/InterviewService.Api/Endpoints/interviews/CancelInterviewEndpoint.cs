using InterviewService.Application.Features.Interviews.Cancel;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class CancelInterviewEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/interviews/{id:guid}/cancel", Handle)
            .WithName("CancelInterview")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new CancelInterviewCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Ok(Result<InterviewResponse>.Ok(response, "Interview cancelled successfully."));
    }
}
