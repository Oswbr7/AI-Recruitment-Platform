using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.Withdraw;

public sealed record WithdrawApplicationCommand(Guid Id)
    : IRequest<ApplicationResponse?>;
