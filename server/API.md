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

## Error format

```json
{
  "error": "Validation failed",
  "details": []
}
```
