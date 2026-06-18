# UI Consistency Audit & Cleanup — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Sweep the **entire** UI for inconsistent titles, fonts, and colors and bring everything onto one shared system. This is a spec, not code.

## 1. Goal

Right now styling is split between CSS classes (Teams, Venues) and ad-hoc inline styles (Standings and its components), with several different title treatments and mixed color tokens. Define one small typography + color system and apply it to every page and component so the app looks like one product.

## 2. Target system (define in `theme.css`, then apply everywhere)

**Typography roles (one class each):**
- `.page-title` — the single h1 per page. Display font (`--font-display`), 700, uppercase, brand-gradient text, `clamp(1.5rem, 3vw, 2rem)`, consistent bottom margin. (This generalizes today's `.teams-title`.)
- `.page-subtitle` — the line under the title. Body font, `--text-muted`, ~`1rem`, consistent margin. (Replaces the mix of `.lede` + `.muted` + inline subtitles.)
- `.section-title` — card/section headers (group tables, qualifier columns, venue sections). Display font, 700, uppercase, `--text-muted`, `0.85rem`, `0.05em` letter-spacing.
- Body text uses `--text`; secondary text uses `--text-muted`. No third "primary text" token.

**Color rules:**
- Every color comes from a token. **Stop using `--dark` for text** — standardize on `--text` (primary) / `--text-muted` (secondary). If `--dark` is kept, make it a strict alias of `--text`.
- Remove hardcoded `#fff`, `color: white`, `rgba(255,255,255,…)`, and `rgba(45,18,0,…)` used for text/surfaces (venue hero/detail, pills, back-link). Replace with tokens so light **and** dark modes both work. (Text that sits on a fixed colored fill may use a fixed light color, but prefer a token.)
- Verify every screen in dark mode after the change — the venue hero/detail currently assume a light background.

**Casing:** page titles and section titles uppercase; all body/UI copy sentence case (no Title Case).

## 3. Known inconsistencies to fix (from the audit)

- **Page titles:** `Home.jsx` (plain `<h1>`), `Matches.jsx`/`MatchDetail.jsx` (plain `<h1>`), `Standings.jsx` (inline-styled h1), `Venues.jsx` (uses `.teams-title`), `Teams.jsx` (`.teams-title`), `TeamDetail.jsx` (`.team-detail-name`) → all should use `.page-title` (or a documented variant). Rename `.teams-title` → `.page-title` and update all usages.
- **Subtitles:** unify `Home` (`.lede`+`.muted`), `Venues` (inline `.muted`), `Standings` (inline `<p>`) onto `.page-subtitle`.
- **Display font:** Home's h1 currently uses the body font (default `.page h1`) while every other title uses Oswald — fix via `.page-title`.
- **Inline-styled components:** `StandingsRow`, `GroupTable`, `ThirdPlaceRace`, `ProjectedQualifiers`, `ProjectedR32List`, `MatchCard`, `TeamHero` carry repeated inline color/font styles. Extract the repeated bits into classes (or at least route all colors/fonts through tokens) so they match the rest and theme correctly.
- **Section headers:** `GroupTable` header and `ProjectedQualifiers` header define their own inline title styling with slightly different values → use `.section-title`.
- **Misc:** `.back-link` hardcodes a brown rgba (breaks in dark) → token.

## 4. Scope

Every page: Home, Teams, TeamDetail, Matches, MatchDetail, Venues, VenueDetail, Standings, DesignReference. Every shared component listed above. The `DesignReference` (`/design`) page should end up as the accurate living reference for the finalized type/color system.

## 5. Acceptance criteria

- One `.page-title` / `.page-subtitle` / `.section-title` system, used by every page and section; no page defines its own one-off title styling.
- No `--dark`-for-text or hardcoded text/surface colors remain; everything is token-driven and correct in both light and dark mode.
- Titles consistent in font, size, gradient, casing, and spacing across all pages; subtitles consistent.
- `npm run build` succeeds; visual spot-check of every route in both themes shows consistent headings and readable colors.

## 6. Out of scope

- Layout/feature changes (covered by the standings and home briefs).
- New components beyond the shared title/utility classes.
