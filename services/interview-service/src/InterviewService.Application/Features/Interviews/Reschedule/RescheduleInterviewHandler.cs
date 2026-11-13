using InterviewService.Application.Features.Interviews.Common;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Reschedule;

public sealed class RescheduleInterviewHandler
    : IRequestHandler<RescheduleInterviewCommand, InterviewResponse?>
{
    private readonly IInterviewRepository _interviews;
    private readonly IUnitOfWork _unitOfWork;

    public RescheduleInterviewHandler(
        IInterviewRepository interviews,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _unitOfWork = unitOfWork;
    }

    public async Task<InterviewResponse?> Handle(
        RescheduleInterviewCommand request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.Id, cancellationToken);

        if (interview is null)
            return null;

        // Primero la invariante de estado de dominio (solo Scheduled se puede
        // mover); despues el chequeo de agenda con la NUEVA fecha, excluyendo
        // a la propia entrevista del chequeo. Si hay choque, lanzamos antes
        // de Update/SaveChanges: nada persiste.
        interview.Reschedule(request.ScheduledAt);

        var overlaps = await _interviews.HasOverlapForRecruiterAsync(
            interview.RecruiterId,
            request.ScheduledAt,
            interview.DurationMinutes,
            excludeInterviewId: interview.Id,
            cancellationToken);

        if (overlaps)
            throw new InvalidOperationException(
                $"The recruiter already has an overlapping interview scheduled around {request.ScheduledAt:yyyy-MM-dd HH:mm}.");

        await _interviews.UpdateAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return interview.ToResponse();
    }
}
