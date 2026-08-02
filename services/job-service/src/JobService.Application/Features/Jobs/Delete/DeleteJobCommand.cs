using MediatR;

namespace JobService.Application.Features.Jobs.Delete;

public sealed record DeleteJobCommand(Guid Id) : IRequest<bool>;
