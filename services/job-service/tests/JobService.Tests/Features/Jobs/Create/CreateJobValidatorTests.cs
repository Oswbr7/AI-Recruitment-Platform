using FluentValidation.TestHelper;
using JobService.Application.Features.Jobs.Create;
using JobService.Domain.Enums;

namespace JobService.Tests.Features.Jobs.Create;

public class CreateJobValidatorTests
{
    private readonly CreateJobValidator _validator = new();

    private static CreateJobCommand ValidCommand() =>
        new(
            Title: "Backend Developer",
            Description: "Descripción",
            Department: "Engineering",
            Location: "Guadalajara",
            EmploymentType: EmploymentType.FullTime,
            ExperienceLevel: ExperienceLevel.MidLevel,
            RemoteType: RemoteType.Remote,
            SalaryMin: 3000,
            SalaryMax: 5000,
            Currency: "MXN",
            CompanyId: null);

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyTitle_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Title = "" });
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void TitleLongerThan150_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Title = new string('a', 151) });
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void SalaryMaxBelowSalaryMin_Fails()
    {
        var result = _validator.TestValidate(
            ValidCommand() with { SalaryMin = 5000, SalaryMax = 3000 });

        result.ShouldHaveValidationErrorFor(x => x.SalaryMax);
    }

    [Fact]
    public void CurrencyNotThreeLetters_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Currency = "US" });
        result.ShouldHaveValidationErrorFor(x => x.Currency);
    }

    [Fact]
    public void CurrencyOfThreeLetters_Passes()
    {
        var result = _validator.TestValidate(ValidCommand() with { Currency = "USD" });
        result.ShouldNotHaveValidationErrorFor(x => x.Currency);
    }
}
