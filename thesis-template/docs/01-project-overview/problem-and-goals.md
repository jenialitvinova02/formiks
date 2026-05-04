<!-- prev: index.md | next: stakeholders.md -->

# Problem Statement and Goals

## Problem Statement

Small teams often need to collect structured information but do not have a controlled internal tool for the full lifecycle of a form. A simple public form service can collect responses, but it does not always match internal requirements such as role separation, private templates, owner-controlled response management, automatic checking of correct answers, or deployment under the team's own cloud setup.

The main pain points are:

- Form templates and answers are frequently stored in different places.
- Access rules are unclear when a form should be private.
- Response review requires manual checking.
- Authors cannot easily see analytics for their own forms.
- Administrators need a way to manage users and roles.
- A diploma project must demonstrate real backend, database, frontend, cloud, and containerization practices.

## Product Goals

| Goal | Description | Measurement |
|------|-------------|-------------|
| Centralize form lifecycle | Provide one system for creating, publishing, filling, and reviewing forms. | A user can complete the flow from template creation to response review. |
| Control access | Support user sessions, roles, public/private forms, and public access cancellation. | Private forms are not accessible to guests; public access can be disabled. |
| Reduce manual checking | Allow form authors to define correct answers. | Responses can be marked correct or incorrect automatically. |
| Provide analytics | Show form response statistics and live system activity. | Analytics pages update from real stored responses and real events. |
| Be deployable | Run in cloud and locally with documented setup. | Production URLs are reachable; Docker Compose works locally. |

## Business KPIs

| KPI | Target for Diploma Version |
|-----|----------------------------|
| Template creation flow | Works for authenticated users. |
| Public form flow | Works for unauthenticated guests when enabled. |
| Private form protection | Guests cannot access private templates. |
| Response analytics | Shows total responses, answer counts, option counts, and scoring results. |
| Test coverage | Backend business logic coverage stays above configured thresholds. |
| Deployment | Frontend, backend, and database are available in cloud environment. |

## Success Criteria

- The application supports registration, login, and role-aware navigation.
- A user can create a form with multiple question types, including choice-based questions.
- The owner can edit, delete, publish, and unpublish forms.
- Guests can fill public forms without seeing private templates or correct answers.
- The owner can review responses and form-level analytics.
- The backend stores data in a relational database and exposes a real REST API.
- The system is deployed and accessible through public cloud URLs.

## Non-Goals

- Full enterprise survey workflow with approval chains is outside the MVP.
- Paid integrations and external identity providers are not included.
- Advanced AI prompt-based analytics is treated as a future improvement.
- Multi-tenant billing, subscription plans, and organization management are outside the diploma scope.
