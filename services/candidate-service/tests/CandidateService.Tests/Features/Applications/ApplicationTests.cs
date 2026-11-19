using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;

namespace CandidateService.Tests.Features.Applications;

public class ApplicationTests
{
    private static JobApplication NewApplication() =>
        JobApplication.Submit(Guid.NewGuid(), Guid.NewGuid(), ApplicationSource.Portal);

    [Fact]
    public void Submit_StartsAsApplied_WithTimestamps()
    {
        var candidateId = Guid.NewGuid();
        var jobId = Guid.NewGuid();

        var application = JobApplication.Submit(candidateId, jobId, ApplicationSource.Referral, "Me interesa mucho");

        Assert.Equal(ApplicationStatus.Applied, application.Status);
        Assert.Equal(candidateId, application.CandidateId);
        Assert.Equal(jobId, application.JobId);
        Assert.Equal(ApplicationSource.Referral, application.Source);
        Assert.NotEqual(default, application.AppliedAt);
    }

    [Fact]
    public void Submit_EmptyCandidateOrJob_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() => JobApplication.Submit(Guid.Empty, Guid.NewGuid()));
        Assert.Throws<ArgumentException>(() => JobApplication.Submit(Guid.NewGuid(), Guid.Empty));
    }

    [Fact]
    public void FullPipeline_AppliedToOffered_Works()
    {
        var application = NewApplication();

        application.StartReview();
        Assert.Equal(ApplicationStatus.Reviewing, application.Status);

        application.MoveToInterviewing();
        Assert.Equal(ApplicationStatus.Interviewing, application.Status);

        application.Offer();
        Assert.Equal(ApplicationStatus.Offered, application.Status);
    }

    [Theory]
    [InlineData(ApplicationStatus.Reviewing)]
    [InlineData(ApplicationStatus.Interviewing)]
    [InlineData(ApplicationStatus.Offered)]
    public void Reject_WorksFromAnyNonTerminal(ApplicationStatus from)
    {
        var application = NewApplication();
        Reach(application, from);

        application.Reject();

        Assert.Equal(ApplicationStatus.Rejected, application.Status);
    }

    [Theory]
    [InlineData(ApplicationStatus.Applied)]
    [InlineData(ApplicationStatus.Reviewing)]
    [InlineData(ApplicationStatus.Interviewing)]
    [InlineData(ApplicationStatus.Offered)]
    public void Withdraw_WorksFromAnyNonTerminal(ApplicationStatus from)
    {
        var application = NewApplication();
        Reach(application, from);

        application.Withdraw();

        Assert.Equal(ApplicationStatus.Withdrawn, application.Status);
    }

    [Theory]
    [InlineData(ApplicationStatus.Rejected)]
    [InlineData(ApplicationStatus.Withdrawn)]
    public void TerminalStates_AreImmutable(ApplicationStatus terminal)
    {
        var application = NewApplication();
        Reach(application, terminal);

        Assert.Throws<InvalidOperationException>(() => application.StartReview());
        Assert.Throws<InvalidOperationException>(() => application.MoveToInterviewing());
        Assert.Throws<InvalidOperationException>(() => application.Offer());
        Assert.Throws<InvalidOperationException>(() => application.Reject());
        Assert.Throws<InvalidOperationException>(() => application.Withdraw());
    }

    [Theory]
    [InlineData(ApplicationStatus.Applied, nameof(JobApplication.MoveToInterviewing))]
    [InlineData(ApplicationStatus.Reviewing, nameof(JobApplication.StartReview))]
    [InlineData(ApplicationStatus.Offered, nameof(JobApplication.StartReview))]
    public void ForwardTransitions_RequireExactFromState(
        ApplicationStatus from, string invalidAction)
    {
        var application = NewApplication();
        Reach(application, from);

        Action act = invalidAction switch
        {
            nameof(JobApplication.StartReview) => application.StartReview,
            nameof(JobApplication.MoveToInterviewing) => application.MoveToInterviewing,
            _ => throw new ArgumentOutOfRangeException(nameof(invalidAction))
        };

        var ex = Assert.Throws<InvalidOperationException>(act);
        Assert.Contains(from.ToString(), ex.Message);
    }

    private static void Reach(JobApplication application, ApplicationStatus target)
    {
        if (target == ApplicationStatus.Rejected)
        {
            application.Reject();
            return;
        }

        if (target == ApplicationStatus.Withdrawn)
        {
            application.Withdraw();
            return;
        }

        while (application.Status != target)
        {
            switch (application.Status)
            {
                case ApplicationStatus.Applied:
                    application.StartReview();
                    break;
                case ApplicationStatus.Reviewing:
                    application.MoveToInterviewing();
                    break;
                case ApplicationStatus.Interviewing:
                    application.Offer();
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(target));
            }
        }
    }
}
