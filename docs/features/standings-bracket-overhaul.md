# Standings + Bracket Overhaul — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Branch:** `api-int-TEST`. **Drafted:** 2026-06-21.
> Two parts: (A) fix the group-stage tables, (B) replace the bracket "list" with a real bracket.
> This is a spec, not code. Builds on `standings-grouping-fix.md` and `bracket-reference.md`.

## Files in play
`pages/Standings.jsx`, `components/GroupTable.jsx`, `components/StandingsRow.jsx`,
`components/Legend.jsx`, `components/ProjectedQualifiers.jsx`, `components/ProjectedR32List.jsx`,
`lib/standings.js`, `lib/bracketTemplate.js`, and the standings rules in `styles/theme.css`
(group color tokens `--group-A`…`--group-L`; status tokens `--status-advance` green,
`--status-wildcard` gold, `--status-out` pink already exist).

---

## Part A — Group-stage tables

### A1. All stats must be visible (current bug)
`GroupTable` wraps an 11-column table (`# Team P W D L GF GA GD Pts`) in a card with
`overflow: hidden`, and each group card sits in a `minmax(300px, 1fr)` grid cell. At narrow
widths the table can't shrink below its content, so columns get **clipped** and you can't see
all stats at once.
- Replace `overflow: hidden` with a horizontal-scroll wrapper around the table
  (`overflow-x: auto`) so every column is reachable, **or** make the table responsive (e.g. hide
  the least-important columns below a breakpoint while keeping them reachable on detail/scroll).
- Keep numeric columns compact and right/center-aligned; ensure Pts stays visible (it's the
  column users scan first) — consider pinning Team + Pts and scrolling the middle stats.

### A2. Make the stats legible (current: unexplained abbreviations)
Headers are bare (`P W D L GF GA GD Pts`) and the only `Legend` entry explains the advance
color — nothing says what the letters mean.
- Add a compact key (legend row or info popover): **P** Played · **W** Won · **D** Drawn ·
  **L** Lost · **GF** Goals For · **GA** Goals Against · **GD** Goal Difference · **Pts** Points.
- Add `<th>` `title`/`abbr` tooltips and proper `scope="col"`; bold the Pts column; render GD with
  its sign (already `+N`/`N`). Sentence-case, AA contrast in both themes.

### A3. Distinct qualification colors (1st / 2nd / 3rd-advancing)
Today `annotateGroups` tags rank ≤ 2 as a single `advance` state and `StandingsRow` paints one
green rail — so 1st and 2nd look identical and advancing 3rd-place teams get no color.
- Compute three states and color each distinctly via the existing tokens:
  - **1st (group winner)** → `--status-advance` (green)
  - **2nd (runner-up)** → a clearly different advancing color (e.g. a blue/teal token — add one;
    don't reuse the green)
  - **3rd, if among the 8 best thirds** → a distinct *conditional-advance* color — recommend a
    violet/purple (add a new token, e.g. `--status-third`). Avoid gold/`--status-wildcard`: it
    reads as an award/warning rather than "conditional qualifier," and clashes with the gold
    group accents.
  - everyone else → none (optionally a faint `--status-out` for clearly-eliminated once math allows)
- `annotateGroups` must know which thirds advance globally: rank each group, then use
  `getRankedThirds(groups)` (already exists; `thirdRank ≤ 8`) to tag the qualifying third-place
  rows. Pass the state down so `StandingsRow` colors the rail (and ideally a small label/icon, so
  color isn't the only signal — accessibility).
- Update `Legend` to list all categories (Winner / Runner-up / Best 3rd / —).

---

## Part B — Bracket (make it an actual bracket)

### B1. Remove the redundant qualifier columns
Drop `ProjectedQualifiers` (Group Winners / Runners-up / Best 3rd-place) from the Bracket tab —
that information is already on the Group Stage tab (and is reinforced by A3's colors). Joe's call.

### B2. Replace the flat list with a real bracket tree
`ProjectedR32List` renders 16 rows in a column — not a bracket. Build a true left-to-right (or
scrollable) bracket: **Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final**
(+ third-place playoff), with connector lines linking each pair to the next round's slot.
- Each node = a `TeamChip` (flag + name + group), reusing existing styling; placeholders for
  unresolved slots.
- Horizontal scroll on mobile; respect reduced-motion; token-styled, light/dark. Tie group accents
  (`--group-X`) to the chips for visual continuity with the group tables.

### B3. Data the bracket needs
- **R32 skeleton already exists:** `BRACKET_SLOTS` (matches 73–88) + `resolveSlot` in
  `bracketTemplate.js`. Reuse as-is.
- **Add the fixed R16/QF/SF/Final progression tree.** Per `bracket-reference.md` §5 this is a
  fixed tree (winner of M73 vs winner of M74, etc., through M89–M104). Encode it as config like the
  R32 skeleton — **source the exact pairings from the official FIFA bracket; do not fabricate them.**
  Until results exist, later-round slots render as "Winner of M##" placeholders.
- **Third-place slots (the 8 "v 3rd" matches)** stay placeholders (`3 of {set}`) until the official
  495-scenario allocation table is loaded, exactly as `bracket-reference.md` §3 specifies. If a
  provisional assignment is shown, label it "provisional — pending official allocation."

### B4. Keep it honestly "projected"
The subtitle already says "Projected — based on current group standings." Keep that, and once real
knockout results arrive, show actual matchups/winners instead of projections.

---

## Additional suggestions (welcome changes)
- **Tiebreaker transparency.** `lib/standings.js` `cmp` sorts by points → GD → GF → name. Real FIFA
  order is points → GD → GF → **fair-play points → drawing of lots** (`bracket-reference.md` §1).
  Add a small "Tiebreakers" note so the simplified ordering isn't mistaken for official, and flag
  ties that the app can't truly break.
- **Pre-results empty state.** Before any results, every team has 0 pts and the "projection" is
  effectively alphabetical — add a "No results yet — standings update as matches are played" note so
  it isn't mistaken for real data. (Recall the backend computes standings only from finished matches.)
- **Favorites highlight.** `FavoritesContext` exists — subtly highlight favorited teams in the tables
  and bracket.
- **Accessibility.** Table `<caption>`/`scope`, don't rely on color alone for qualification (pair with
  a label/icon), and give bracket nodes `aria-label`s.

## Acceptance criteria
- Every group table shows all 8 stats with no clipping at any width; abbreviations are explained.
- 1st, 2nd, and advancing-3rd rows are each visually distinct; the legend documents them; color is
  not the sole indicator.
- The Bracket tab shows a real connected bracket (R32→Final), no qualifier columns; unresolved slots
  are clear placeholders; R16+ progression is sourced, not invented.
- Works in light/dark, reduced-motion-safe, AA contrast; `npm run build` succeeds.

## Out of scope
- Transcribing the full 495-scenario third-place table by hand (load as data per `bracket-reference.md`).
- Live in-match updating beyond the existing fetch.
