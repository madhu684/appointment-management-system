using AMS.Application.DTOs;
using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Practitioners.Commands.CreatePractitioner;

public record CreatePractitionerCommand(
    string FullName,
    string Specialization,
    string? ContactNo,
    string? Email
) : IRequest<PractitionerDto>;

public class CreatePractitionerHandler : IRequestHandler<CreatePractitionerCommand, PractitionerDto>
{
    private readonly IPractitionerRepository _repo;

    public CreatePractitionerHandler(IPractitionerRepository repo)
    {
        _repo = repo;
    }

    public async Task<PractitionerDto> Handle(CreatePractitionerCommand request, CancellationToken ct)
    {
        var practitioner = new Practitioner
        {
            FullName = request.FullName,
            Specialization = request.Specialization,
            ContactNo = request.ContactNo,
            Email = request.Email
        };

        await _repo.AddAsync(practitioner, ct);
        await _repo.SaveChangesAsync(ct);

        return new PractitionerDto(
            practitioner.Id, practitioner.FullName, practitioner.Specialization,
            practitioner.ContactNo, practitioner.Email, practitioner.IsActive);
    }
}
