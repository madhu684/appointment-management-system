using AMS.Application.Common.Exceptions;
using AMS.Application.DTOs;
using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Appointments.Commands.CreateAppointment;

public class CreateAppointmentHandler : IRequestHandler<CreateAppointmentCommand, AppointmentDto>
{
    private readonly IAppointmentRepository _appointmentRepo;
    private readonly ISessionRepository _sessionRepo;
    private readonly IPractitionerRepository _practitionerRepo;

    public CreateAppointmentHandler(
        IAppointmentRepository appointmentRepo,
        ISessionRepository sessionRepo,
        IPractitionerRepository practitionerRepo)
    {
        _appointmentRepo = appointmentRepo;
        _sessionRepo = sessionRepo;
        _practitionerRepo = practitionerRepo;
    }

    public async Task<AppointmentDto> Handle(CreateAppointmentCommand request, CancellationToken ct)
    {
        Session? session = null;
        Practitioner? practitioner = null;

        if (request.SessionId.HasValue)
        {
            session = await _sessionRepo.GetByIdWithDetailsAsync(request.SessionId.Value, ct)
                ?? throw new NotFoundException(nameof(Session), request.SessionId.Value);

            if (!session.HasAvailableSlots)
                throw new BusinessRuleException($"Session on {session.SessionDate:dd MMM yyyy} is fully booked ({session.MaxPatients}/{session.MaxPatients} patients).");
        }

        if (request.PractitionerId.HasValue)
        {
            practitioner = await _practitionerRepo.GetByIdAsync(request.PractitionerId.Value, ct)
                ?? throw new NotFoundException(nameof(Practitioner), request.PractitionerId.Value);
        }

        var tokenNo = await _appointmentRepo.GetNextTokenNoAsync(request.AppointmentDate, ct);

        var appointment = new Appointment
        {
            AppointmentDate = request.AppointmentDate.Date,
            FromTime = TimeSpan.Parse(request.FromTime),
            ToTime = TimeSpan.Parse(request.ToTime),
            PatientName = request.PatientName,
            ContactNo = request.ContactNo,
            Email = request.Email,
            Notes = request.Notes,
            TokenNo = tokenNo,
            SessionId = request.SessionId,
            PractitionerId = request.PractitionerId ?? session?.PractitionerId,
            ParentAppointmentId = request.ParentAppointmentId,
            IsFollowUpNeeded = request.IsFollowUpNeeded
        };

        await _appointmentRepo.AddAsync(appointment, ct);
        await _appointmentRepo.SaveChangesAsync(ct);

        practitioner ??= session?.Practitioner;

        return MapToDto(appointment, practitioner?.FullName);
    }

    private static AppointmentDto MapToDto(Appointment a, string? practitionerName) => new(
        a.Id, a.AppointmentDate,
        a.FromTime.ToString(@"hh\:mm"), a.ToTime.ToString(@"hh\:mm"),
        a.PatientName, a.ContactNo, a.Email, a.Notes,
        a.TokenNo, a.Status, a.Status.ToString(),
        a.CancellationReason, a.SessionId, a.PractitionerId,
        practitionerName, a.ParentAppointmentId,
        a.IsFollowUpNeeded, a.CreatedAt, a.UpdatedAt
    );
}
