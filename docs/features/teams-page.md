# Teams Page (React) — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), `combinebranch`.
> Behavior/asset reference: `design-system.md` (Flag/Crest components, tokens). This is a spec, not code.

## 1. Goal

Build out the **Teams** section (`/teams`, `frontend/src/pages/Teams.jsx`, currently a placeholder).

- **Now (v1):** a grid of all 48 World Cup teams, each card showing the team's **flag + crest** and name (+ group).
- **Later:** a team detail page with the team's **World Cup history** and **roster/squad**.

## 2. v1 — Teams grid

- Responsive grid of 48 `TeamCard`s (e.g. 2 cols mobile → 4–6 desktop).
- **`TeamCard`** shows: `Crest` (prominent) + `Flag` (smaller, e.g. corner or beside the name) + team **name** (display font, uppercase) + a small **group badge** ("Group H"). Reuse the `Flag` and `Crest` components from the design system (crest falls back to placeholder). Card uses `Card` styling/tokens; subtle hover lift.
- Each card links to the (future) detail route `/teams/:slug`. For v1 the detail page can be a stub ("history & roster coming soon").
- **Optional now:** a group filter (A–L) and/or a name search — nice MLB-ish touch, but fine to defer.

### Data (mock now)
- Add `frontend/src/data/mockTeams.js`: the 48 teams as `{ slug, name, abbr, group }`.
  - `slug` matches the flag/crest filenames (`united-states`, `dr-congo`, `curacao`, …) so `Flag`/`Crest` resolve.
  - Use the real 48 teams and group letters (A–L) — they're already known from the asset set / project data.
- Keep data access in one module so it swaps to the real API later without UI changes.

## 3. Later — Team detail (document, don't build yet)

`/teams/:slug` will show:
- **World Cup history:** appearances, best finish, titles (e.g. Brazil — 5 titles; USA — best 3rd 1930). The "best WC finish" data already exists from project research.
- **Roster/squad:** the 26-player squad (name, position, club, number).

Future API shape (coordinate with the Team-tracking team): `GET /api/teams/{slug}` returning profile + `history` + `squad`. v1 stays on mock; detail content is out of scope here.

## 4. Styling / tokens

All via `theme.css` tokens; consistent with the design system and the new sidebar layout (`navigation-sidebar.md`). Display font for names, group badge styled like other pills/badges.

## 5. Acceptance criteria

- `npm run build` succeeds; `/teams` renders all 48 teams as cards with flag + crest + name + group.
- Crest falls back to the local placeholder when a real crest URL isn't present.
- Cards link to a `/teams/:slug` stub; grid is responsive and matches the design system.
- Team data comes from a single mock module, ready to swap for a real API.

## 6. Out of scope

- Team detail content (World Cup history + roster) — future phase.
- Real teams API — mock data for now.
