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
