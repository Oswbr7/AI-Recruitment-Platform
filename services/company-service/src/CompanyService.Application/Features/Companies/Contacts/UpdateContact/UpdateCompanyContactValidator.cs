using FluentValidation;

namespace CompanyService.Application.Features.Companies.Contacts.UpdateContact;

public class UpdateCompanyContactValidator : AbstractValidator<UpdateCompanyContactCommand>
{
    public UpdateCompanyContactValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(x => x.Phone)
            .MaximumLength(30);

        RuleFor(x => x.Position)
            .MaximumLength(150);
    }
}
