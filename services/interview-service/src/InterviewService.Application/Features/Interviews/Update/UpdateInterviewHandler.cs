using InterviewService.Application.Features.Interviews.Common;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Update;

public sealed class UpdateInterviewHandler
    : IRequestHandler<UpdateInterviewCommand, InterviewResponse?>
{
    private readonly IInterviewRepository _interviews;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateInterviewHandler(
        IInterviewRepository interviews,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _unitOfWork = unitOfWork;
    }

    public async Task<InterviewResponse?> Handle(
        UpdateInterviewCommand request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.Id, cancellationToken);

        if (interview is null)
            return null;

        interview.Update(
            request.Title,
            request.Description,
            request.InterviewType,
            request.InterviewStage,
            request.DurationMinutes,
            request.MeetingUrl,
            request.Location);

        await _interviews.UpdateAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return interview.ToResponse();
    }
}
