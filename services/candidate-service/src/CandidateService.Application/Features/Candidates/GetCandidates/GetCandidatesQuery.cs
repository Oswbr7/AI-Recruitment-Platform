using CandidateService.Domain.Enums;
using CandidateService.Shared.Common;
using MediatR;

namespace CandidateService.Application.Features.Candidates.GetCandidates;

public sealed record GetCandidatesQuery(
    int Page,
    int PageSize,
    string? Search,
    CandidateStage? Stage,
    CandidateStatus? Status,
    string? SortBy,
    string? SortDirection) : IRequest<PagedResponse<CandidateResponse>>;
