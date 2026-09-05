using FluentValidation;

namespace AMS.Application.Features.Appointments.Commands.CreateAppointment;

public class CreateAppointmentValidator : AbstractValidator<CreateAppointmentCommand>
{
    public CreateAppointmentValidator()
    {
        RuleFor(x => x.PatientName)
            .NotEmpty().WithMessage("Patient name is required.")
            .MaximumLength(100);

        RuleFor(x => x.ContactNo)
            .NotEmpty().WithMessage("Contact number is required.")
            .MaximumLength(15);

        RuleFor(x => x.AppointmentDate)
            .NotEmpty().WithMessage("Appointment date is required.");

        RuleFor(x => x.FromTime)
            .NotEmpty().WithMessage("From time is required.")
            .Matches(@"^\d{2}:\d{2}$").WithMessage("From time must be in HH:mm format.");

        RuleFor(x => x.ToTime)
            .NotEmpty().WithMessage("To time is required.")
            .Matches(@"^\d{2}:\d{2}$").WithMessage("To time must be in HH:mm format.");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Invalid email address.")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x)
            .Must(x => x.SessionId.HasValue || x.PractitionerId.HasValue)
            .WithMessage("Either a session or a practitioner must be specified.");
    }
}
