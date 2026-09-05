using AMS.Application.DTOs;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Sessions.Queries.GetSessions;

public record GetSessionsByDateRangeQuery(DateTime StartDate, DateTime EndDate)
    : IRequest<IEnumerable<SessionDto>>;

public class GetSessionsByDateRangeHandler
    : IRequestHandler<GetSessionsByDateRangeQuery, IEnumerable<SessionDto>>
{
    private readonly ISessionRepository _repo;

    public GetSessionsByDateRangeHandler(ISessionRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<SessionDto>> Handle(
        GetSessionsByDateRangeQuery request, CancellationToken ct)
    {
        var sessions = await _repo.GetByDateRangeAsync(request.StartDate, request.EndDate, ct);

        return sessions.Select(s => new SessionDto(
            s.Id, s.PractitionerId,
            s.Practitioner?.FullName ?? string.Empty,
            s.SessionDate,
            s.StartTime.ToString(@"hh\:mm"),
            s.EndTime.ToString(@"hh\:mm"),
            s.MaxPatients, s.BookedCount,
            s.MaxPatients - s.BookedCount,
            s.Status, s.Status.ToString(), s.Remarks
        ));
    }
}
