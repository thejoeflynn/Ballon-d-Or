# Ballon d'Or — Session Handoff

Quick-start context for a fresh Cowork/Claude chat. Read this first, then `docs/features/`.

## Working agreement (important)
- **Produce markdown feature briefs in `docs/features/`, do NOT write app code directly.** Claude Code implements from the briefs. (Data/asset files like sample JSON or generated images are fine to create directly; application logic/components are not.)
- Keep deliverables consistent with the existing design system and the live API.

## Current state
- **Active branch:** `api-int-TEST` (integration of the API_Data backend with the polished "NewCombine" frontend).
- **Stacks:** React + Vite frontend (`frontend/`), Spring Boot REST backend (`backend/`, **port 8081**, api-football + Postgres). The frontend talks to `/api/*` (proxy/base URL → 8081).
- **Architecture / contracts:** see `PLAN.md`. Product name is **Ballon d'Or** (event references "FIFA World Cup 2026" stay).
- **Lots of branches exist** (`Joe`, `Joe2`, `combinebranch`, `dupebranch1`, `NewCombine`, `API_Data`, `Collin`, `michaelgiovannisie`, plus this one). Worth consolidating onto one mainline and retiring the rest.

## Open / not-yet-applied briefs (do these next)
- `docs/features/standings-grouping-fix.md` — **bug:** standings group by the match's api-football `round` ("Group Stage - 1") instead of group letter, so group tables don't render. Fix = group by the team's canonical group (`TEAM_META[slug].group`) in `mapStandings`.
- `docs/features/teams-fix-and-rosters.md` — **3 missing teams** (backend `findTeamByApiId` throws instead of find-or-create from fixtures) + **player rosters** feature (squads already at `/api/teams/{id}/players`; surface on Team detail).
- `docs/features/ai-commentary.md` — the non-predictive pre-match commentary feature (prompt is written; backend `CommentaryService` + frontend panel slot still to build; `MatchDetail` already has the slot).

## Other briefs in `docs/features/` (status varies — verify against current code)
Reference set, several already implemented on the integrated branch: `api-integration.md`, `branding-ballon-dor.md`, `accessibility-settings.md`, `navigation-sidebar.md`, `teams-page.md`, `team-card-flag-treatment-b.md` (chosen; `team-card-flag-treatment.md` = old approach A, ignore), `home-page.md`, `matches-tab.md`, `venue-explorer-react-port.md`, `standings-improvements.md`, `ui-consistency-audit.md`. Thymeleaf-targeted (legacy path, likely superseded by the React app): `port-standings-to-thymeleaf.md`, `group-stage-standings-thymeleaf.md`, `bracket-thymeleaf.md`. Data reference: `bracket-reference.md` (official R32 skeleton + third-place allocation).

## Key integration facts to remember
- API base: **8081**; frontend uses `/api` (proxy). DB starts empty — run `POST /api/admin/refresh` (+ `/refresh/rosters`, `/refresh/groups`) or `SampleDataService` to populate.
- Frontend adapts API → UI shapes in `frontend/src/lib/api.js` + `mappers.js`; static `TEAM_META` (slug → abbr/accent/group) + `NAME_TO_SLUG`/`QUIRKS` bridge api-football names to local flag/crest assets. Any new/edge team name must be added there.
- Venues already match the API shape; `VenueDetail` image/weather endpoints are NOT in the API_Data backend (they live on `dupebranch1`) — port them or degrade gracefully.

## Before switching chats
1. Commit/stash current work on `api-int-TEST` so nothing's in limbo.
2. In the new chat: re-select the `Ballon-d-Or` folder, and restate the working agreement above (the new chat won't remember it).
