# Visual Flair — "World Cup Look" — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Branch:** `api-int-TEST`. **Drafted:** 2026-06-21.
> Goal: make the app *feel* like a World Cup broadcast product without breaking the existing
> design system. This is a spec, not code.

## Constraints (read first)
- **Token-driven only.** Build on `frontend/src/styles/theme.css`. Existing palette:
  `--orange #FF6B35`, `--gold #FFB830`, `--pink #E8407A`, `--peach`, plus
  `--brand-gradient` and a warm `--page-bg` gradient (with a dark-mode variant). Display
  font is `--font-display` (Oswald). Reuse these — don't introduce new hard-coded colors.
- **Both themes.** Every change must look right in light **and** `[data-theme="dark"]`.
- **Respect accessibility settings.** The app has an accessibility settings context
  (`SettingsContext`) and a `--font-scale`. All motion must honor
  `@media (prefers-reduced-motion: reduce)` **and** any in-app "reduce motion" setting —
  animations off → static fallback, no layout shift.
- **No perf regressions.** Prefer CSS transforms/gradients over JS; keep the 390 kB JS bundle
  from ballooning. Decorative elements must be `pointer-events: none` and `aria-hidden`.

## Scope — concrete, per-surface

### 1. Tournament hero / page headers
- Give `Home` a broadcast-style hero banner: layered `--brand-gradient`, a subtle
  "FIFA World Cup 2026™" kicker in `--font-display`, and a soft animated sheen (slow,
  reduced-motion-aware). Add a lightweight trophy/star motif as an SVG accent (inline, themed
  via `currentColor`/tokens — no raster).
- Standardize `.page-title`/`.page-subtitle` across Teams/Matches/Venues/Standings with the
  display font and a small accent underline bar in `--brand-gradient`.

### 2. Group-stage color coding
- Assign each group A–L a stable accent (derive from the palette or a 12-hue token ramp).
  Use it on group pills, group table headers, and a left-border on team cards so groups are
  visually scannable. Keep contrast AA in both themes.

### 3. Team cards & crests
- Use each team's existing `accent` (from `mockTeams.js` / `TEAM_META`) as a card top-border
  or corner flash. Add a gentle hover lift (`transform: translateY` + shadow) — reduced-motion
  disables the transform. Treat flags/crests consistently (the chosen approach is
  `team-card-flag-treatment-b.md`).

### 4. Match cards — live energy
- LIVE matches: pulsing `--live` dot/badge (animation gated on reduced-motion → static dot).
- Finished vs scheduled: clear status chips using `--status-*` tokens already defined.
- Score block in `--font-display` for that scoreboard feel.

### 5. Venue explorer polish
- Map markers already use `countryColor`; add a host-country legend (USA/Canada/Mexico) and
  themed marker styling consistent with the palette.
- Detail page: a stadium-photo hero with a subtle gradient scrim and the venue name in
  `--font-display`.

### 6. Ambient texture (tasteful, optional)
- A very low-opacity pitch-lines or confetti SVG texture behind content panels, `aria-hidden`,
  `pointer-events: none`, and removed under reduced-motion / high-contrast settings.

### 7. Micro-interactions
- Consistent focus rings (keyboard-visible, token-colored), button press states, and
  pill/tab active transitions. All ≤200ms and reduced-motion-aware.

## Out of scope
- New fonts beyond the existing Oswald/system stack; heavy animation libraries; raster image
  assets; any change that only works in one theme.

## Acceptance criteria
- Home + page headers read as a World Cup broadcast product; nav/IA unchanged.
- Group color-coding is consistent across Teams, Standings, and cards, AA-contrast in both
  themes.
- LIVE state is unmistakable; all motion stops under `prefers-reduced-motion` and the in-app
  reduce-motion setting with no broken layout.
- Decorative layers are `aria-hidden` + non-interactive; keyboard focus remains clear.
- `npm run build` succeeds; bundle size stays in the same ballpark.
