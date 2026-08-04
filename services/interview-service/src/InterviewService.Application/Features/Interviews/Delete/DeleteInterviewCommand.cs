using MediatR;

namespace InterviewService.Application.Features.Interviews.Delete;

public sealed record DeleteInterviewCommand(Guid Id) : IRequest<bool>;
