<!-- prev: cloud.md | next: testing-api-quality.md -->

# Criterion: Containerization

## Architecture Decision Record

**Status:** Accepted  
**Date:** May 2026

### Context

The project must be reproducible on machines with Docker. Frontend, backend, and database should be started together without manual dependency setup.

### Decision

Formics uses separate Dockerfiles for frontend and backend and `docker-compose.yml` for local full-stack startup. MySQL uses an official versioned image. The compose file defines networks, volumes, healthchecks, dependencies, environment variables, and restart policies.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Manual local setup | Simple for developer. | Harder for reviewers to reproduce. | Docker Compose is clearer. |
| One container for all services | Fewer files. | Anti-pattern, weak isolation. | Separate service containers are better. |
| Kubernetes | Production-grade orchestration. | Too complex for MVP. | Docker Compose is sufficient. |

## Container Architecture

```mermaid
flowchart LR
  Browser --> Frontend["frontend container / nginx"]
  Frontend --> Backend["backend container / Node.js"]
  Backend --> MySQL["mysql:8.4.6"]
  MySQL --> Volume["mysql_data volume"]
```

## Image Design

| Image | Purpose | Notes |
|-------|---------|-------|
| `formics-frontend` | Serves built React SPA through nginx. | Multi-stage build, unprivileged nginx image. |
| `formics-backend` | Runs Express API. | Multi-stage build, non-root user. |
| `mysql:8.4.6` | Stores data locally. | Official versioned image with init scripts. |

## Requirements Checklist

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Separate Dockerfiles | Implemented | `client/Dockerfile`, `server/Dockerfile`. |
| Docker Compose | Implemented | `docker-compose.yml`. |
| Environment variables | Implemented | `.env.example` and compose variables. |
| Volumes | Implemented | `mysql_data`, `server_data`. |
| Ports | Implemented | Frontend, backend, and MySQL ports configured. |
| Healthchecks | Implemented | Frontend, backend, MySQL healthchecks. |
| Non-root runtime | Implemented | Backend user and unprivileged nginx. |
| Versioned images | Implemented | No production `latest` tag for MySQL. |

## Known Limitations

The compose setup does not include Docker secrets, Prometheus metrics, centralized logging, or separate dev/test/prod compose files. These are advanced improvements beyond the MVP.
