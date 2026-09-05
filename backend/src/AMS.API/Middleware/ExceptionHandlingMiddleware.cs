using AMS.Application.Common.Exceptions;
using System.Net;
using System.Text.Json;

namespace AMS.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try { await _next(context); }
        catch (Exception ex) { await HandleAsync(context, ex); }
    }

    private async Task HandleAsync(HttpContext context, Exception exception)
    {
        var (status, title, errors) = exception switch
        {
            NotFoundException ex => (HttpStatusCode.NotFound, ex.Message, (object?)null),
            ValidationException ex => (HttpStatusCode.BadRequest, "Validation failed.", ex.Errors),
            ConflictException ex => (HttpStatusCode.Conflict, ex.Message, (object?)null),
            BusinessRuleException ex => (HttpStatusCode.UnprocessableEntity, ex.Message, (object?)null),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.", (object?)null)
        };

        if (status == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled: {Message}", exception.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        await context.Response.WriteAsync(JsonSerializer.Serialize(
            new { status = (int)status, title, errors },
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
