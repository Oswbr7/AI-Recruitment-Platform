using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Enums;
using MediatR;

namespace CandidateService.Application.Features.Applications.Submit;

public sealed record SubmitApplicationCommand(
    Guid CandidateId,
    Guid JobId,
    ApplicationSource? Source,
    string? CoverNote
) : IRequest<ApplicationResponse?>;
