# Appointment Management System (AMS)

A full-stack **Appointment Management System** built with **ASP.NET Core 8** and **React TypeScript**, based on real production experience building an appointment system for an Ayurvedic wellness clinic.

---

## Features

**Appointment Management**
- Create, view, update and cancel appointments
- Token number auto-generation per day
- Date range filtering with status breakdown
- Follow-up appointment linking (self-referencing)
- Business rule validation — session capacity, status transitions

**Practitioner & Session Management**
- Practitioner profiles with specializations
- Session scheduling with real-time slot availability
- Capacity tracking with visual progress indicators

**Dashboard & Analytics**
- Daily appointment count chart (Recharts)
- Summary statistics — scheduled, completed, cancelled, no-show
- Date range filtering for all reports

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | ASP.NET Core 8 |
| Architecture | Clean Architecture (Domain → Application → Infrastructure → API) |
| CQRS | MediatR 12 |
| Validation | FluentValidation (pipeline behaviour) |
| ORM | Entity Framework Core 8 + SQL Server |
| Frontend framework | React 18 + TypeScript |
| Data fetching | TanStack Query (React Query) v5 |
| HTTP client | Axios |
| Charts | Recharts |
| UI | Bootstrap 5 + Bootstrap Icons |
| Bundler | Vite |
| Containerisation | Docker + docker-compose |

---

## Architecture

```
backend/
├── src/
│   ├── AMS.Domain/              # Entities, enums, repository interfaces
│   │   ├── Entities/            # Appointment, Practitioner, Session
│   │   ├── Enums/               # AppointmentStatus, SessionStatus
│   │   └── Interfaces/          # IAppointmentRepository, etc.
│   │
│   ├── AMS.Application/         # CQRS commands, queries, DTOs
│   │   ├── Features/
│   │   │   ├── Appointments/    # CreateAppointment, CancelAppointment, GetByDateRange
│   │   │   ├── Practitioners/   # CreatePractitioner, GetPractitioners
│   │   │   └── Sessions/        # CreateSession, GetSessionsByDateRange
│   │   ├── Common/
│   │   │   ├── Behaviours/      # ValidationBehaviour (MediatR pipeline)
│   │   │   └── Exceptions/      # NotFoundException, BusinessRuleException
│   │   └── DTOs/                # AppointmentDto, SessionDto, DashboardSummaryDto
│   │
│   ├── AMS.Infrastructure/      # EF Core, repositories, SQL Server
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   └── Configurations/  # EF entity configurations
│   │   └── Repositories/        # AppointmentRepository, etc.
│   │
│   └── AMS.API/                 # Controllers, middleware, Swagger
│       ├── Controllers/         # AppointmentsController, PractitionersController, SessionsController
│       └── Middleware/          # Global exception handling

frontend/
└── src/
    ├── api/                     # Axios client + API functions
    ├── hooks/                   # TanStack Query hooks
    ├── components/
    │   ├── dashboard/           # DashboardPage with Recharts
    │   ├── appointments/        # AppointmentsPage, CreateModal, DetailModal
    │   ├── practitioners/       # PractitionersPage
    │   ├── sessions/            # SessionsPage with slot tracking
    │   └── shared/              # StatusBadge, DateRangePicker, States
    └── types/                   # TypeScript interfaces
```

---

## Getting Started

### Run with Docker (recommended)

```bash
git clone https://github.com/yourusername/appointment-management-system.git
cd appointment-management-system
docker-compose up --build
```

- Frontend: **http://localhost:3000**
- API + Swagger: **http://localhost:5000**
- SQL Server: localhost:1434

### Run locally

**Backend**
```bash
cd backend
# Update connection string in src/AMS.API/appsettings.json
dotnet run --project src/AMS.API
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/appointments?startDate=&endDate=` | Get appointments by date range |
| GET | `/api/appointments/dashboard?startDate=&endDate=` | Dashboard summary + daily chart data |
| GET | `/api/appointments/{id}` | Get appointment with full details |
| POST | `/api/appointments` | Create appointment |
| PATCH | `/api/appointments/{id}` | Update status and notes |
| DELETE | `/api/appointments/{id}?reason=` | Cancel appointment |

### Practitioners
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/practitioners` | Get all active practitioners |
| POST | `/api/practitioners` | Create practitioner |

### Sessions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sessions?startDate=&endDate=` | Get sessions by date range |
| POST | `/api/sessions` | Create session |

---

## Key Design Decisions

**Business Rule Validation** — Session capacity is enforced in the application layer handler before any data is written. A fully-booked session returns a `422 Unprocessable Entity` with a clear message.

**Self-referencing Appointments** — Appointments can link to a parent appointment for follow-up tracking, using a self-referencing foreign key with `DeleteBehavior.NoAction` to prevent cascade conflicts.

**Token Auto-generation** — Each day's appointments get sequential token numbers (1, 2, 3...) automatically assigned at creation time, queried from the database to handle concurrent requests correctly.

**Soft Delete** — Appointments and practitioners are never physically deleted. EF Core global query filters ensure deleted records are invisible to all queries without any extra `WHERE` clauses in application code.

**TanStack Query** — All API calls use React Query with automatic caching, background refetching, and cache invalidation on mutations. No manual loading state management needed.

---

## Author

**Anuradha Madhushani**
Senior Full-Stack Software Engineer · 8+ years experience
ASP.NET Core · React TypeScript · Azure · Clean Architecture

📍 Schmalkalden, Germany
🎓 MSc Applied Computer Science — Hochschule Schmalkalden

[LinkedIn](https://linkedin.com/in/yourprofile) · [GitHub](https://github.com/yourusername)
