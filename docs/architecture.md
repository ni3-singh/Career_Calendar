# Architecture

## Shape

Career Calendar uses a small, explicit two-service architecture:

- **Web:** Next.js App Router, React, TypeScript, and plain CSS design tokens. Server rendering provides a fast first view; client components are limited to interactions that need browser state.
- **API:** FastAPI, Pydantic, and SQLAlchemy 2. The service owns validation, authorization, prioritization, and persistence.
- **Data:** PostgreSQL in production. SQLite is supported for local development and isolated tests.

This separation keeps the API reusable for future native clients without adding microservice overhead.

## Security boundaries

Passwords are hashed with bcrypt and never returned. Short-lived bearer tokens contain only a user identifier and expiry. Every repository query for user-owned data includes the authenticated user's id, preventing insecure direct object references. CORS origins and secrets are environment configuration.

## Priority engine

Priority is deterministic and explainable. It combines importance, goal alignment, deadline proximity, task age, and health impact. Capacity is applied at planning time rather than making every task's inherent priority fluctuate. The API returns both a score and human-readable reasons.

## Evolution

Background reminders can move to a worker when volume requires it. Calendar providers, analytics, and AI recommendations should integrate behind service interfaces rather than entering route handlers.
