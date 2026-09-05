using AMS.Application.DTOs;
using AMS.Domain.Enums;
using MediatR;

namespace AMS.Application.Features.Appointments.Commands.UpdateAppointment;

public record UpdateAppointmentCommand(
    int Id,
    AppointmentStatus Status,
    string? Notes,
    bool IsFollowUpNeeded
) : IRequest<AppointmentDto>;
