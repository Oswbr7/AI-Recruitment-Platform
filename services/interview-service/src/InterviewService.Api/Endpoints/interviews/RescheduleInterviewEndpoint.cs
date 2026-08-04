using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Application.Features.Interviews.Reschedule;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class RescheduleInterviewEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/interviews/{id:guid}/reschedule", Handle)
            .WithName("RescheduleInterview")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        RescheduleInterviewRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new RescheduleInterviewCommand(id, body.ScheduledAt),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Ok(Result<InterviewResponse>.Ok(response, "Interview rescheduled successfully."));
    }
}

public sealed record RescheduleInterviewRequestBody(DateTime ScheduledAt);
