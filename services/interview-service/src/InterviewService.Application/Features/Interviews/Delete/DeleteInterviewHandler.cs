using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Delete;

public sealed class DeleteInterviewHandler
    : IRequestHandler<DeleteInterviewCommand, bool>
{
    private readonly IInterviewRepository _interviews;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteInterviewHandler(
        IInterviewRepository interviews,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteInterviewCommand request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.Id, cancellationToken);

        if (interview is null)
            return false;

        await _interviews.DeleteAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
