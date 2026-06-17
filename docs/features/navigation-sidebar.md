# Navigation → Side Menu (React) — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), `combinebranch`.
> **Supersedes** the top-nav described in `design-system.md` §5 (Layout). This is a spec, not code.

## 1. Goal

Replace the current top nav bar (`frontend/src/components/Layout.jsx`) with a **persistent left side menu** — better organization as sections grow (Home, Teams, Matches, Standings, Venues, Style). Keep all existing routes; only the nav presentation changes.

## 2. Layout structure

- Restructure `Layout` into a two-column shell: a left `<aside class="sidebar">` + a scrollable `<main class="app-main">` (wrap the `<Outlet/>`). `.app-shell` becomes `display:flex; flex-direction:row;`.
- Consider extracting a `Sidebar` component (`components/Sidebar.jsx`) to keep `Layout` thin.

### Sidebar (desktop)
- Fixed left column, width ~220px, full viewport height, `background: var(--surface)`, `border-right: 1px solid var(--border)`.
- **Top:** the `Logo` (icon + wordmark stacked or inline).
- **Nav:** vertical list of `NavLink`s — Home, Teams, Matches, Standings, Venues, Style. Each: optional leading icon + label, comfortable padding, `--radius-sm`, hover `background: var(--surface-2)`.
- **Active state:** use `aria-current`/`is-active` → a left accent bar in `--brand` plus brand-tinted text/background (replace the current text-only active style with something clearly readable in a vertical list).
- **Bottom:** small muted footer (version / "capstone build").

### Main area
- Fills remaining width; independent vertical scroll; keep the existing `--maxw` content max-width and centering *inside* `main` so wide pages (the 12-group standings grid) still breathe.

## 3. Responsive

- **< ~768px:** collapse the sidebar. Show a slim top bar with the `Logo` and a hamburger button; tapping it opens the sidebar as an **overlay drawer** (slide-in from left with a scrim). Close on link click, scrim click, and `Esc`.
- Persist nothing fancy — local state is fine. Body scroll lock while the drawer is open is a nice touch.

## 4. Icons (optional)

Icons make a vertical menu read better. Either add a lightweight set (`lucide-react`) or inline a few simple SVGs. Keep optional — labels alone are acceptable for v1.

## 5. Styling / tokens

All colors via existing `theme.css` tokens (`--surface`, `--surface-2`, `--border`, `--brand`, `--text`, `--text-muted`, radii). Add sidebar/drawer classes to `theme.css`; update `.app-shell` and remove/retire the old `.app-header`/`.nav` top-bar rules (or repurpose `.app-header` for the mobile top bar).

## 6. Accessibility

- `<nav aria-label="Main">` landmark; `aria-current="page"` on the active link.
- Hamburger is a `<button aria-expanded>` controlling the drawer; focus moves into the drawer when open and returns on close; visible focus states throughout.

## 7. Acceptance criteria

- `npm run build` succeeds; all existing routes work, now via the sidebar.
- Desktop: persistent left menu with clear active highlighting; content area scrolls independently and standings/bracket still lay out well.
- Mobile: hamburger opens an overlay drawer; closes on link/scrim/Esc.
- Uses theme tokens only; visually consistent with the design system. No layout regressions on Standings/Teams/etc.

## 8. Out of scope

- Page content changes (covered by their own briefs, e.g. `teams-page.md`).
- The Thymeleaf app's nav (separate; mirror later only if requested).
