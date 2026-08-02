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

Open `http://localhost:3000`. The dashboard currently uses representative local data while the authentication screens and API client are completed in the next vertical slice.

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
