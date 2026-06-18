# Standings — Improvements — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Simplify the standings and make countries clickable. This is a spec, not code.

## 1. Remove the "wild card" third-place board

- Remove the `ThirdPlaceRace` board from the Group Stage tab (`Standings.jsx` no longer renders `<ThirdPlaceRace>`). The component file can be deleted or left unused.
- Simplify the **Legend** (`Legend.jsx`): drop the "Wild-card in (best 3rd)" entry. Keep just "Advancing (1st / 2nd)" and (optional) a neutral "Eliminated/other" — or remove the legend entirely if only one state remains.
- Simplify row highlighting: in `StandingsRow.jsx`, drop the `wildcard` rail state; keep only `advance` (top 2) highlighted, everything else neutral. Update `lib/standings.js` `annotateGroups` so rows are just `advance` vs `none` (no `wildcard`).
- **Keep the bracket projection working:** the Bracket tab still needs the 8 best thirds to build the projected R32, so leave `getRankedThirds`/`getProjectedQualifiers` logic intact and used by the bracket tab — just don't surface the wild-card board/among the group standings UI.

## 2. Click a country → its team page

- Make each team row in the group standings link to `/teams/:slug`. In `StandingsRow.jsx`, wrap the team cell (flag + name) in a React Router `<Link to={`/teams/${row.slug}`}>` with a clear hover affordance (color/underline), inheriting text color otherwise. Keep the row's stats cells non-link or include them in the link row — but the whole row being clickable is ideal; if using a table, make the team-name cell the link (simplest accessible option) or wrap the row with an onClick + keyboard handler.
- Also make the **Bracket tab** qualifier names clickable: in `ProjectedQualifiers.jsx` (and resolved team names in `ProjectedR32List.jsx`) link real teams to `/teams/:slug` (skip placeholders/TBD).
- **Slug alignment (important):** team links only work if the standings rows' `slug` matches the Teams page slugs (`mockTeams.js`). Verify both data sources use the same slugs (e.g. `united-states`, `dr-congo`, `curacao`); reconcile `mockStandings.js` ↔ `mockTeams.js` if they differ. If a standings row has no matching team page, render it as plain text (no broken link).

## 3. Polish (small)

- The page subtitle ("Projected — based on standings as of today…") is bracket-specific; make it tab-aware (group tab: a group-stage line; bracket tab: the projection line), or move it under the Bracket tab only.
- Apply the shared `.page-title` / `.section-title` classes from `ui-consistency-audit.md` here too (the Standings title is currently inline-styled).

## 4. Acceptance criteria

- No wild-card/third-place board on the Group Stage tab; legend/rows reflect only top-2 advancing; no leftover references.
- Clicking a country in the group tables (and bracket qualifier lists) navigates to that team's `/teams/:slug` page; hover affordance present; keyboard-accessible.
- Bracket tab still renders projected qualifiers + R32 correctly (best-thirds logic retained under the hood).
- `npm run build` succeeds.

## 5. Out of scope

- Real (non-mock) standings data.
- The full visual bracket tree.
