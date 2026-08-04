using InterviewService.Application.Features.Interviews.Common;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Cancel;

public sealed class CancelInterviewHandler
    : IRequestHandler<CancelInterviewCommand, InterviewResponse?>
{
    private readonly IInterviewRepository _interviews;
    private readonly IUnitOfWork _unitOfWork;

    public CancelInterviewHandler(
        IInterviewRepository interviews,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _unitOfWork = unitOfWork;
    }

    public async Task<InterviewResponse?> Handle(
        CancelInterviewCommand request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.Id, cancellationToken);

        if (interview is null)
            return null;

        interview.Cancel();

        await _interviews.UpdateAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return interview.ToResponse();
    }
}
