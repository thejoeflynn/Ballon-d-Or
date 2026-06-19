# Fix: Standings not showing group rankings — Bug Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** `api-integration` branch.
> Small, surgical fix. This is a spec, not code.

## Symptom
The Standings → Group Stage tab no longer shows the 12 group tables / rankings after the API integration.

## Root cause
Standings are grouped by the **match's** `groupLabel`. After the api-football import, a match's `groupLabel` is set from the provider's `round` field, which for group games is the **matchday** — e.g. `"Group Stage - 1"`, `"Group Stage - 2"` — not the group letter (`"Group A"`).

The frontend `lib/mappers.js` `mapStandings()` buckets rows with `stripGroup(row.groupLabel)`, and `stripGroup` only removes a leading `"Group "`:
```js
function stripGroup(label) {
  return label?.replace(/^Group\s+/i, '').trim() ?? '';
}
```
So `"Group Stage - 1"` → `"Stage - 1"`. Rows end up bucketed by matchday round (`Stage - 1/2/3`, `TBD`, …) instead of groups A–L, so `GroupTable` renders garbage/empty instead of the 12 groups.

(The backend `StandingsController` groups by `match.getGroupLabel()` too, so it has the same flaw at the source.)

## Primary fix (frontend — fast, robust)
In `mapStandings` (`lib/mappers.js`), group each row by the **team's canonical group letter** from `TEAM_META`, which already carries it (from `mockTeams`), instead of the API's match label. The function already computes `slug` and `meta` per row:

- Use `meta.group` as the bucket key instead of `stripGroup(row.groupLabel)`.
- Guard: if `meta?.group` is missing (team not in `TEAM_META` — e.g. a still-unmapped name), fall back to `stripGroup(row.groupLabel)` so the row isn't lost; ideally fix the name mapping so every team resolves (ties into the missing-teams work).
- Keep the existing A–L sort and the `[{ id, teams }]` return shape so `annotateGroups`/`GroupTable` are unchanged. With the fix, `group.id` is `"A".."L"` and `GroupTable`'s "Group {id}" renders correctly again.

This also makes `getProjectedQualifiers` / `getRankedThirds` correct, since they consume the same grouped data.

## Recommended backend fix (correctness at the source)
So the API itself returns proper groups (and any other consumer is correct):
- In `StandingsController`, group by the **team's** `groupLabel` (A–L, set by `fallbackGroupForTeam` / groups refresh) rather than `match.getGroupLabel()`.
- And/or in `FootballDataImportService.importMatches`, normalize a group-stage match's `groupLabel` to the team's group letter whenever the round starts with "Group" (not only when it equals exactly `"Group Stage"`) — currently `"Group Stage - 1"` slips through and is stored verbatim.
- Ensure team `groupLabel`s are populated (run `POST /api/admin/refresh/groups`; verify `fallbackGroupForTeam` covers all 48 names).

## Acceptance criteria
- Standings → Group Stage shows all 12 group tables (A–L), four teams each, correctly ranked (Pts → GD → GF), with advancement highlighting on the top 2.
- Bracket tab's projected qualifiers/R32 reflect the corrected groups.
- Works against live API data; `npm run build` succeeds.

## Note
This is the cleanest immediate fix (frontend grouping by canonical team group). The backend fix is recommended so the `/api/standings` response is itself correct, but the frontend change alone restores the UI.
