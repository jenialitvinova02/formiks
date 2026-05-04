<!-- prev: stakeholders.md | next: features.md -->

# Scope

## In Scope

| Feature | Description | Priority |
|---------|-------------|----------|
| Authentication | Register, login, JWT session handling, password hashing. | Must |
| Role management | User and admin roles with protected routes. | Must |
| Form templates | Create, edit, delete, list, publish, and unpublish templates. | Must |
| Dynamic questions | Text, multiline, numeric, checkbox, single choice, and multiple choice questions. | Must |
| Public forms | Guests can complete forms that are marked public. | Must |
| Private forms | Private templates are available only to permitted users. | Must |
| Response management | View, edit, and delete submitted responses. | Must |
| Automatic scoring | Correct answers can be configured and used for correct/incorrect checking. | Should |
| Form answer analytics | Counts, option distributions, and scoring summaries per form. | Should |
| Real-time analytics | Live system activity dashboard through SSE. | Should |
| Cloud and Docker deployment | Railway, Vercel, Docker Compose, environment variables. | Must |

## Out of Scope

| Item | Reason | Future Phase |
|------|--------|--------------|
| Organization billing | Not relevant to diploma MVP. | Possible commercial phase. |
| External SSO | Adds complexity without being necessary for project goals. | Future security extension. |
| File uploads | Requires additional storage and moderation rules. | Future feature. |
| Advanced AI analytics | Valuable but not necessary for MVP. | Future roadmap. |
| Native mobile applications | Responsive web UI is sufficient. | Future product expansion. |

## Assumptions

| Assumption | Impact if False | Risk |
|------------|-----------------|------|
| Users have access to a modern browser. | Some UI or SSE behavior may not work. | Low |
| Railway and Vercel remain available during evaluation. | Production demo may be interrupted. | Medium |
| The MySQL schema is updated before using new form features. | New question options and scoring cannot be stored. | Medium |
| Demo users and seed data are enough for review. | Additional manual data entry may be needed. | Low |

## Constraints

| Constraint | Description | Response |
|------------|-------------|----------|
| Time | Diploma work is implemented by one developer. | Scope is focused on MVP and selected criteria. |
| Budget | Paid services should be avoided. | Free tiers and open-source libraries are used. |
| Security | Secrets cannot be stored in repository. | Environment variables are used for deployment. |
| Maintainability | Code must be understandable for assessment. | Modular folders, tests, and documentation are maintained. |

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Railway | Cloud backend and managed MySQL | Active |
| Vercel | Frontend hosting | Active |
| MySQL | Production relational database | Active |
| Docker | Local full-stack deployment | Active |
| GitHub | Source control and deployment source | Active |
