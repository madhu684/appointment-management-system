using MediatR;

namespace AMS.Application.Features.Appointments.Commands.CancelAppointment;

public record CancelAppointmentCommand(int Id, string Reason) : IRequest<bool>;
