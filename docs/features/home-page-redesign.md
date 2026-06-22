# Home Page Redesign — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Branch:** `api-int-TEST`. **Drafted:** 2026-06-21.
> Elevate the home page from a static menu to a live tournament landing page, keeping the
> existing brand/design system. This is a spec, not code. Extends the Home section of
> `visual-flair-worldcup.md` (this brief wins where they overlap).

## Problem
`frontend/src/pages/Home.jsx` is currently a static menu: a text hero, four quick-nav cards
that duplicate the sidebar links, and a row of fixed trivia stats. It pulls none of the live
data the app now has, so a returning visitor has no reason to land here.

## Changes

### 1. Cut the static stat band (decided)
Remove the `home-stats` block entirely (the `48 Teams / 12 Groups / 16 Host cities /
104 Matches / 3 Host nations` row) from `Home.jsx`, plus its `.home-stats` / `.home-stat*`
rules in `theme.css`. These numbers never change, so styled as "stat cards" they imply live
data and deliver none. Do **not** relocate them. (If a live tournament-pulse row is wanted
later — matches played/remaining, goals so far, teams still alive, days to final — that's a
separate stretch and only worth it with *moving* numbers.)

### 2. Promote the countdown to a hero focal element
`tournamentStatus()` already computes the current phase and the next milestone. Surface it as
the hero's centerpiece, not the tiny muted `home-status-band` pill it is today:
- Phase badge (e.g. "Group stage · live now" / "Countdown").
- Large numerals for time-to-next-milestone — days / hrs / min — phase-aware label
  ("Round of 32 begins in…", or "Tournament kicks off in…" pre-tournament, or a
  "Concluded" state). Use `--font-display` for the numerals.
- Keep the existing animated hero sheen; respect `prefers-reduced-motion` (already wired).

### 3. Add a "Today / Up next" live match strip
New section below the hero that makes the page feel alive:
- Use `fetchMatches()` (`lib/api.js`); mapped matches expose `date`, `kickoff`, `status`
  (`LIVE`/`SCHEDULED`/`FINISHED`), `minute`, team slugs/abbrs, `stage`.
- Show **today's** matches; if none today, show the next upcoming kickoffs (cap ~3–4).
- Each card: group/stage label, status (LIVE `67'` with the existing `live-pulse`, or kickoff
  time, or full-time score), both teams with flag/crest + score. Reuse `MatchCard` styling
  where possible; link each to `/matches/:id`.
- A "All matches →" link to `/matches`. Graceful empty state if the schedule is unavailable
  (api.js already falls back to mock data).

### 4. Repurpose the quick-nav cards
They echo the sidebar, so make them earn their place: keep the four cards but add a live hook —
a count or status pulled from data (e.g. "48 nations", "N matches today", "16 stadiums") rather
than a static sentence. Keep the icon + hover lift.

## Cross-cutting polish (apply here, carry to the rest of the app)
- **Calmer canvas (judgment call):** the full-viewport saturated orange→pink→magenta
  `--page-bg` is the loudest element and competes with content. Recommend desaturating it (or
  moving to a near-neutral canvas) and reserving vivid brand color for accents/CTAs/data. If the
  vivid look is intentional, at least reduce saturation a step. Change the token, not per-page CSS.
- **Contrast to WCAG AA:** audit `--text-muted` (0.52α) over translucent surfaces over the
  background, and the gradient-clipped titles, in **both** themes; bump where they fail. Matches
  the care already shown in the accessibility settings.
- **Loading state:** replace any plain "Loading…" text on Home with a lightweight skeleton for
  the match strip (and adopt skeletons app-wide over time).

## Constraints
- Token-driven (`theme.css`); works in light + `[data-theme="dark"]`; honors reduced-motion and
  the in-app text-scale/theme settings. Keep the Ballon d'Or brand identity.

## Acceptance criteria
- The static stat band is gone (markup + CSS).
- Hero leads with a phase-aware countdown in large numerals; correct in pre-/in-/post-tournament
  states; sheen respects reduced-motion.
- A today/up-next match strip renders live data (LIVE/score/kickoff), links to match detail, and
  degrades gracefully with a skeleton + empty state.
- Quick-nav cards show a live hook, not static copy.
- Muted text and titles meet AA contrast in both themes.
- `npm run build` succeeds (verified green on this branch 2026-06-21).
