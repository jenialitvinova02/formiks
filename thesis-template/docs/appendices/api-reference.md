<!-- prev: glossary.md | next: db-schema.md -->

# API Reference

Base URL: `https://backend-production-ccc3.up.railway.app/api`

Authentication: `Authorization: Bearer <jwt>` for protected endpoints.

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create a new user account. |
| POST | `/auth/login` | Authenticate user and return JWT token. |

Example login request:

```json
{
  "email": "demo@local.test",
  "password": "password123"
}
```

## Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates` | List templates available to the authenticated user. |
| GET | `/templates/:id` | Load one template with questions. |
| POST | `/templates` | Create template with questions. |
| PUT | `/templates/:id` | Update template and its questions. |
| PATCH | `/templates/:id/public` | Enable or disable public access. |
| DELETE | `/templates/:id` | Delete template. |

## Public Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public/templates` | List public templates for guests. |
| GET | `/public/templates/:id` | Load one public template. |
| POST | `/public/templates/:id/responses` | Submit guest response. |

## Responses and Answers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/responses/from-template/:templateId` | Submit authenticated response. |
| GET | `/responses/template/:templateId` | List responses for template. |
| GET | `/responses/template/:templateId/analytics` | Get form response analytics. |
| GET | `/answers/response/:responseId` | Load answers for one response. |
| PUT | `/answers/:id` | Update one answer value. |
| DELETE | `/responses/:id` | Delete a response. |

## Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/realtime/snapshot` | Get current live analytics snapshot. |
| GET | `/analytics/realtime/stream?token=<jwt>` | Open SSE stream for live updates. |

## Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Invalid request body or parameters. |
| 401 | Missing or invalid authentication. |
| 403 | Authenticated user does not have access. |
| 404 | Requested resource does not exist or is not public. |
| 429 | Rate limit exceeded. |
| 500 | Unexpected server error. |
