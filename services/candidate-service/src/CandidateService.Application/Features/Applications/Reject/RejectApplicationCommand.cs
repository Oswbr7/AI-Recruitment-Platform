using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.Reject;

public sealed record RejectApplicationCommand(Guid Id)
    : IRequest<ApplicationResponse?>;
