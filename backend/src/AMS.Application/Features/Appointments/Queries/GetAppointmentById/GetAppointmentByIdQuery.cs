using AMS.Application.Common.Exceptions;
using AMS.Application.DTOs;
using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Appointments.Queries.GetAppointmentById;

public record GetAppointmentByIdQuery(int Id) : IRequest<AppointmentDto>;

public class GetAppointmentByIdHandler : IRequestHandler<GetAppointmentByIdQuery, AppointmentDto>
{
    private readonly IAppointmentRepository _repo;

    public GetAppointmentByIdHandler(IAppointmentRepository repo)
    {
        _repo = repo;
    }

    public async Task<AppointmentDto> Handle(GetAppointmentByIdQuery request, CancellationToken ct)
    {
        var a = await _repo.GetByIdWithDetailsAsync(request.Id, ct)
            ?? throw new NotFoundException(nameof(Appointment), request.Id);

        var practitionerName = a.Practitioner?.FullName ?? a.Session?.Practitioner?.FullName;

        return new AppointmentDto(
            a.Id, a.AppointmentDate,
            a.FromTime.ToString(@"hh\:mm"), a.ToTime.ToString(@"hh\:mm"),
            a.PatientName, a.ContactNo, a.Email, a.Notes,
            a.TokenNo, a.Status, a.Status.ToString(),
            a.CancellationReason, a.SessionId, a.PractitionerId,
            practitionerName, a.ParentAppointmentId,
            a.IsFollowUpNeeded, a.CreatedAt, a.UpdatedAt
        );
    }
}
