using InterviewService.Application.Features.Interviews.Common;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.GetInterviewById;

public sealed class GetInterviewByIdQueryHandler
    : IRequestHandler<GetInterviewByIdQuery, InterviewResponse?>
{
    private readonly IInterviewRepository _interviews;

    public GetInterviewByIdQueryHandler(IInterviewRepository interviews)
    {
        _interviews = interviews;
    }

    public async Task<InterviewResponse?> Handle(
        GetInterviewByIdQuery request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.Id, cancellationToken);

        return interview?.ToResponse();
    }
}
