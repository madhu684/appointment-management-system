using AMS.Application.DTOs;
using MediatR;

namespace AMS.Application.Features.Appointments.Commands.CreateAppointment;

public record CreateAppointmentCommand(
    DateTime AppointmentDate,
    string FromTime,
    string ToTime,
    string PatientName,
    string ContactNo,
    string? Email,
    string? Notes,
    int? SessionId,
    int? PractitionerId,
    int? ParentAppointmentId,
    bool IsFollowUpNeeded
) : IRequest<AppointmentDto>;
