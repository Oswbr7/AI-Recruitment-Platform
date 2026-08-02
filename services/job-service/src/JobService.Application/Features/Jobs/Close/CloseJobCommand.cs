using JobService.Application.Jobs.Queries.GetJobs;
using MediatR;

namespace JobService.Application.Features.Jobs.Close;

public sealed record CloseJobCommand(Guid Id) : IRequest<JobResponse?>;
