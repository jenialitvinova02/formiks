# Backend Deployment

## Environment variables

- `PORT`
- `JWT_SECRET`
- `DB_DIALECT`
- `SQLITE_STORAGE`
- `DB_URI` for MySQL deployments

## Local Docker build

```bash
cd server
docker build -t formics-server .
docker run --rm -p 3000:3000 \
  -e PORT=3000 \
  -e JWT_SECRET=change-me \
  -e DB_DIALECT=sqlite \
  -e SQLITE_STORAGE=/app/data/formics.sqlite \
  formics-server
```

## Recommended production path

1. Build the Docker image from the repository.
2. Push the image to a registry.
3. Inject `JWT_SECRET` and database settings via environment variables.
4. Run the container behind a reverse proxy or cloud load balancer.

This repository now includes:

- reproducible build via `npm run build`
- automated backend checks via GitHub Actions
- container packaging via `server/Dockerfile`
