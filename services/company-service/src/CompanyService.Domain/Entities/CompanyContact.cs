namespace CompanyService.Domain.Entities;

public class CompanyContact
{
    public Guid Id { get; private set; }

    public Guid CompanyId { get; private set; }

    public string FirstName { get; private set; }

    public string LastName { get; private set; }

    public string Email { get; private set; }

    public string? Phone { get; private set; }

    public string? Position { get; private set; }

    public bool IsPrimaryContact { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private CompanyContact() { }

    private CompanyContact(
        Guid companyId,
        string firstName,
        string lastName,
        string email,
        string? phone,
        string? position,
        bool isPrimaryContact)
    {
        Id = Guid.NewGuid();

        CompanyId = companyId;

        FirstName = firstName;

        LastName = lastName;

        Email = email;

        Phone = phone;

        Position = position;

        IsPrimaryContact = isPrimaryContact;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public static CompanyContact Create(
        Guid companyId,
        string firstName,
        string lastName,
        string email,
        string? phone = null,
        string? position = null,
        bool isPrimaryContact = false)
    {
        return new CompanyContact(
            companyId,
            firstName,
            lastName,
            email,
            phone,
            position,
            isPrimaryContact);
    }

    public void UpdateProfile(
        string firstName,
        string lastName,
        string email,
        string? phone,
        string? position,
        bool isPrimaryContact)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Phone = phone;
        Position = position;
        IsPrimaryContact = isPrimaryContact;

        UpdatedAt = DateTime.UtcNow;
    }
}
