# Cowork Prompt 2 — Scaffold the Repo & API Contract

> Use this **after** Prompt 1 has produced `PLAN.md`. Keep `PLAN.md` (and the README) attached or in the same Cowork session so Claude builds against the agreed plan.

---

Using the `PLAN.md` we just produced (and the original README) as the source of truth, scaffold the shared foundation for the "World Cup Tracker" project so all three of us can start our vertical slices without blocking each other.

## Build the skeleton, not the features

Set up structure, contracts, and config — leave the actual feature logic as clearly marked stubs/TODOs so each developer can fill in their own slice. Don't implement match logic, venue logic, or commentary generation yet.

## Backend (Spring Boot REST API — Java 21, Maven, PostgreSQL)

1. A Maven project layout matching the README's structure, adjusted for REST instead of Thymeleaf (controllers return JSON, no template engine).
2. The JPA entities for all five core models: Team, Match, Venue, MatchEvent, Commentary — with relationships, IDs, and the fields listed in the README's data model. Include the `Team.crest_url` field from `PLAN.md` (nullable) alongside `flag_url`.
3. Spring Data repository interfaces for each entity.
4. Empty service classes (`MatchService`, `SportsApiService`, `CommentaryService`, plus any others the plan calls for) with method signatures and `// TODO` bodies.
5. REST controllers exposing the endpoints defined in `PLAN.md`, returning placeholder/empty responses so the API contract is callable from day one.
6. `application.example.properties` with all required keys (datasource, sports API key, maps key, Anthropic key) and a real `application.properties` template — never put real secrets in committed files.
7. A SQL schema or JPA auto-DDL config, plus a stub seed mechanism (`--seed` argument) matching the README.
8. In the seed/importer scaffold, the team mapper stub should include a `// TODO: [Dev A]` to populate `Team.crest_url` from the football-data.org `crest` field (e.g. `https://crests.football-data.org/{id}.png`), exactly like `flag_url`. Crests are referenced by URL — never download or commit logo image files.

## Frontend (React SPA)

1. A React app shell: project setup, routing, a basic layout/nav, and a shared design system / styling foundation (so the broadcast-dashboard feel from the README is consistent across everyone's pages).
2. A typed API client module with one function per backend endpoint, pointing at the REST contract from `PLAN.md`. These can return mocked data so frontend work isn't blocked on the backend.
3. Placeholder page/route components for each major feature area (Teams, Matches, Match detail, Venues + map, Commentary), each clearly owned per the plan.
4. A shared `Crest` component in the design system: renders a team's `crestUrl`, and on `null` or image `onError` falls back to the committed local placeholder at `assets/crests/{slug}.jpg`. Use it anywhere a crest appears (team cards, match cards). A matching `Flag` helper should point at `assets/flags/{slug}.jpg`.
5. Wire the existing `assets/flags/` and `assets/crests/` folders (48 JPGs each, already generated) into the frontend so they're served as static assets.
6. A `.env.example` for the React app (API base URL, maps key).

## Shared / project hygiene

1. A root `README` section or `CONTRIBUTING.md` explaining how to run backend + frontend locally.
2. A sensible `.gitignore` covering Java/Maven, Node, env files, and IDE clutter.
3. Clear `// TODO: [Dev A/B/C]` markers in the files that map to each owner from `PLAN.md`, so everyone immediately sees what's theirs.

## Constraints

- Match the data model, integrations, and AI commentary design from the README exactly. Commentary stays non-predictive and cached per `match_id`.
- Crests load by URL (`crest_url`) at runtime with a local placeholder fallback — do not download, scrape, or commit trademarked federation/club logo files.
- No real API keys or secrets in any committed file.
- Don't over-build: stubs and contracts now, features later by each owner.

After scaffolding, give me a short summary of what was created, a tree of the file structure, and the exact commands to run the backend and frontend locally.
