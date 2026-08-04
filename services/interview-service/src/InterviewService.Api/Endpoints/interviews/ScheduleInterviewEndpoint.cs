using InterviewService.Application.Features.Interviews.Schedule;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class ScheduleInterviewEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/interviews", Handle)
            .WithName("ScheduleInterview")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ScheduleInterviewCommand command,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(command, cancellationToken);

        return Results.Created(
            $"/api/interviews/{response.Id}",
            Result<ScheduleInterviewResponse>.Ok(response, "Interview scheduled successfully."));
    }
}
