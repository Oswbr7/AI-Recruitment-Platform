using InterviewService.Domain.Entities;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Schedule;

public sealed class ScheduleInterviewHandler
    : IRequestHandler<ScheduleInterviewCommand, ScheduleInterviewResponse>
{
    private readonly IInterviewRepository _interviews;
    private readonly IUnitOfWork _unitOfWork;

    public ScheduleInterviewHandler(
        IInterviewRepository interviews,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _unitOfWork = unitOfWork;
    }

    public async Task<ScheduleInterviewResponse> Handle(
        ScheduleInterviewCommand request,
        CancellationToken cancellationToken)
    {
        // Reglas de negocio del scheduling (el GlobalExceptionHandler las
        // mapea a HTTP 409 InvalidOperationException -> ver architecture §3):
        var alreadyExists = await _interviews.ExistsActiveForCandidateAndJobAsync(
            request.CandidateId,
            request.JobId,
            cancellationToken);

        if (alreadyExists)
            throw new InvalidOperationException(
                "An active interview already exists for this candidate and job.");

        var overlaps = await _interviews.HasOverlapForRecruiterAsync(
            request.RecruiterId,
            request.ScheduledAt,
            request.DurationMinutes,
            cancellationToken);

        if (overlaps)
            throw new InvalidOperationException(
                $"The recruiter already has an overlapping interview scheduled around {request.ScheduledAt:yyyy-MM-dd HH:mm}.");

        var interview = Interview.Schedule(
            request.CandidateId,
            request.JobId,
            request.RecruiterId,
            request.Title,
            request.Description,
            request.InterviewType,
            request.InterviewStage,
            request.ScheduledAt,
            request.DurationMinutes,
            request.MeetingUrl,
            request.Location);

        await _interviews.AddAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ScheduleInterviewResponse(interview.Id);
    }
}
