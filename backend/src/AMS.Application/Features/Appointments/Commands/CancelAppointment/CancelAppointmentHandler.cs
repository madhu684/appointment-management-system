using AMS.Application.Common.Exceptions;
using AMS.Domain.Entities;
using AMS.Domain.Enums;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Appointments.Commands.CancelAppointment;

public class CancelAppointmentHandler : IRequestHandler<CancelAppointmentCommand, bool>
{
    private readonly IAppointmentRepository _appointmentRepo;

    public CancelAppointmentHandler(IAppointmentRepository appointmentRepo)
    {
        _appointmentRepo = appointmentRepo;
    }

    public async Task<bool> Handle(CancelAppointmentCommand request, CancellationToken ct)
    {
        var appointment = await _appointmentRepo.GetByIdAsync(request.Id, ct)
            ?? throw new NotFoundException(nameof(Appointment), request.Id);

        if (appointment.Status == AppointmentStatus.Completed)
            throw new BusinessRuleException("A completed appointment cannot be cancelled.");

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CancellationReason = request.Reason;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _appointmentRepo.UpdateAsync(appointment, ct);
        await _appointmentRepo.SaveChangesAsync(ct);

        return true;
    }
}
