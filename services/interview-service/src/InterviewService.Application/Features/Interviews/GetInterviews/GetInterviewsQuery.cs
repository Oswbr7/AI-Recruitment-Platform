using InterviewService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace InterviewService.Application.Features.Interviews.GetInterviews;

public sealed record GetInterviewsQuery(
    int Page,
    int PageSize,
    string? Search,
    Guid? CandidateId,
    Guid? JobId,
    Guid? RecruiterId,
    InterviewStatus? Status,
    InterviewStage? Stage,
    DateTime? DateFrom,
    DateTime? DateTo,
    string? SortBy,
    string? SortDirection) : IRequest<PagedResponse<InterviewResponse>>;
