using FluentValidation;

namespace CompanyService.Application.Features.Companies.Contacts.AddContact;

public class AddCompanyContactValidator : AbstractValidator<AddCompanyContactCommand>
{
    public AddCompanyContactValidator()
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
