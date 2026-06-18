# Accessibility — Light/Dark Mode + Text Resizing — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Add user-controlled theme (light/dark) and text size, plus the baseline a11y that makes them usable by everyone. This is a spec, not code.

## 1. Goal

A small **accessibility/settings** control that lets users:
1. Switch **theme**: Light / Dark / System (default = follow OS).
2. Adjust **text size**: a few preset steps (e.g. Small / Default / Large / X-Large).

Choices persist across sessions and apply instantly without a flash of the wrong theme.

## 2. How it's wired (state + application)

- A `SettingsContext` provider (e.g. `frontend/src/context/SettingsContext.jsx`) holds `theme` and `fontScale`, reads/writes `localStorage`, and applies them to `document.documentElement`:
  - theme → `data-theme="light"` / `"dark"` (when "System", read `prefers-color-scheme` and update live via a media-query listener; don't write a fixed value).
  - text size → a `--font-scale` custom property (e.g. `0.9 | 1 | 1.15 | 1.3`).
- **No flash (FOUC):** set the initial `data-theme` and `--font-scale` from `localStorage`/system **before React paints** — a tiny inline script in `index.html` `<head>` (or in `main.jsx` before render).
- Defaults: theme = System; fontScale = 1.

## 3. Theming (light/dark tokens)

Today `theme.css` is a single warm/glass light theme with the orange→pink page gradient. Restructure tokens so both modes share names:

- Define the existing values under `:root` / `[data-theme="light"]`.
- Add `[data-theme="dark"]` overrides:
  - Page background → a dark warm variant (e.g. deep charcoal/brown gradient or a solid dark like `#17110d`/`#221813`) instead of the bright orange gradient.
  - `--surface` / `--surface-2` → dark translucent glass (e.g. `rgba(30,24,20,0.85)` / `rgba(40,32,26,0.7)`).
  - `--text` → light (`#F5EFE9`), `--text-muted` → lightened alpha.
  - `--border` → lighter alpha so edges read on dark.
  - Keep brand accents (`--orange`, `--gold`, `--pink`) — they work on dark; verify contrast (see §5).
  - Shadows → softer/darker.
- **Leaflet map:** in dark mode swap the tile URL to a dark basemap (CARTO `dark_all`) instead of `voyager`; keep marker contrast.
- Anything currently hardcoding light values (e.g. `color:#fff`, `rgba(255,255,255,…)` panels, `.group-pill` whites) must read tokens so it flips correctly. Audit `theme.css` for hardcoded light colors.

## 4. Text resizing

- Drive type off the scale: `html { font-size: calc(100% * var(--font-scale)); }` and make sure component font sizes are in **rem** (convert the remaining `px` font-sizes in `theme.css` to rem so they scale). Spacing can stay as-is; the goal is readable text scaling.
- Preset control (buttons `A−` / `A` / `A+`, or a labeled select) with the 3–4 steps from §2; reflect the active step (`aria-pressed`).
- Ensure layouts don't break at X-Large (cards/sidebar should wrap/scroll, not clip).

## 5. Settings UI + baseline a11y (part of "usable by everyone")

- **Entry point:** an "Accessibility"/settings control in the sidebar footer (and reachable from the mobile top bar) opening a compact panel/menu — or a dedicated `/settings` route. Either way it's keyboard-reachable.
- Controls: theme (3-way) and text size (preset). Use real `<button>`s with `aria-pressed`/`aria-label`; the panel is dismissible with `Esc` and click-outside; focus is managed.
- **Contrast:** both themes must meet WCAG AA (4.5:1 body text, 3:1 large/UI). Check orange/gold text and the status colors in both modes; darken/lighten where needed.
- **Focus visibility:** add a clear `:focus-visible` outline (brand-colored) on all interactive elements — currently easy to lose on the glass UI.
- **Skip link:** a "Skip to main content" link that's visually hidden until focused, jumping to `app-main`.
- **Reduced motion:** wrap non-essential transitions/animations (card lifts, drawer, hover zooms) in `@media (prefers-reduced-motion: no-preference)`.
- Respect existing semantics (the sidebar `nav`, `aria-current` on active links).

## 6. Acceptance criteria

- A settings control toggles Light/Dark/System and 3–4 text sizes; both persist across reloads with no theme flash on load.
- Dark mode restyles the whole app (background, sidebar, cards, pills, standings colors, map tiles) with no leftover bright-light patches; light mode unchanged from today.
- Increasing text size enlarges text app-wide without clipping; layouts stay usable at X-Large.
- Keyboard: skip link works, all controls are tabbable with visible focus, settings panel is operable and dismissible.
- AA contrast verified in both themes; reduced-motion honored.
- `npm run build` succeeds.

## 7. Out of scope

- High-contrast/colorblind themes, font-family choices, localization (possible later).
- Backend changes.
