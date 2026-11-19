using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.ToInterviewing;

public sealed record ToInterviewingApplicationCommand(Guid Id)
    : IRequest<ApplicationResponse?>;
