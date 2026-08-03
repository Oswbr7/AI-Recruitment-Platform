using MediatR;

namespace CandidateService.Application.Features.Candidates.Delete;

public sealed record DeleteCandidateCommand(Guid Id) : IRequest<bool>;
