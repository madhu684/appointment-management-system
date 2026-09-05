using AMS.Application.DTOs;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Practitioners.Queries.GetPractitioners;

public record GetPractitionersQuery : IRequest<IEnumerable<PractitionerDto>>;

public class GetPractitionersHandler : IRequestHandler<GetPractitionersQuery, IEnumerable<PractitionerDto>>
{
    private readonly IPractitionerRepository _repo;

    public GetPractitionersHandler(IPractitionerRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<PractitionerDto>> Handle(
        GetPractitionersQuery request, CancellationToken ct)
    {
        var practitioners = await _repo.GetAllActiveAsync(ct);
        return practitioners.Select(p => new PractitionerDto(
            p.Id, p.FullName, p.Specialization, p.ContactNo, p.Email, p.IsActive));
    }
}
