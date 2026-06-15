# Design System — Implementation Brief

> **For:** Claude Code. **Owner:** Joe (Visual Design + AI Color Commentary).
> **Branch:** `Joe`. **Scope:** Frontend only (`frontend/`). No backend changes.
> This is a spec, not code — implement the components/tokens described here.

## 1. Context

The app is the World Cup Tracker (see `PLAN.md`, `README.md`). The React skeleton already exists in `frontend/` (Vite + React Router, a `Layout`, a starter `theme.css`, placeholder pages). This brief builds the **shared design system** on top of that skeleton: design tokens, a small set of reusable components, asset wiring, and one reference screen (the team page) that proves the system.

The design system is consumed by the other feature teams (Match & Team tracking, Venue explorer), so it should be self-contained and documented.

## 2. Visual language (from Joe's reference assets)

Two assets define the direction:

- **App logo:** an orange/amber gradient abstract figure (circle + inverted triangle + base) on a dark background. This is the **app brand accent = orange**, used for app chrome (nav logo, global highlights), distinct from team colors.
- **Team page mockup:** a broadcast-style screen — a faded full-bleed team flag behind a centered national crest and a bold uppercase team name, over a **per-team accent color** (USA = royal blue), followed by a row of rounded **score cards** (one LIVE, the rest upcoming).

The guiding idea: a **neutral dark shell** + **orange brand accent** for app identity + a **per-team accent color** applied on team-specific surfaces (hero, score cards). Type is bold, condensed, uppercase for display.

## 3. Design tokens

Define these as CSS custom properties in `frontend/src/styles/theme.css` (replace the current starter tokens). Values are starting points — keep them centralized so they're easy to tune.

### Color

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a0e16` | App background (near-black navy) |
| `--surface` | `#121a2b` | Cards/panels on the base |
| `--surface-2` | `#18233a` | Raised surface / hover |
| `--border` | `rgba(255,255,255,0.12)` | Hairline borders |
| `--text` | `#f5f7fb` | Primary text |
| `--text-muted` | `#aab4c5` | Secondary text (dates, labels) |
| `--brand` | `#ff9a00` | App brand accent (orange, from logo) |
| `--brand-2` | `#ffb52e` | Brand gradient highlight |
| `--brand-gradient` | `linear-gradient(135deg, var(--brand-2), var(--brand))` | Logo glow, primary accents |
| `--live` | `#ef2b4b` | LIVE indicator (red) |
| `--team-accent` | `#1e40af` (default) | Per-team accent; **overridden per team** |
| `--team-accent-2` | `#16307f` (default) | Per-team gradient end |
| `--team-gradient` | `linear-gradient(160deg, var(--team-accent), var(--team-accent-2))` | Hero & score-card fill |

**Per-team theming:** `TeamHero` (and any team-scoped section) sets `--team-accent` / `--team-accent-2` inline from the team's colors, so every child (score cards, etc.) inherits the right palette. USA demo values: accent `#1e4fd8`, accent-2 `#13287a`.

### Typography

| Token | Value | Usage |
|---|---|---|
| `--font-body` | system sans stack (`system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`) | Body copy |
| `--font-display` | `"Oswald", "Archivo Narrow", var(--font-body)` | Headings, team names, score abbreviations |

- Add the display font via a `<link>` in `frontend/index.html` (Google Fonts: Oswald 500/600/700). Graceful fallback to the body stack if offline.
- Display text: uppercase, weight 700, slight positive letter-spacing (~0.02em).

### Radius / shadow / spacing

| Token | Value | Usage |
|---|---|---|
| `--radius-card` | `18px` | Score cards, panels |
| `--radius-sm` | `8px` | Small controls |
| `--radius-pill` | `999px` | Pills/badges |
| `--shadow-card` | `0 6px 20px rgba(0,0,0,0.35)` | Card elevation |
| spacing scale | `4, 8, 12, 16, 24, 32px` | Use consistently for padding/gaps |

## 4. Asset wiring

All static media lives in the repo-root `assets/` folder (already generated): `assets/flags/{slug}.jpg` (48 real flags) and `assets/crests/{slug}.jpg` (48 placeholder crests). The logo should live at **`assets/brand/logo.png`** — **Joe to add the actual logo file here** (not yet committed).

Make these servable by the Vite app by pointing Vite's `publicDir` at the repo-root `assets/` folder (absolute path to `../assets` from `frontend/`). Result, at runtime:

- Flags → `/flags/{slug}.jpg`
- Crests → `/crests/{slug}.jpg`
- Logo → `/brand/logo.png`

`slug` matches the flag/crest filenames (e.g. `united-states`, `australia`, `dr-congo`, `curacao`). Keep a single shared slug helper so names never drift.

> Note: this `publicDir` change copies the whole `assets/` tree into the production build. That's intended. `assets/crests/CRESTS.md` will be copied too (harmless).

## 5. Components to build

All in `frontend/src/components/`. Each should be presentational, prop-driven, no data fetching.

### `Logo`
- Renders `/brand/logo.png` plus an optional "World Cup Tracker" wordmark.
- Props: `size` (sm/md), `withWordmark` (bool).
- Used in the nav (replace the current ⚽ emoji brand in `Layout`).

