<!-- prev: ../03-user-guide/faq.md | next: ../appendices/index.md -->

# 4. Retrospective

## What Went Well

### Technical Successes

- The project reached a working full-stack state with frontend, backend, database, cloud deployment, and containerization.
- Public/private form access was implemented with a clear model and later improved with an explicit unpublish action.
- The response model was extended to support answer options and automatic correct/incorrect checking.
- Real-time analytics was implemented with real events and SSE rather than simulated updates.
- Backend tests cover important business logic and guard against regressions in access control and analytics.

### Process Successes

- The scope remained centered on a usable form management platform.
- Feedback from mentors was incorporated into the product: CORS tightening, rate limiting, schema/model alignment, and public form flow fixes.
- Deployment was handled early enough to expose real cloud issues, especially CORS and database migration handling.

## What Did Not Go As Planned

| Planned | Actual Outcome | Cause | Impact |
|---------|----------------|-------|--------|
| Simple public form flow | Public questions were initially shown incorrectly and mixed across templates. | UI flow was built around questions instead of templates. | Medium; fixed by changing guest flow to template-first. |
| Smooth database update | Railway migration needed manual execution and SQL syntax adjustment. | MySQL version did not support the initial `ADD COLUMN IF NOT EXISTS` syntax. | Medium; fixed with compatible migration script. |
| Open CORS during development | Mentor feedback required production CORS restrictions. | Early setup optimized for quick testing. | Low; fixed with configurable origins. |
| Basic form builder | Later needed answer options and scoring. | Product requirements evolved. | Medium; implemented with schema and UI updates. |

## Technical Debt and Known Issues

| ID | Issue | Severity | Potential Fix |
|----|-------|----------|---------------|
| TD-001 | No full migration runner with migration history table. | Medium | Add Flyway, Liquibase, Umzug, or Sequelize CLI. |
| TD-002 | Real-time analytics state is in memory. | Medium | Store events in Redis or a time-series database. |
| TD-003 | No full browser E2E suite. | Medium | Add Playwright tests for login, form creation, guest submit, and analytics. |
| TD-004 | Accessibility has not been formally audited. | Low | Run WCAG checks and improve keyboard/screen-reader support. |

## Future Improvements

### High Priority

1. Add a proper migration runner and migration history table.
2. Add Playwright end-to-end tests for the critical user flows.
3. Improve form analytics with exports and deeper filtering.

### Medium Priority

1. Add prompt-based response summarization for form authors.
2. Add organization/team workspaces.
3. Add better audit logs for administrative actions.

### Nice to Have

- File upload fields.
- Email notifications.
- Public share links with expiration.
- More advanced chart visualizations.

## Lessons Learned

| Lesson | Context | Future Application |
|--------|---------|--------------------|
| Database schema and ORM models must evolve together. | Mentor noticed schema/model mismatch. | Treat schema changes as first-class tasks. |
| Public flows need separate threat modeling. | Correct answers must not be exposed to guests. | Check public API payloads carefully. |
| Cloud deployment reveals real issues. | CORS and Railway migration behavior appeared only in production-like setup. | Deploy earlier in future projects. |
| Tests protect refactoring. | Analytics changes initially reduced coverage. | Add tests with every shared service change. |

## Personal Growth

| Skill | Before Project | After Project |
|-------|----------------|---------------|
| Full-stack architecture | Intermediate | Stronger practical understanding. |
| Cloud deployment | Beginner/intermediate | Able to deploy and debug Railway/Vercel setup. |
| Database design | Intermediate | More confident with schema evolution and constraints. |
| Testing | Intermediate | Better understanding of coverage and regression protection. |

## Final Assessment

Formics meets the core goal of the diploma project: it is a working, deployable, documented web application with real users, forms, responses, database persistence, analytics, and quality controls. The project is not a maximum-level enterprise system, but it is a coherent MVP with clear extension paths and an honest understanding of remaining limitations.

Retrospective completed: May 2026
