using CompanyService.Domain.Entities;

namespace CompanyService.Application.Features.Companies.Contacts.Common;

public static class CompanyContactResponseExtensions
{
    public static CompanyContactResponse ToResponse(this CompanyContact contact)
    {
        return new CompanyContactResponse
        {
            Id = contact.Id,
            CompanyId = contact.CompanyId,
            FirstName = contact.FirstName,
            LastName = contact.LastName,
            Email = contact.Email,
            Phone = contact.Phone,
            Position = contact.Position,
            IsPrimaryContact = contact.IsPrimaryContact,
            CreatedAt = contact.CreatedAt,
            UpdatedAt = contact.UpdatedAt
        };
    }
}
