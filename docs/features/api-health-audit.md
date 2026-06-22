# API Health Audit — Implementation Brief

> **For:** Claude Code / Joe. **Branch:** `api-int-TEST`. **Audited:** 2026-06-21.
> "Make sure all the APIs are working." This documents what was verifiable in this
> environment, the full frontend↔backend contract, and the gaps to close.

## What could and couldn't be tested here
- ✅ **Frontend production build: GREEN.** `npm run build` (vite) compiled cleanly —
  112 modules, 0 errors. (One-time fix: the checked-in `node_modules` was installed on a
  different OS, so the rollup native binary was missing; reinstalling
  `@rollup/rollup-linux-<arch>` resolved it. Also a locked `dist/.DS_Store` blocks in-place
  builds — build to a clean outDir or delete `dist/` first.)
- ❌ **Backend could not be run here.** The sandbox has Java 11 (the project requires **21**),
  **no Maven**, **no Postgres**, and no outbound network for ad-hoc HTTP. So api-football,
  Open-Meteo, and the Spring endpoints could not be hit live. The checks below are a static
  contract review; **the live run must be done in a real environment** (steps at the bottom).

## Frontend → backend contract (static review)

| Frontend call (`api.js`/pages) | Backend route | Status |
|---|---|---|
| `GET /api/teams` | `TeamController` | ✅ exists |
| `GET /api/teams/{id}` | `TeamController` | ✅ exists |
| `GET /api/teams/{id}/players` | `TeamController` | ✅ exists |
| `GET /api/matches` | `MatchController` | ✅ exists |
| `GET /api/matches/{id}` | `MatchController` | ✅ exists |
| `GET /api/matches/{id}/commentary` | — | ❌ **missing** (see `ai-commentary.md` port) |
| `GET /api/standings` (`?group=`) | `StandingsController` | ✅ exists |
| `GET /api/venues` (`?country=`) | `VenueController` | ⚠️ exists but **ignores `?country=`** |
| `GET /api/venues/{id}` | `VenueController` | ✅ exists |
| `GET /api/venues/{id}/images` | — | ❌ **missing** (UI degrades gracefully) |
| `GET /api/venues/{id}/weather` | — | ❌ **missing** (UI degrades gracefully) |
| `GET /api/venues/{id}/attraction-images` | — | ❌ **missing** (UI degrades gracefully) |

`api.js` wraps every call in try/catch with **mock fallbacks**, so a down backend silently
serves mock data — handy, but it can mask a broken API. When verifying, watch the network tab
/ disable fallbacks, don't just trust the rendered page.

## External API integration (`ApiFootballService`)
- Base `https://v3.football.api-sports.io`, auth header `x-apisports-key`. Endpoints used:
  `/teams`, `/fixtures`, `/players/squads`, `/coachs`, `/players/profiles`, `/standings`,
  all with `league=1`, `season=2026`.
- Refresh endpoints (`AdminRefreshController`, all POST): `/api/admin/refresh` (=static),
  `/refresh/static`, `/refresh/results`, `/refresh/rosters`, `/refresh/groups`, and
  `DELETE /api/admin/clear`. DB boots empty — these must be run to populate.
- **Rate limit:** `/refresh/rosters` makes ~48 squad calls and the team import calls `/coachs`
  per team; on the api-football free tier this can exhaust the daily quota. Refresh
  deliberately (the `DataRefreshLog` cache windows help) and expect partial data if throttled.

## Security / config gaps (fix these)
1. **A live api-football key is committed** in
   `backend/src/main/resources/application.properties` (and DB creds). Move real secrets to a
   gitignored/local properties or env vars; commit only `application.example.properties`
   placeholders. Rotate the exposed key.
2. The upcoming Groq key (commentary port) must follow the same rule — placeholder only.

## Data-correctness issues found (cross-refs)
- **Group labels** are assigned from a stale, name-keyed `fallbackGroupForTeam` that disagrees
  with the canonical draw → wrong/`TBD` groups. See `teams-fix-and-rosters.md` §A2.
- **Venues** are imported without coordinates/capacity → the Venues tab crashes. See
  `venues-backend-data-fix.md`.
- **Standings** are computed only from matches with both scores present; pre-tournament this is
  legitimately empty. Not a bug, but expect empty group tables until results exist.

## Live verification procedure (run in a real environment)
1. Java 21 + Maven + Postgres (`worldcup` DB) available; put real keys in local properties.
2. `cd backend && mvn clean spring-boot:run` → boots on **8081**.
3. `POST /api/admin/refresh` → `POST /api/admin/refresh/groups` → `POST /api/admin/refresh/rosters`.
4. Smoke the endpoints:
   - `GET /api/teams` → **48**, every team a valid `A`–`L` group.
   - `GET /api/teams/{id}/players` → squad array.
   - `GET /api/matches` and `/api/matches/{id}` → fixtures with venue + kickoff.
   - `GET /api/standings` → group rows (once results exist).
   - `GET /api/venues` → venues **with non-null lat/lng/capacity** (after the venue fix).
5. `cd frontend && npm run dev`; confirm each tab loads from the API (not the mock fallback),
   with the Vite proxy forwarding `/api` (and `/images`) to 8081.

## Acceptance criteria
- Every row in the contract table resolves (no 404s) against the running backend.
- No real secrets remain in committed files; example properties carry placeholders only.
- All five live smoke checks pass; frontend tabs render real API data with fallbacks disabled.
