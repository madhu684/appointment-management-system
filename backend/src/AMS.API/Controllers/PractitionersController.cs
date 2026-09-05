using AMS.Application.DTOs;
using AMS.Application.Features.Practitioners.Commands.CreatePractitioner;
using AMS.Application.Features.Practitioners.Queries.GetPractitioners;
using AMS.Application.Features.Sessions.Commands.CreateSession;
using AMS.Application.Features.Sessions.Queries.GetSessions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PractitionersController : ControllerBase
{
    private readonly IMediator _mediator;

    public PractitionersController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PractitionerDto>), 200)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetPractitionersQuery(), ct);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PractitionerDto), 201)]
    public async Task<IActionResult> Create(
        [FromBody] CreatePractitionerCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }
}

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SessionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SessionsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SessionDto>), 200)]
    public async Task<IActionResult> GetByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        CancellationToken ct)
    {
        if (startDate > endDate)
            return BadRequest("Start date must be before end date.");

        var result = await _mediator.Send(
            new GetSessionsByDateRangeQuery(startDate, endDate), ct);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(SessionDto), 201)]
    public async Task<IActionResult> Create(
        [FromBody] CreateSessionCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetByDateRange), new { id = result.Id }, result);
    }
}
