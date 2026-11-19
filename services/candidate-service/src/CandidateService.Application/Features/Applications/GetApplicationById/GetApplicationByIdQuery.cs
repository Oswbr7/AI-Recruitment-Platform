using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.GetApplicationById;

public sealed record GetApplicationByIdQuery(Guid Id)
    : IRequest<ApplicationResponse?>;
