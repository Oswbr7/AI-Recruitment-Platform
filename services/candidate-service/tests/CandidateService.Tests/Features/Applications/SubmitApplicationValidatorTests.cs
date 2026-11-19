using CandidateService.Application.Features.Applications.Submit;
using CandidateService.Domain.Enums;
using FluentValidation.TestHelper;

namespace CandidateService.Tests.Features.Applications;

public class SubmitApplicationValidatorTests
{
    private readonly SubmitApplicationValidator _validator = new();

    private static SubmitApplicationCommand ValidCommand() =>
        new(Guid.NewGuid(), Guid.NewGuid(), ApplicationSource.Portal, "Nota de portada");

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyCandidateId_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { CandidateId = Guid.Empty });
        result.ShouldHaveValidationErrorFor(x => x.CandidateId);
    }

    [Fact]
    public void EmptyJobId_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { JobId = Guid.Empty });
        result.ShouldHaveValidationErrorFor(x => x.JobId);
    }

    [Fact]
    public void CoverNoteTooLong_Fails()
    {
        var result = _validator.TestValidate(
            ValidCommand() with { CoverNote = new string('a', 2001) });

        result.ShouldHaveValidationErrorFor(x => x.CoverNote);
    }
}
