# Formics Backend API

## Base URL

`/api`

## Authentication

Protected routes require `Authorization: Bearer <jwt>`.

## Endpoints

### Auth

- `POST /auth/register`
  - body: `{ "username": "string", "email": "user@example.com", "password": "string" }`
  - response `201`: safe user object without password
- `POST /auth/login`
  - body: `{ "email": "user@example.com", "password": "string" }`
  - response `200`: `{ "token": "jwt", "user": { ... } }`

### Users

- `GET /users/me`
- `PUT /users/me`
  - body: `{ "username": "string", "email": "user@example.com" }`
- `GET /users`
  - admin only
- `PUT /users/:id`
  - admin only
  - body: `{ "role": "user" | "admin" }`
- `DELETE /users/:id`
  - admin only

### Templates

- `GET /templates`
- `GET /templates/:id`
- `POST /templates`
- `PUT /templates/:id`
- `DELETE /templates/:id`

Template payload:

```json
{
  "title": "Customer Survey",
  "description": "Collect satisfaction feedback",
  "topic": "feedback",
  "tags": "customer,survey",
  "image": "https://example.com/image.png",
  "isPublic": true,
  "questions": [
    {
      "title": "Your name",
      "description": "Short text",
      "type": "text",
      "order": 0,
      "showInTable": true
    }
  ]
}
```

### Questions

- `GET /questions/template/:templateId`
  - authenticated; public templates allowed
- `POST /questions`
- `PUT /questions/:id`
- `DELETE /questions/:id`

### Responses

- `GET /responses`
  - admin only
- `GET /responses/user`
- `GET /responses/:id`
- `POST /responses/from-template/:templateId`
  - body: `{ "answers": { "1": "value", "2": true } }`
- `GET /responses/template/:templateId`
  - owner/admin only
- `DELETE /responses/:id`

### Answers

- `GET /answers/response/:responseId`
- `GET /answers/:id`
- `POST /answers`
- `PUT /answers/:id`
- `DELETE /answers/:id`

### Realtime Analytics

- `GET /analytics/realtime/snapshot`
  - authenticated
  - returns the current aggregated live analytics state
- `GET /analytics/realtime/stream?token=<jwt>`
  - SSE stream
  - authenticated via JWT query parameter because `EventSource` does not send custom auth headers
  - emits `analytics:update` events with the full current snapshot

Snapshot example:

```json
{
  "generatedAt": "2026-03-30T20:00:00.000Z",
  "acceptableDelaySeconds": 5,
  "windowMinutes": 60,
  "totals": {
    "responsesLastFiveMinutes": 3,
    "responsesLastHour": 12,
    "templatesCreatedLastHour": 1,
    "templatesUpdatedLastHour": 2,
    "activeUsersLastFiveMinutes": 3
  },
  "recentEvents": [
    {
      "id": "1711828800000-ab12cd",
      "type": "response_submitted",
      "userId": 2,
      "templateId": 4,
      "templateTitle": "Local Feedback Form",
      "answersCount": 5,
      "occurredAt": "2026-03-30T20:00:00.000Z"
    }
  ],
  "minuteSeries": [
    {
      "minute": "2026-03-30T19:59:00.000Z",
      "responses": 1,
      "templates": 0
    }
  ],
  "topTemplates": [
    {
      "templateId": 4,
      "label": "Local Feedback Form",
      "responseCount": 6
    }
  ]
}
```

## Error format

```json
{
  "error": "Validation failed",
  "details": []
}
```
