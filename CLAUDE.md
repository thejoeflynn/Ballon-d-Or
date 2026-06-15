# Cowork Prompt 1 — Project Plan & 3-Way Work Split

> Attach the project README to the Cowork session before sending this prompt so Claude can read it directly.

---

You're helping a 3-person student team plan and build the "World Cup Tracker" capstone described in the attached README. I want a concrete plan that splits the work as equally as possible across three developers (call us Dev A, B, C).

## Important changes from the README

- We're using React for the frontend instead of Thymeleaf. This means the Spring Boot app becomes a REST API backend, and React is a separate single-page app that consumes it. Please update the architecture and project structure to reflect this, but keep everything else as close to the README as you can: Java 21, Spring Boot, Maven, PostgreSQL, Spring Data JPA/Hibernate, the data model (Team, Match, Venue, MatchEvent, Commentary), the three integrations (sports data API, maps, Claude commentary), and the AI commentary design (tactical/stylistic only, non-predictive, cached per `match_id`).

## What I want from you

1. A short revised architecture overview reflecting the React/REST split.
2. The shared contracts **first**, so the three of us can work in parallel without blocking each other:
   - The JPA entities and DB schema
   - The REST API surface (endpoints, methods, request/response JSON shapes)
   - Config/env setup (`application.properties` keys, API keys, `.env` for React)
3. A 3-way work split using **vertical slices** where possible, so each person owns a feature end-to-end (entity → repo → service → controller → React pages). Balance effort honestly: some features are bigger than others, so pair the lighter feature areas with shared/infrastructure/design-system work to even things out. For each developer give:
   - The feature(s) and files/modules they own
   - Their concrete task list
   - Their deliverables
   - A rough effort estimate so I can sanity-check the balance
4. A "shared foundation" phase we build together first (repo setup, schema, API contract, React app shell, auth-less routing, shared styling) before splitting off.
5. A dependency + sequencing map: what must exist before each person can start their slice, and where integration points are.
6. Risks and gotchas, especially around the three integrations, shared code ownership, and merge conflicts.

## Constraints

- Stick closely to the README's data model and AI commentary design. The commentary must never predict a winner; it's cached in the DB.
- Scope to the core features. Treat the README's stretch goals as out of scope unless we have spare time.
- Keep it realistic for students working in parallel.

Before producing the full plan, list any assumptions you're making, and ask me up to 3 clarifying questions if they'd materially change the split.

**Deliverable:** output the plan as a markdown file (`PLAN.md`) I can commit to the repo, plus a one-paragraph summary of how the work splits three ways.
