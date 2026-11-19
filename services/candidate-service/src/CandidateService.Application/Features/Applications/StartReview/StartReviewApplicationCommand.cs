using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.StartReview;

public sealed record StartReviewApplicationCommand(Guid Id)
    : IRequest<ApplicationResponse?>;
