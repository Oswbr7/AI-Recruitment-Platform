using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Enums;
using MediatR;

namespace CandidateService.Application.Features.Candidates.MoveStage;

public sealed record MoveCandidateStageCommand(Guid Id, CandidateStage Stage) : IRequest<CandidateResponse?>;
