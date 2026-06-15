# World Cup Tracker — Project Plan & 3-Way Work Split

> Capstone plan for a 3-person team (Dev A, Dev B, Dev C). Source of truth: the project `README.md`, with the React/REST change described below. This file is the agreed contract for Prompt 2 (scaffolding).

## Decisions locked for this plan

These were confirmed before writing the plan:

- **Frontend:** React single-page app (replaces Thymeleaf). Spring Boot becomes a pure REST/JSON backend.
- **Integrations:** Google Maps JavaScript API (venues), Anthropic Claude API (commentary), **football-data.org** (sports data).
- **Data freshness:** Seeded/cached data only. A one-time `--seed` step pulls from football-data.org into PostgreSQL; the app serves from the DB. **No live polling or WebSockets.**
- **Team:** Three roughly-equal full-stack developers. Each owns a **vertical slice** (entity → repository → service → controller → React pages), with lighter slices padded by shared/infra/design work to balance effort.

## Assumptions

1. **Read-only product.** Users browse; there are no user accounts, writes, or auth. All stretch goals in the README are out of scope.
2. **Seed window is fixed.** We seed once (e.g. a recent/finished tournament or a fixed match set from football-data.org's free tier) so data is stable and demos are reproducible. Scores/status come frozen from the seed, not live.
3. **football-data.org free tier is the constraint.** It gives competitions, teams, matches, standings, and limited events. Lineups and rich per-minute events are thin on the free tier, so `MatchEvent` is seeded best-effort and supplemented with a small amount of hand-curated/sample data for demo matches.
4. **Commentary is generated at seed/admin time, not on user request,** so a page load never blocks on the Claude API. It is cached in the `commentary` table keyed by `match_id` and served from the DB. It is **non-predictive** by design (tactical/stylistic only).
5. **Google Maps key is browser-restricted** and read from the React `.env`; the backend does not call Maps. Lat/lng come from seeded venue data.
6. **One PostgreSQL database**, schema managed by JPA/Hibernate auto-DDL in dev (`ddl-auto=update`), with a committed `schema.sql` kept in sync for reference. CORS is open to the React dev origin.
7. **Local dev only** for grading: backend on `:8080`, React (Vite) on `:5173`.

---

## 1. Revised Architecture Overview (React + REST split)

The single Spring Boot process splits into two deployables that talk over HTTP/JSON:

```
┌────────────────────────────┐        ┌──────────────────────────────────────────┐
│   React SPA (Vite)         │        │      Spring Boot REST API (:8080)          │
│   :5173                    │        │                                            │
│                            │  JSON  │  ┌────────────┐  ┌────────────┐            │
│  Pages / Routes  ──────────┼───────▶│  │ @RestController │ Services │           │
│  api/ client (fetch)       │  CORS  │  └─────┬──────┘  └─────┬──────┘            │
│  Google Maps JS (browser)  │        │        │               │                  │
│  Design system / layout    │        │   ┌────▼─────┐   ┌─────▼──────┐           │
└────────────────────────────┘        │   │  Repos   │   │ Integrations│          │
            │                          │   └────┬─────┘   │  - football │          │
            │ Maps JS API              │        │         │    -data.org│          │
            ▼                          │   ┌────▼─────┐   │  - Claude   │          │
   maps.googleapis.com                 │   │PostgreSQL│   └─────────────┘          │
                                       │   └──────────┘   (seed-time only)         │
                                       └────────────────────────────────────────────┘
```

Key changes from the README:

- **No Thymeleaf, no server-rendered HTML.** Controllers are `@RestController` returning DTOs as JSON. `src/main/resources/templates` and most of `static/` go away.
- **React is a separate project** (suggested: `frontend/` alongside the Maven `backend/`, or a sibling repo — see structure below). It owns all rendering, routing, and the Google Maps integration.
- **CORS** is configured on the backend to allow the React origin.
- **External APIs are called at seed time only.** football-data.org and Claude are invoked by the seed/admin path and the results persisted; the request path that serves users only reads PostgreSQL. This keeps page loads fast and stays within free-tier rate limits.
- **DTOs, not entities, cross the wire.** Each controller maps entities → response DTOs so we can shape JSON independently of the schema and avoid Hibernate lazy-loading leaks.

### Proposed repository layout

```
Ballon-d-Or/
├── backend/                         # Spring Boot (Maven)
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/zipcode/worldcuptracker/
│       │   ├── WorldCupTrackerApplication.java
│       │   ├── config/              # CORS, seed runner, RestClient beans
│       │   ├── model/               # JPA entities (shared)
│       │   ├── repository/          # Spring Data repos
│       │   ├── dto/                 # request/response DTOs (shared contract)
│       │   ├── service/             # business logic + API clients
│       │   ├── controller/          # @RestControllers
│       │   └── seed/                # --seed runner + importers
│       └── main/resources/
│           ├── application.properties
│           ├── application.example.properties
│           └── schema.sql           # reference DDL
├── frontend/                        # React SPA (Vite)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx, App.jsx, router
│       ├── api/                     # typed client, one fn per endpoint
│       ├── components/              # shared design system
│       ├── pages/                   # feature pages (owned per dev)
│       └── styles/                  # theme tokens, broadcast look
├── README.md
├── PLAN.md
└── CONTRIBUTING.md                  # how to run both locally
```

---

## 2. Shared Contracts (build/agree these FIRST)

Everything in this section is built together in the Foundation phase (Section 4) and frozen before slices begin. This is what lets three people work in parallel without blocking each other.

### 2.1 JPA entities & schema

Five core entities exactly per the README data model. Relationships:

- `Match` → `Team` (home), `Team` (away), `Venue` — many-to-one each.
- `MatchEvent` → `Match` — many-to-one (a match has many events).
- `Commentary` → `Match` — one-to-one, unique on `match_id` (the cache key).

```
Team
  id            BIGINT PK
  name          VARCHAR
  country       VARCHAR
  flag_url      VARCHAR
  crest_url     VARCHAR NULL   -- federation crest URL from sports API (football-data.org `crest`); null falls back to local placeholder
  group_label   VARCHAR        -- "group" is reserved; column maps from field `group`
  coach         VARCHAR

Venue
  id            BIGINT PK
  name          VARCHAR
  city          VARCHAR
  country       VARCHAR
  capacity      INT
  lat           DOUBLE
  lng           DOUBLE
  image_url     VARCHAR

Match
  id            BIGINT PK
  home_team_id  BIGINT FK -> team(id)
  away_team_id  BIGINT FK -> team(id)
  venue_id      BIGINT FK -> venue(id)
  kickoff_time  TIMESTAMP
  home_score    INT  NULL
  away_score    INT  NULL
  status        VARCHAR        -- SCHEDULED | LIVE | FINISHED
  group_label   VARCHAR NULL   -- group stage label, optional

MatchEvent
  id            BIGINT PK
  match_id      BIGINT FK -> match(id)
  type          VARCHAR        -- GOAL | CARD | SUB
  minute        INT
  player        VARCHAR
  team_id       BIGINT FK -> team(id)

Commentary
  id            BIGINT PK
  match_id      BIGINT FK -> match(id)  UNIQUE
  content       TEXT
  generated_at  TIMESTAMP
```

Notes: `status` is an enum on the Java side (`MatchStatus`), `type` an enum (`EventType`). `score` in the README is split into `home_score` / `away_score` for queryability. `group` is renamed to `group_label` at the column level because `GROUP` is a SQL reserved word.

**Crests:** `crest_url` holds the real federation crest URL served by the sports API (football-data.org returns it in each team's `crest` field, e.g. `https://crests.football-data.org/{id}.png`) — referenced by URL exactly like `flag_url`, never committed as a file (avoids redistributing trademarked logos). When `crest_url` is null or the image fails to load, the frontend falls back to the committed local placeholder badge at `assets/crests/{slug}.jpg` (48 originals already generated). Flags are bundled locally in `assets/flags/{slug}.jpg`.

### 2.2 REST API surface

Base path `/api`. All responses JSON. Read-only (GET) for the user-facing app; the one write-ish path (`generate` commentary) is an admin/seed convenience.

| # | Method | Path | Purpose | Owner |
|---|--------|------|---------|-------|
| 1 | GET | `/api/teams` | List all teams (optionally `?group=`) | Dev A |
| 2 | GET | `/api/teams/{id}` | Team profile + standings info | Dev A |
| 3 | GET | `/api/matches` | List matches (`?status=`, `?teamId=`, `?venueId=`) | Dev B |
| 4 | GET | `/api/matches/{id}` | Match detail incl. teams, venue, events | Dev B |
| 5 | GET | `/api/matches/{id}/events` | Timeline events for a match | Dev B |
| 6 | GET | `/api/venues` | List all venues (for the map) | Dev C |
| 7 | GET | `/api/venues/{id}` | Venue detail + its scheduled matches | Dev C |
| 8 | GET | `/api/matches/{id}/commentary` | Cached commentary for a match | Dev C |
| 9 | POST | `/api/matches/{id}/commentary:generate` | Generate+cache if absent (admin/seed) | Dev C |

Representative JSON shapes (the frozen contract the React `api/` client codes against):

```jsonc
// GET /api/teams/{id}
{
  "id": 1, "name": "Portugal", "country": "Portugal",
  "flagUrl": "https://.../pt.svg",
  "crestUrl": "https://crests.football-data.org/765.png",  // null -> frontend uses local placeholder
  "group": "H", "coach": "Roberto Martínez",
  "standing": { "played": 3, "won": 2, "drawn": 1, "lost": 0, "points": 7 }
}

// GET /api/matches?status=FINISHED
[
  {
    "id": 42, "status": "FINISHED", "kickoffTime": "2026-06-20T19:00:00Z",
    "homeTeam": { "id": 1, "name": "Portugal", "flagUrl": "..." },
    "awayTeam": { "id": 5, "name": "England", "flagUrl": "..." },
    "venue": { "id": 3, "name": "MetLife Stadium", "city": "East Rutherford" },
    "homeScore": 2, "awayScore": 1
  }
]

// GET /api/matches/{id}
{
  "id": 42, "status": "FINISHED", "kickoffTime": "2026-06-20T19:00:00Z",
  "homeTeam": { "id": 1, "name": "Portugal", "flagUrl": "..." },
  "awayTeam": { "id": 5, "name": "England", "flagUrl": "..." },
  "venue": { "id": 3, "name": "MetLife Stadium", "city": "East Rutherford", "lat": 40.81, "lng": -74.07 },
  "homeScore": 2, "awayScore": 1,
  "events": [
    { "id": 100, "type": "GOAL", "minute": 23, "player": "Bruno Fernandes", "teamId": 1 }
  ]
}

// GET /api/venues  (map markers)
[
  { "id": 3, "name": "MetLife Stadium", "city": "East Rutherford", "country": "USA",
    "capacity": 82500, "lat": 40.81, "lng": -74.07, "imageUrl": "..." }
]

// GET /api/matches/{id}/commentary
{
  "matchId": 42,
  "content": "Portugal's fluid front three will test England's narrow defensive mid...",
  "generatedAt": "2026-06-12T10:00:00Z"
}
```

Error shape (shared): `{ "status": 404, "error": "Not Found", "message": "Match 999 not found" }`.

### 2.3 Config / env

`backend/src/main/resources/application.example.properties` (committed; real `application.properties` is gitignored):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/worldcup
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true

# CORS
app.cors.allowed-origin=http://localhost:5173

# Integrations (used at seed time only)
api.football.key=YOUR_FOOTBALL_DATA_ORG_KEY
api.football.base-url=https://api.football-data.org/v4
api.anthropic.key=YOUR_CLAUDE_API_KEY
api.anthropic.model=claude-sonnet-4-6
```

`frontend/.env.example` (Vite requires the `VITE_` prefix):

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_KEY=YOUR_BROWSER_RESTRICTED_MAPS_KEY
```

**No real secrets are ever committed.** Both `application.properties` and `frontend/.env` are in `.gitignore`.

---

## 3. Feature-to-Owner Map (pure feature slices)

Each dev owns one feature end-to-end with **no horizontal padding** — the cross-cutting work (design system, app shell, importer framework) is built collectively in Phase 0 and owned by no single person. Within the shared seed importer, **each dev writes the mapper for their own entity**, so the importer isn't one person's burden and nobody is blocked waiting on someone else's data.

| Slice | Owner | Backend | Frontend | Own data import | Integration |
|-------|-------|---------|----------|-----------------|-------------|
| **Teams & Standings** | **Dev A** | Team entity, repo, `TeamService`, `TeamController` | Teams list, Team profile pages | Team importer mapper | (none — seeded) |
| **Matches & Events** | **Dev B** | Match + MatchEvent entities/repos, `MatchService`, `MatchController` | Matches list, Match detail w/ timeline | Match + Event importer mapper | football-data.org (shared client) |
| **Venues + Map & Commentary** | **Dev C** | Venue + Commentary entities/repos, `VenueService`, `CommentaryService` | Venues page + **Google Maps**, Commentary panel | Venue importer mapper | **Google Maps** + **Claude API** |

Rationale: this keeps ownership clean and conflict surface low — one feature per person, no one owning a horizontal concern the others depend on. Teams is genuinely the lightest feature; rather than padding it with the design system (which would make Dev A a bottleneck for B and C), we accept it as slightly lighter and make **Dev A the integration/QA lead in Phase 2** (cross-link wiring, end-to-end seed run, extra test coverage) to absorb the slack. Splitting the importer per-entity also removes the old dependency where Teams' standings waited on the Matches owner's importer.

---

## 4. Phasing

### Phase 0 — Shared Foundation (ALL THREE, together, ~2.5–3 days)

All horizontal/cross-cutting work lives here and is built collectively — split the items below evenly (e.g. one dev drives schema, one the React shell + design system, one the importer framework + config), then everyone reviews and merges before Phase 1 begins. Nothing horizontal is owned by a single person afterward.

- **Repo & build:** `backend/` Maven project (Java 21, Spring Boot, Spring Web, Spring Data JPA, PostgreSQL driver, Validation), `frontend/` Vite + React + React Router. Root `.gitignore`, `CONTRIBUTING.md`.
- **Entities & schema (pair on this):** all five JPA entities + relationships exactly per §2.1, repositories, committed `schema.sql`. Freeze it.
- **DTOs & API contract:** the DTO classes and the endpoint signatures from §2.2 as **stub controllers returning empty/placeholder JSON**, so the contract is callable day one.
- **Shared design system & app shell:** routing, layout/nav, broadcast theme tokens (colors, typography), and the reusable component library (`Card`, `Badge`, `ScoreLine`, loading/empty states). Built together now so no one is blocked on it later; after merge it's frozen and changes go via small PRs with group sign-off.
- **Importer framework (shared skeleton):** `SportsApiService` (football-data.org v4 HTTP client with auth, rate-limit backoff), the `FootballDataImporter` orchestrator with a pluggable per-entity mapper interface, and the `--seed` `CommandLineRunner`. Each dev fills in their own entity's mapper in Phase 1.
- **Config:** `application.example.properties`, CORS config bean, `.env.example`.
- **Mocked API client:** the typed `api/` client with **one mocked function per endpoint** so frontend work isn't blocked on backend.

Exit criteria: backend boots, every endpoint returns a stub, React app runs with nav + mock data on the shared design system, the importer framework runs (with empty mappers), schema is frozen. Now split.

### Phase 1 — Parallel Pure-Feature Slices

#### Dev A — Teams & Standings

Files/modules owned: `model/Team.java`*, `repository/TeamRepository.java`, `service/TeamService.java`, `controller/TeamController.java`, `dto/Team*Dto.java`, `seed/TeamMapper.java`; `frontend/src/pages/Teams/*`.
(*Team entity authored in Phase 0; Dev A maintains it thereafter.)

Tasks:

1. `TeamMapper`: map football-data.org teams into the `Team` entity (plugged into the shared importer), including `crest_url` from the API's `crest` field.
2. Implement `TeamService`/`TeamController` for endpoints 1–2; compute standings (played/won/drawn/lost/points) from seeded matches.
3. Teams list page: grid of team cards (using the shared `Card`/`Badge`) with flag, crest, group, coach; filter by group.
4. Team profile page: header, standings block, list of that team's matches (links to Dev B's match detail).
5. Shared `Crest` component (in the design system): renders `crestUrl` and on null/`onError` falls back to the local placeholder at `assets/crests/{slug}.jpg`. Used anywhere a crest shows (team cards, match cards).
6. Unit tests: `TeamService` standings calc (JUnit 5 + Mockito).

Deliverables: team import, working Teams endpoints, two Teams pages, standings tests.

Effort: **~5 days** (import mapper ~0.5, Teams API + standings ~2, two pages ~2, tests ~0.5). Lighter than B/C — see balancing note below.

#### Dev B — Matches & Events

Files/modules owned: `model/Match.java`, `model/MatchEvent.java`, `repository/MatchRepository.java`, `repository/MatchEventRepository.java`, `service/MatchService.java`, `controller/MatchController.java`, `dto/Match*Dto.java`, `seed/MatchEventMapper.java`; `frontend/src/pages/Matches/*`, `frontend/src/pages/MatchDetail/*`.

Tasks:

1. `MatchEventMapper`: map football-data.org matches + events into `Match`/`MatchEvent` (plugged into the shared importer); handle free-tier gaps gracefully (best-effort events, hand-curated demo matches).
2. `MatchService`/`MatchController` for endpoints 3–5 with `status`/`teamId`/`venueId` filters.
3. Matches list page: filter by status (Scheduled/Finished), team, venue; score lines via the shared `ScoreLine`.
4. Match detail page: teams, venue link (to Dev C), score, and the **events timeline**; a named slot where Dev C's commentary panel mounts.
5. Tests: mapper logic (mock HTTP), `MatchService` filters.

Deliverables: match/event import, Matches endpoints, list + detail pages with timeline, mapper/service tests.

Effort: **~6.5 days** (import mapper ~1.5, match/event API ~2, two pages ~2.5, tests ~0.5).

#### Dev C — Venues + Google Map & AI Commentary

Files/modules owned: `model/Venue.java`, `model/Commentary.java`, `repository/VenueRepository.java`, `repository/CommentaryRepository.java`, `service/VenueService.java`, `service/CommentaryService.java`, `config/AnthropicClient*`, `controller/VenueController.java`, `controller/CommentaryController.java`, `dto/Venue*Dto.java`, `dto/CommentaryDto.java`, `seed/VenueMapper.java`; `frontend/src/pages/Venues/*` (map), `frontend/src/components/CommentaryPanel.jsx`.

Tasks:

1. `VenueMapper`: map venue data into the `Venue` entity (football-data.org has limited venue data, so supplement with a small curated venue list for host stadiums).
2. `VenueService`/`VenueController` for endpoints 6–7 (venue list + detail with that venue's matches).
3. Venues page with **Google Maps JS API**: a marker per venue from `/api/venues`, info windows linking to venue detail; key from `VITE_GOOGLE_MAPS_KEY`.
4. `CommentaryService` + Anthropic client: implement endpoints 8–9. **Non-predictive prompt** per the README; on `generate`, call Claude once, store in `commentary` (unique `match_id`), and always serve from cache thereafter. Invoked from the seed path so user requests never hit the API live.
5. `CommentaryPanel` React component that mounts in Dev B's match-detail slot and shows cached commentary.
6. Tests: `CommentaryService` cache behavior (cached calls don't re-invoke Claude), `VenueService`.

Deliverables: venue import, Venues endpoints, interactive map page, cached non-predictive commentary endpoints + panel, cache/venue tests.

Effort: **~6.5 days** (venue import + map ~3, commentary service + Claude ~2.5, panel ~0.5, tests ~0.5).

Balance check: Phase 1 lands at A ≈ 5, B ≈ 6.5, C ≈ 6.5 dev-days. Teams is honestly the lighter feature; rather than distort the clean ownership to hide that, Dev A takes the lead on the **Phase 2 integration/QA work** (~1.5 days) — cross-link wiring, full end-to-end seed run, and extra test coverage across all three slices — which brings the totals to roughly even.

### Phase 2 — Integration & polish (ALL, Dev A leads, ~1–1.5 days)

Wire commentary panel into match detail, cross-link teams ↔ matches ↔ venues, run the full seed end-to-end, smoke-test every page against real seeded data, README/CONTRIBUTING finalization. Dev A owns coordination and the cross-cutting test pass.

---

## 5. Dependency & Sequencing Map

```
Phase 0 (shared, collective): schema + DTO contract + React shell + design system
                              + importer framework + mocked API client
        │  (split evenly, reviewed & merged & frozen before Phase 1)
        ▼
 ┌──────────────┬───────────────────┬───────────────────┐
 │  Dev A       │  Dev B            │  Dev C            │
 │  Teams &     │  Matches &        │  Venues+Map &     │
 │  Standings   │  Events           │  Commentary       │
 │ +TeamMapper  │ +Match/EventMapper│ +VenueMapper      │
 └─────┬────────┴─────────┬─────────┴─────────┬─────────┘
       │                  │                   │
  imports own data   imports own data    imports own data
  (no cross-dep)     (no cross-dep)      commentary panel
       │                  │              mounts in B's slot
       ▼                  ▼                   ▼
   Phase 2 (Dev A leads): integration + cross-links + full seed run
```

Hard dependencies:

- **Everyone depends on Phase 0** (frozen schema + DTO contract + design system + importer framework + mocked API client). No slice starts until it's merged.
- **Self-contained imports:** because each dev owns their own entity's mapper, A's standings, B's matches, and C's venues each populate independently — no one waits on another's importer. (A's standings still read seeded matches, so for early local testing A uses a small fixture until B's match import lands; not a hard blocker.)
- **C's commentary panel** mounts into **B's match-detail page** → the named mount slot/prop contract is fixed in Phase 0, so neither blocks the other.

Integration points (where two people's code meets): match-detail page (B's page hosts C's `CommentaryPanel` via the agreed slot); every page consumes the shared (Phase 0) design-system components; A's team links target B's match pages; C's venue detail lists B's matches. All of these are contracts agreed in Phase 0.

---

## 6. Risks & Gotchas

**Integrations**

- *football-data.org free tier* — rate-limited (≈10 req/min) and thin on lineups/events. Risk: importer stalls or events are sparse. Mitigation: seed once with backoff; treat events as best-effort and hand-curate a couple of demo matches so the timeline always looks populated.
- *Google Maps* — billing/key setup and the browser key-restriction trip people up; an unrestricted key in a committed `.env` is a security and cost risk. Mitigation: browser-restricted key, `.env` gitignored, fall back to Leaflet only if Maps billing blocks the team.
- *Claude commentary* — the real risk is the model slipping into predictions, or per-request latency/cost. Mitigation: lock the non-predictive prompt in Phase 0, generate at seed time, cache per `match_id` (unique constraint enforces one call per match), and add a test asserting cached calls don't re-invoke the API.

**Shared code ownership**

- The **design system**, **DTO/schema contract**, and **importer framework** are all built collectively in Phase 0 and touched by everyone → highest conflict surface. Mitigation: freeze them at end of Phase 0; later changes go via small PRs with group sign-off, and nobody owns a horizontal concern the others are blocked on during Phase 1.
- The **match-detail page** is co-owned (B's page, C's panel) → agree the mount slot and props up front; C develops the panel in isolation against the mocked API.

**Merge conflicts**

- Vertical slices keep most files single-owner, which is the point. The remaining hotspots: `App.jsx`/router (everyone adds routes), `application.properties`/`pom.xml`, and the shared `api/` client. Mitigation: each dev adds their own route/endpoint function in a clearly separated block; do router and api-client edits in small, frequent PRs; rebase often; nobody reformats files they don't own.

**Scope**

- Stretch goals (accounts, notifications, historical tournaments, Docker, mobile redesign) are **out of scope**. Live data is explicitly excluded — seeded only. Pull these back in only with spare time after Phase 2.

---

## Summary (one paragraph)

We split World Cup Tracker into three clean, pure-feature slices on a collectively-built foundation. First, all three build Phase 0 together — the five JPA entities and frozen schema, the REST/DTO contract, the React shell **and shared design system**, the **seed-importer framework**, and a mocked API client — so all the horizontal work is done collectively and no single person owns a concern the others depend on. Then **Dev A** owns Teams & Standings, **Dev B** owns Matches & Events, and **Dev C** owns Venues with the Google Maps page and the cached, non-predictive Claude commentary. Each dev runs their feature entity → repo → service → controller → React pages and writes their own entity's importer mapper, so the imports are self-contained and nobody blocks on someone else's data. Teams is honestly the lighter feature, so rather than padding it we make Dev A the integration/QA lead for the final phase — wiring the commentary panel into match detail, cross-linking the features, running the full seed end to end, and adding cross-cutting tests — which evens the effort out at roughly 6.5 dev-days each.
