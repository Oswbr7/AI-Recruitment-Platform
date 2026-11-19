using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.Offer;

public sealed record OfferApplicationCommand(Guid Id)
    : IRequest<ApplicationResponse?>;
