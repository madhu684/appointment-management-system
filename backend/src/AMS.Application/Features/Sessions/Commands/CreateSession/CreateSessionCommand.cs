using AMS.Application.Common.Exceptions;
using AMS.Application.DTOs;
using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Sessions.Commands.CreateSession;

public record CreateSessionCommand(
    int PractitionerId,
    DateTime SessionDate,
    string StartTime,
    string EndTime,
    int MaxPatients,
    string? Remarks
) : IRequest<SessionDto>;

public class CreateSessionHandler : IRequestHandler<CreateSessionCommand, SessionDto>
{
    private readonly ISessionRepository _sessionRepo;
    private readonly IPractitionerRepository _practitionerRepo;

    public CreateSessionHandler(ISessionRepository sessionRepo, IPractitionerRepository practitionerRepo)
    {
        _sessionRepo = sessionRepo;
        _practitionerRepo = practitionerRepo;
    }

    public async Task<SessionDto> Handle(CreateSessionCommand request, CancellationToken ct)
    {
        var practitioner = await _practitionerRepo.GetByIdAsync(request.PractitionerId, ct)
            ?? throw new NotFoundException(nameof(Practitioner), request.PractitionerId);

        var session = new Session
        {
            PractitionerId = request.PractitionerId,
            SessionDate = request.SessionDate.Date,
            StartTime = TimeSpan.Parse(request.StartTime),
            EndTime = TimeSpan.Parse(request.EndTime),
            MaxPatients = request.MaxPatients,
            Remarks = request.Remarks
        };

        await _sessionRepo.AddAsync(session, ct);
        await _sessionRepo.SaveChangesAsync(ct);

        return new SessionDto(
            session.Id, session.PractitionerId, practitioner.FullName,
            session.SessionDate,
            session.StartTime.ToString(@"hh\:mm"),
            session.EndTime.ToString(@"hh\:mm"),
            session.MaxPatients, 0, session.MaxPatients,
            session.Status, session.Status.ToString(), session.Remarks
        );
    }
}
