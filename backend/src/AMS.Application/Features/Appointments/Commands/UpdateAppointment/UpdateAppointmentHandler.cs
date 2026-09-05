using AMS.Application.Common.Exceptions;
using AMS.Application.DTOs;
using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Appointments.Commands.UpdateAppointment;

public class UpdateAppointmentHandler : IRequestHandler<UpdateAppointmentCommand, AppointmentDto>
{
    private readonly IAppointmentRepository _appointmentRepo;

    public UpdateAppointmentHandler(IAppointmentRepository appointmentRepo)
    {
        _appointmentRepo = appointmentRepo;
    }

    public async Task<AppointmentDto> Handle(UpdateAppointmentCommand request, CancellationToken ct)
    {
        var appointment = await _appointmentRepo.GetByIdWithDetailsAsync(request.Id, ct)
            ?? throw new NotFoundException(nameof(Appointment), request.Id);

        appointment.Status = request.Status;
        appointment.Notes = request.Notes;
        appointment.IsFollowUpNeeded = request.IsFollowUpNeeded;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _appointmentRepo.UpdateAsync(appointment, ct);
        await _appointmentRepo.SaveChangesAsync(ct);

        var practitionerName = appointment.Practitioner?.FullName
            ?? appointment.Session?.Practitioner?.FullName;

        return new AppointmentDto(
            appointment.Id, appointment.AppointmentDate,
            appointment.FromTime.ToString(@"hh\:mm"), appointment.ToTime.ToString(@"hh\:mm"),
            appointment.PatientName, appointment.ContactNo, appointment.Email, appointment.Notes,
            appointment.TokenNo, appointment.Status, appointment.Status.ToString(),
            appointment.CancellationReason, appointment.SessionId, appointment.PractitionerId,
            practitionerName, appointment.ParentAppointmentId,
            appointment.IsFollowUpNeeded, appointment.CreatedAt, appointment.UpdatedAt
        );
    }
}
