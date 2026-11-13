using FluentValidation.TestHelper;
using CompanyService.Application.Features.Companies.Create;
using CompanyService.Domain.Enums;
using CompanyService.Domain.Repositories;
using Moq;

namespace CompanyService.Tests.Features.Companies.Create;

public class CreateCompanyValidatorTests
{
    private readonly Mock<ICompanyRepository> _companies = new();

    private CreateCompanyValidator CreateValidator() =>
        new(_companies.Object);

    private static CreateCompanyCommand ValidCommand() =>
        new(
            Name: "Acme Corp",
            Industry: Industry.Technology,
            LegalName: null,
            TaxId: null,
            Website: null,
            Email: "hola@acme.example",
            Phone: null,
            Description: null,
            CompanySize: null,
            FoundedYear: null,
            Country: "México",
            State: null,
            City: "CDMX",
            Address: null,
            PostalCode: null);

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = CreateValidator().TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyName_Fails()
    {
        var result = CreateValidator().TestValidate(ValidCommand() with { Name = "" });
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void InvalidEmail_Fails()
    {
        var result = CreateValidator().TestValidate(ValidCommand() with { Email = "no-email" });
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public async Task DuplicateTaxId_Fails()
    {
        // La regla async consulta el repositorio: si el TaxId ya existe, el
        // comando se rechaza con el mensaje de unicidad.
        _companies.Setup(x => x.ExistsByTaxIdAsync(
                "TAX-123", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var result = await CreateValidator().TestValidateAsync(
            ValidCommand() with { TaxId = "TAX-123" });

        result.ShouldHaveValidationErrorFor(x => x.TaxId)
            .WithErrorMessage("A company with this Tax ID already exists.");
    }

    [Fact]
    public async Task AvailableTaxId_Passes()
    {
        _companies.Setup(x => x.ExistsByTaxIdAsync(
                "TAX-123", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var result = await CreateValidator().TestValidateAsync(
            ValidCommand() with { TaxId = "TAX-123" });

        result.ShouldNotHaveValidationErrorFor(x => x.TaxId);
    }

    [Fact]
    public void FoundedYearOutOfRange_Fails()
    {
        var result = CreateValidator().TestValidate(ValidCommand() with { FoundedYear = 1700 });
        result.ShouldHaveValidationErrorFor(x => x.FoundedYear);
    }
}
