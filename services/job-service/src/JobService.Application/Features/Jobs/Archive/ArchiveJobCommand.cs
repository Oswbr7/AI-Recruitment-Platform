using JobService.Application.Jobs.Queries.GetJobs;
using MediatR;

namespace JobService.Application.Features.Jobs.Archive;

public sealed record ArchiveJobCommand(Guid Id) : IRequest<JobResponse?>;
