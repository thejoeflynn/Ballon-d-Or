# Contributing / Running Locally

World Cup Tracker is two apps: a Spring Boot REST API (`backend/`) and a React SPA
(`frontend/`). This is the architecture skeleton from `PLAN.md` §1 — entities,
endpoints, and features are added in later phases.

## Prerequisites

- Java 21 (JDK)
- Maven 3.9+
- Node 18+ and npm
- PostgreSQL 15+ (only needed once §2 introduces the database)

## Backend (Spring Boot, port 8080)

```bash
cd backend
mvn spring-boot:run
```

`application.properties` ships with safe, non-secret defaults, so the skeleton runs
as-is. `application.example.properties` documents the full key set (DB + API keys)
introduced in §2; when you add those, put real secrets in a gitignored
`application-local.properties` (or environment variables) — never in a committed file.

Verify it's up:

```bash
curl http://localhost:8080/api/health
# {"status":"ok","service":"world-cup-tracker"}
```

Notes:
- The skeleton is web-only and boots without PostgreSQL. JPA + datasource are
  added with the entities in §2.
- CORS allows the React dev origin via `app.cors.allowed-origin` (default
  `http://localhost:5173`).
- Never commit real secrets. `application.properties` holds only non-secret defaults;
  real secrets belong in a gitignored `application-local.properties` (added in §2).

## Frontend (React + Vite, port 5173)

```bash
cd frontend
cp .env.example .env.local   # then fill in values
npm install
npm run dev
```

Open http://localhost:5173. The Home page pings `/api/health` to confirm the
frontend can reach the backend.

Build a production bundle:

```bash
npm run build
```

## Project structure

```
backend/    Spring Boot REST API (Java 21, Maven)
frontend/   React SPA (Vite)
assets/     Flags (real) and crests (placeholder) — see assets/crests/CRESTS.md
PLAN.md     Plan, contracts, and 3-way work split
```

## Branching

Work for this build lives on the `Joe` branch. Keep `main` clean unless agreed otherwise.
