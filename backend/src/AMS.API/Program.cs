using AMS.API.Middleware;
using AMS.Application;
using AMS.Infrastructure;
using AMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(o =>
{
    o.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Appointment Management System API",
        Version = "v1",
        Description = """
            A production-ready Appointment Management REST API built with:
            - ASP.NET Core 8 — Clean Architecture
            - CQRS with MediatR
            - FluentValidation pipeline
            - Entity Framework Core + SQL Server
            - Repository pattern
            - Soft delete with global query filters
            - Business rule validation

            Based on real production work — AyuLanka Ayurvedic Spa AMS
            Built by Anuradha Madhushani — Senior .NET Core & Azure Engineer
            """
    });
});

builder.Services.AddCors(o =>
    o.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// Auto-create database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AMS API v1");
    c.RoutePrefix = string.Empty;
});

app.UseCors("AllowAll");
app.MapControllers();
app.Run();
