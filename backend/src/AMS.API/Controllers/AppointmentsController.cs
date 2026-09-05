using AMS.Application.DTOs;
using AMS.Application.Features.Appointments.Commands.CancelAppointment;
using AMS.Application.Features.Appointments.Commands.CreateAppointment;
using AMS.Application.Features.Appointments.Commands.UpdateAppointment;
using AMS.Application.Features.Appointments.Queries.GetAppointmentById;
using AMS.Application.Features.Appointments.Queries.GetAppointmentsByDateRange;
using AMS.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AppointmentsController(IMediator mediator) { _mediator = mediator; }

    /// <summary>Get appointments by date range</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AppointmentSummaryDto>), 200)]
    public async Task<IActionResult> GetByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        CancellationToken ct)
    {
        if (startDate > endDate)
            return BadRequest("Start date must be before end date.");

        var result = await _mediator.Send(
            new GetAppointmentsByDateRangeQuery(startDate, endDate), ct);
        return Ok(result);
    }

    /// <summary>Get dashboard summary with daily counts chart data</summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(DashboardSummaryDto), 200)]
    public async Task<IActionResult> GetDashboard(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        CancellationToken ct)
    {
        if (startDate > endDate)
            return BadRequest("Start date must be before end date.");

        var result = await _mediator.Send(new GetDashboardSummaryQuery(startDate, endDate), ct);
        return Ok(result);
    }

    /// <summary>Get a single appointment with full details</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(AppointmentDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetAppointmentByIdQuery(id), ct);
        return Ok(result);
    }

    /// <summary>Create a new appointment</summary>
    [HttpPost]
    [ProducesResponseType(typeof(AppointmentDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create(
        [FromBody] CreateAppointmentCommand command,
        CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Update appointment status and notes</summary>
    [HttpPatch("{id:int}")]
    [ProducesResponseType(typeof(AppointmentDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateAppointmentRequest request,
        CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateAppointmentCommand(id, request.Status, request.Notes, request.IsFollowUpNeeded), ct);
        return Ok(result);
    }

    /// <summary>Cancel an appointment</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Cancel(
        int id,
        [FromQuery] string reason,
        CancellationToken ct)
    {
        await _mediator.Send(new CancelAppointmentCommand(id, reason), ct);
        return NoContent();
    }
}

public record UpdateAppointmentRequest(
    AppointmentStatus Status,
    string? Notes,
    bool IsFollowUpNeeded
);