### `Flag`
- Props: `slug` (string, required), `alt`, `className`.
- Renders `<img src={`/flags/${slug}.jpg`}>`. On error, hide gracefully (no broken-image icon).

### `Crest`
- Props: `slug` (required), `crestUrl` (nullable), `alt`, `size`.
- Renders `crestUrl` if provided; on null **or** image load error, falls back to `/crests/${slug}.jpg` (the local placeholder). This matches `PLAN.md` §2 (real crests by URL, placeholder fallback).

### `Pill`
- Small status badge. Props: `tone` (`live` | `neutral` | `brand`), `children`.
- `live` tone = red text/background per `--live`. Used for the "LIVE" tag.

### `Card`
- Generic rounded surface: `--radius-card`, `--shadow-card`, `--border`. Props: `as`, `className`, `children`. Base for `MatchCard` and other panels.

### `MatchCard`  *(the score card — centerpiece of the mockup)*
Two variants driven by `match.status`:

**Live variant** (`status: "LIVE"`):
- Left column: `Pill` "LIVE" (red) stacked over the clock (e.g. `17:45`) in muted small text.
- Center: two rows — home then away — each `ABBR` (display font, bold, white, large) with the score aligned to the right of the abbreviation. e.g. `USA 2` / `PAR 0`.
- Right: a circular info `(i)` button (links to match detail later; for now a styled button/affordance).
- Fill: `--team-gradient`; border `--border`; radius `--radius-card`.

**Scheduled variant** (`status: "SCHEDULED"`):
- Left column: date (e.g. `06/15`) over time (e.g. `9:00PM`), muted small text.
- Center: two rows of abbreviations (`AUS` / `USA`), no scores.
- No info button (or disabled).
- Same fill/border/radius.

Props: `match` (shape in §6), `accent` optional (else inherits `--team-accent`). Keep both variants in one component selecting on status.

### `TeamHero`  *(the top banner)*
- Full-bleed faded **flag background** (`Flag` slug) with a dark→team-accent gradient overlay so text is legible (stars-left / stripes-right look comes from the flag itself).
- Centered national **`Crest`** near the top.
- Team **name** below, uppercase, display font, bold, white, centered.
- Sets `--team-accent` / `--team-accent-2` inline from the team's colors so descendant score cards inherit them.
- Props: `team` (shape in §6).

### `Layout` (update existing)
- Swap the emoji brand for `Logo`.
- Restyle nav to the new tokens (dark shell, orange active state or underline).
- Keep existing routes/nav links.

## 6. Reference screen — Team page

Build a reference page that reproduces the mockup using the components above and **mock data** (no API). This is the living proof of the design system and a template the Team-tracking team can copy.

- Route: add `/design` (a "Style / reference" route) rendering this screen, OR render it as the `Teams` placeholder — Claude Code's choice, but keep it clearly a reference (the real Teams page is another team's deliverable). Recommended: a dedicated `pages/DesignReference.jsx` at `/design`, linked discreetly in the nav.
- Layout: `TeamHero` (United States) followed by a horizontal row/grid of `MatchCard`s.

**Mock data shape** (put in `frontend/src/data/mockTeam.js`):

- `team`: `name` ("United States"), `slug` ("united-states"), `crestUrl` (null → uses placeholder), `accent` (`#1e4fd8`), `accentEnd` (`#13287a`).
- `matches`: array of:
  - `{ id, status: "LIVE", clock: "17:45", home: { abbr: "USA", score: 2 }, away: { abbr: "PAR", score: 0 } }`
  - `{ id, status: "SCHEDULED", date: "06/15", time: "9:00PM", home: { abbr: "AUS" }, away: { abbr: "USA" } }`
  - (add 1–2 more scheduled to fill the row, per the mockup)

Match the mockup spacing: hero spans full width; cards are equal-width, rounded, in a responsive row that wraps on narrow screens.

## 7. Acceptance criteria

- `npm install && npm run build` succeeds in `frontend/`.
- `npm run dev` shows the `/design` reference screen rendering the USA team hero + score cards, visually matching the mockup (dark base, blue team gradient cards, LIVE pill in red, bold uppercase names, info icon on the live card).
- Flags and the crest placeholder load from `/flags/...` and `/crests/...`; logo loads from `/brand/logo.png` (once Joe adds the file).
- All tokens live in `theme.css`; components read tokens (no hard-coded colors in components).
- No backend calls in any of these components.

## 8. Out of scope / handoff notes

- **No backend, no real data, no commentary logic.** The AI commentary panel is a separate brief; this one is design system + visual shell only.
- The **commentary panel** will later mount into the Match-detail page (owned by the Match-tracking team) — not built here.
- The real **Teams page** belongs to the Team-tracking team; `/design` is a reference, not their implementation.

## 9. Open items for Joe

- Add the actual app logo file at `assets/brand/logo.png` (the orange figure).
- Confirm the per-team accent source (hard-coded palette per team now; could later come from `Team` data).
- Provide/confirm the display font choice (brief assumes Oswald).
