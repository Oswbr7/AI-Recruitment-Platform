using InterviewService.Application.Features.Interviews.Common;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Complete;

public sealed class CompleteInterviewHandler
    : IRequestHandler<CompleteInterviewCommand, InterviewResponse?>
{
    private readonly IInterviewRepository _interviews;
    private readonly IUnitOfWork _unitOfWork;

    public CompleteInterviewHandler(
        IInterviewRepository interviews,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _unitOfWork = unitOfWork;
    }

    public async Task<InterviewResponse?> Handle(
        CompleteInterviewCommand request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.Id, cancellationToken);

        if (interview is null)
            return null;

        interview.Complete();

        await _interviews.UpdateAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return interview.ToResponse();
    }
}
