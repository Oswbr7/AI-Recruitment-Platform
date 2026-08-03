using CompanyService.Domain.Repositories;
using FluentValidation;

namespace CompanyService.Application.Features.Companies.Create;

public class CreateCompanyValidator : AbstractValidator<CreateCompanyCommand>
{
    public CreateCompanyValidator(ICompanyRepository companies)
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Industry)
            .IsInEnum();

        RuleFor(x => x.LegalName)
            .MaximumLength(200);

        RuleFor(x => x.TaxId)
            .MaximumLength(50)
            .MustAsync((taxId, cancellationToken) =>
                IsTaxIdAvailableAsync(companies, taxId!, null, cancellationToken))
            .WithMessage("A company with this Tax ID already exists.")
            .When(x => !string.IsNullOrWhiteSpace(x.TaxId));

        RuleFor(x => x.Website)
            .MaximumLength(300);

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrWhiteSpace(x.Email))
            .MaximumLength(200);

        RuleFor(x => x.Phone)
            .MaximumLength(30);

        RuleFor(x => x.CompanySize)
            .IsInEnum()
            .When(x => x.CompanySize.HasValue);

        RuleFor(x => x.FoundedYear)
            .InclusiveBetween(1800, 2100)
            .When(x => x.FoundedYear.HasValue);

        RuleFor(x => x.Country)
            .MaximumLength(100);

        RuleFor(x => x.State)
            .MaximumLength(100);

        RuleFor(x => x.City)
            .MaximumLength(100);

        RuleFor(x => x.Address)
            .MaximumLength(300);

        RuleFor(x => x.PostalCode)
            .MaximumLength(20);
    }

    private static async Task<bool> IsTaxIdAvailableAsync(
        ICompanyRepository companies,
        string taxId,
        Guid? excludeCompanyId,
        CancellationToken cancellationToken)
    {
        return !await companies.ExistsByTaxIdAsync(taxId, excludeCompanyId, cancellationToken);
    }
}
