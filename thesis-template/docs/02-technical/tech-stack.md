<!-- prev: index.md | next: criteria/backend.md -->

# Tech Stack

## Technology Overview

| Layer | Technology | Version / Mode | Justification |
|-------|------------|----------------|---------------|
| Frontend | React | 19 | Component-based SPA architecture, strong ecosystem. |
| Frontend language | TypeScript | 5.x | Safer API models and refactoring. |
| Bundler | Vite | 6.x | Fast development and production builds. |
| Routing | React Router | 7.x | Client-side route protection and nested flows. |
| State | Redux Toolkit | 2.x | Shared session and UI notification state. |
| HTTP client | Axios | 1.x | Centralized base URL, interceptors, JWT handling. |
| Backend runtime | Node.js | 20 | Modern JavaScript runtime for API service. |
| Backend framework | Express | 5.x | Simple REST API implementation with middleware. |
| ORM | Sequelize | 6.x | Object-relational access to MySQL and SQLite. |
| Database | MySQL | 9.4 on Railway | Managed relational OLTP database. |
| Local database | SQLite | Development/testing | Lightweight local mode and automated tests. |
| Testing | Vitest, Supertest, Testing Library | Current project versions | Unit, integration, and API behavior testing. |
| Deployment | Railway, Vercel | Cloud | Backend/database and frontend public hosting. |
| Containerization | Docker, Docker Compose | Local and production image | Reproducible service startup. |

## Decision: React and Vite

React was selected because the product requires many reusable UI units: auth forms, template cards, question renderers, response lists, analytics panels, and layout components. Vite was selected because it provides a simple and fast build pipeline for a TypeScript SPA without unnecessary configuration overhead.

## Decision: Express and Sequelize

Express was selected because the backend is a REST API with clear middleware needs: authentication, authorization, validation, error handling, CORS, rate limiting, and logging. Sequelize was selected because the domain is relational: users own templates, templates contain questions, responses belong to templates and users, and answers belong to responses and questions.

## Decision: MySQL

MySQL is used as the production database because the project is OLTP-oriented. The system performs transactional create/read/update/delete operations and requires foreign keys, constraints, and indexes. SQLite is only used as a local/test mode.

## Development Tools

| Tool | Purpose |
|------|---------|
| Git and GitHub | Source control and deployment source. |
| ESLint | Frontend static analysis. |
| TypeScript compiler | Type checking for frontend and backend. |
| Vitest coverage | Coverage reporting for backend and frontend tests. |
| Docker Compose | Local full-stack startup. |
| Railway logs | Runtime backend and database diagnostics. |

## External Services

| Service | Purpose | Cost Model |
|---------|---------|------------|
| Railway | Backend hosting and managed MySQL. | Free/trial tier during diploma evaluation. |
| Vercel | Frontend hosting and automatic deployments. | Free tier. |
| GitHub | Repository and deployment source. | Free tier. |
