<!-- prev: containerization.md | next: ../deployment.md -->

# Criterion: Testing and API Quality

## Architecture Decision Record

**Status:** Accepted  
**Date:** May 2026

### Context

Because the application includes access control, form lifecycle operations, response storage, and analytics, manual testing alone is not enough. The API must be documented and business logic must be covered by automated tests.

### Decision

The project uses Vitest for unit tests and coverage, Supertest for backend endpoint behavior, and Testing Library for frontend component/integration behavior. API behavior is documented in `server/API.md` and summarized in the appendices.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Manual testing only | Fast initially. | High regression risk. | Automated tests are required. |
| Cypress/Playwright full E2E | Strong browser confidence. | More setup time. | Testing Library is sufficient for MVP integration checks. |
| Swagger only | Interactive docs. | Requires extra setup. | Text API documentation is acceptable for this project. |

## Test Scope

| Area | Covered Behavior |
|------|------------------|
| Auth | Registration, duplicate registration, login, JWT verification. |
| Access control | Owner/admin access, private/public template rules. |
| Responses | Response creation, guest public responses, rejection of invalid questions. |
| Analytics | Live analytics aggregation and form response analytics. |
| Frontend | Auth form validation, protected route behavior, interceptors, template search/filtering. |

## API Quality

The backend follows REST-style endpoints, uses JSON request and response bodies, applies validation, returns meaningful HTTP status codes, and avoids static fake data. Sensitive endpoints require JWT authentication.

## Requirements Checklist

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Unit tests | Implemented | Backend service tests and frontend tests. |
| Integration behavior tests | Implemented | Supertest and Testing Library checks. |
| Coverage tooling | Implemented | Vitest coverage. |
| API documentation | Implemented | `server/API.md` and appendix. |
| Error handling | Implemented | Central backend error middleware and frontend alerts. |
| Real API | Implemented | API works with database, not static JSON. |

## Known Limitations

The project does not include full browser E2E testing with Playwright or Cypress. This is a valuable future improvement, especially for public form submission and admin flows.
