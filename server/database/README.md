# Database Scripts

Versioned SQL files:

- `sql/V1__schema.sql` – schema creation
- `sql/V2__seed_demo_data.sql` – reproducible demo data
- `sql/V3__roles.sql` – application roles and permissions

Recommended execution order:

1. `V1__schema.sql`
2. `V2__seed_demo_data.sql`
3. `V3__roles.sql`

The backend ORM models are aligned with this schema, but the SQL files are the canonical deliverables for diploma database review.
