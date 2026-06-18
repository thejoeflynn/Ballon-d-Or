# Branding — "Ballon d'Or" name consistency — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Make the product name consistently **Ballon d'Or** everywhere it's shown. This is a spec, not code.

## 1. Canonical name

- Product/app name: **Ballon d'Or** (capital B, lowercase d, straight apostrophe `'`, capital O). Not "Ballon D'or", "Ballon dOr", or "BALLON D'OR" except where the display style is uppercase (then `BALLON D'OR`).
- It replaces the old working name **"World Cup Tracker"** in all user-facing places.

## 2. Distinguish product name vs event name

- Replace only the **product name** "World Cup Tracker".
- **Keep** references to the *event* — "FIFA World Cup 2026™", "World Cup 2026", etc. (e.g., the Teams page subtitle "All 48 nations competing at FIFA World Cup 2026™" stays). Those describe the tournament, not the app.
- A good pattern: wordmark shows **Ballon d'Or** with an optional small subtitle like "World Cup 2026" so the app's purpose stays clear.

## 3. Places to update (user-facing)

- `frontend/index.html` — `<title>World Cup Tracker</title>` → `Ballon d'Or` (optionally `Ballon d'Or — World Cup 2026`).
- `frontend/src/components/Logo.jsx` — wordmark text `World Cup Tracker` → `Ballon d'Or`; `alt="World Cup Tracker logo"` → `alt="Ballon d'Or logo"`. (Consider an optional subtitle line.)
- `frontend/src/pages/Home.jsx` — `<h1>World Cup Tracker</h1>` → `Ballon d'Or` (and refresh the placeholder copy that still calls it an "architecture skeleton").
- `frontend/src/styles/theme.css` — header comment → `/* Ballon d'Or — design system tokens */`.
- Sidebar footer / any "capstone build" or app-name labels → use Ballon d'Or.
- Document meta (if any description/og tags get added later) → Ballon d'Or.

## 4. Package / project identifiers

- `frontend/package.json` `name` can become `ballon-dor-frontend` (low risk — it's not user-facing). Update `package-lock.json` name accordingly (or let `npm install` regenerate).
- **Out of scope (do not rename):** the Java backend package `com.zipcode.worldcuptracker`, Maven `artifactId` `worldcuptracker`, and class names. Renaming those is an invasive, breaking refactor for zero user-facing benefit — leave them. The repo folder is already `Ballon-d-Or`.

## 5. Acceptance criteria

- No user-facing "World Cup Tracker" remains (browser tab title, sidebar logo/wordmark, Home heading, any footer).
- Event references ("FIFA World Cup 2026", "World Cup 2026") are unchanged.
- `npm run build` succeeds; the tab title and sidebar both read "Ballon d'Or".
- Spelling is exactly `Ballon d'Or` (or `BALLON D'OR` only where the component style is uppercase).

## 6. Out of scope

- Backend package/artifact/class renames (see §4).
- Logo artwork changes (the existing app-icon stays).
