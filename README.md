# Career Calendar

Career Calendar is a calm, mobile-first daily planning application that helps people decide what matters, begin it, and reflect without guilt.

## Stage 1 MVP

This repository contains a Next.js web application and FastAPI service. The first vertical slice includes a polished Today experience, an explainable priority engine, categories, goals and tasks, focus sessions, reminders, and daily/weekly reviews.

## Quick start

### API

```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(48))')"
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`; interactive OpenAPI documentation is at `/docs`.

### Web

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The Stage 1 interface is fully interactive: users can
add, complete, postpone, focus on, and delete tasks; manage goals; adjust capacity;
run a five-minute focus timer; and save a daily review. Browser data is persisted
to `localStorage`, so refreshing the page does not reset the plan. The FastAPI
service provides authenticated server persistence for the API workflow.

## Environment variables

| Variable | Service | Required | Purpose |
| --- | --- | --- | --- |
| `SECRET_KEY` | API | Yes | Signs access tokens; use a unique random value. |
| `DATABASE_URL` | API | Production only | PostgreSQL connection URL. Defaults to local SQLite when omitted. |
| `CORS_ORIGINS` | API | No | Comma-separated allowed web origins; defaults to `http://localhost:3000`. |
| `ACCESS_TOKEN_MINUTES` | API | No | Access-token lifetime; defaults to 30 minutes. |
| `NEXT_PUBLIC_API_URL` | Web | Yes | Browser-visible API base URL, normally `http://localhost:8000`. |

PostgreSQL is **not required for local development**. The API uses an ignored
SQLite database by default. PostgreSQL is required for the production deployment.

## Quality checks

```bash
cd api && make test
cd web && npm run lint && npm run build
```

`make test` creates an isolated `.venv`, installs the exact API dependencies,
and invokes pytest through that environment. After setup, the equivalent direct
command is `cd api && .venv/bin/python -m pytest`.

If a corporate or school proxy returns HTTP 403 while installing packages, that
is a network policy rather than a test failure. Run the same command in GitHub
Codespaces or configure pip with the approved package mirror; do not disable TLS
verification.

## Documentation

- [Architecture](docs/architecture.md)
- [Database schema](docs/database.md)
- [Deployment](docs/deployment.md)
- [Roadmap](docs/roadmap.md)

## Product principles

- Recommendations explain themselves.
- Planning respects capacity rather than rewarding overload.
- Language is supportive and recovery-oriented.
- Every primary action is keyboard accessible and at least 44px tall.
- User-owned records are always scoped by the authenticated user on the server.
