using FluentValidation.TestHelper;
using CandidateService.Application.Features.Candidates.Create;

namespace CandidateService.Tests.Features.Candidates.Create;

public class CreateCandidateValidatorTests
{
    private readonly CreateCandidateValidator _validator = new();

    private static CreateCandidateCommand ValidCommand() =>
        new(
            FirstName: "María",
            LastName: "López",
            Email: "maria@example.com",
            Phone: null,
            Location: "Guadalajara",
            Headline: null,
            Summary: null,
            LinkedInUrl: null,
            GithubUrl: null,
            PortfolioUrl: null,
            CurrentCompany: null,
            CurrentPosition: null,
            YearsOfExperience: 5,
            ExpectedSalary: 45000,
            Currency: "MXN");

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void InvalidEmail_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Email = "sin-arroba" });
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void EmptyLastName_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { LastName = "" });
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Fact]
    public void NegativeYearsOfExperience_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { YearsOfExperience = -1 });
        result.ShouldHaveValidationErrorFor(x => x.YearsOfExperience);
    }

    [Fact]
    public void CurrencyNotThreeLetters_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Currency = "MX" });
        result.ShouldHaveValidationErrorFor(x => x.Currency);
    }
}
