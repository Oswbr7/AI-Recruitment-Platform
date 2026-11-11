using InterviewService.Application.Features.Interviews.GetInterviewById;
using InterviewService.Domain.Entities;
using InterviewService.Domain.Enums;
using InterviewService.Domain.Repositories;
using Moq;

namespace InterviewService.Tests.Features.Interviews.GetInterviewById;

public class GetInterviewByIdQueryHandlerTests
{
    private readonly Mock<IInterviewRepository> _interviews = new();

    private GetInterviewByIdQueryHandler CreateHandler() =>
        new(_interviews.Object);

    [Fact]
    public async Task Handle_InterviewNotFound_ReturnsNull()
    {
        _interviews.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Interview?)null);

        var result = await CreateHandler().Handle(
            new GetInterviewByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ExistingInterview_ReturnsMappedResponse()
    {
        var interview = Interview.Schedule(
            Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            "Entrevista técnica", null,
            InterviewType.Video, InterviewStage.Technical,
            DateTime.UtcNow.AddDays(1), 60);

        _interviews.Setup(x => x.GetByIdAsync(interview.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(interview);

        var result = await CreateHandler().Handle(
            new GetInterviewByIdQuery(interview.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(interview.Id, result!.Id);
        Assert.Equal("Entrevista técnica", result.Title);
        Assert.Equal("Scheduled", result.Status);
    }
}
