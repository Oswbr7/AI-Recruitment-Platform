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

        interview.Reschedule(request.ScheduledAt);

        await _interviews.UpdateAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return interview.ToResponse();
    }
}
