using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Errors;
using AuthService.Application.Features.Auth.Commands;
using AuthService.Domain.Entities;
using AuthService.Domain.Enums;
using BuildingBlocks.Application.Common.Errors;
using MediatR;

namespace AuthService.Application.Features.Auth.Register;

public class RegisterUserHandler
    : IRequestHandler<RegisterUserCommand, Result<Guid>>
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterUserHandler(
        IUserRepository users,
        IPasswordHasher hasher,
        IUnitOfWork unitOfWork)
    {
        _users = users;
        _hasher = hasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        var exists = await _users.GetByEmailAsync(request.Email);

        if (exists != null)
            return Result<Guid>.Failure(UserErrors.EmailAlreadyExists);

        // Regla de arranque self-hosted: el PRIMER usuario registrado en la
        // base de datos se convierte en Admin (puede crear recruiters desde
        // PATCH /api/users/{id}/role); el resto nace Candidate.
        var isFirstUser = (await _users.GetAllAsync()).Count == 0;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _hasher.Hash(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = isFirstUser ? UserRole.Admin : UserRole.Candidate,
            CreatedAt = DateTime.UtcNow
        };

        await _users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(user.Id);
    }
}
