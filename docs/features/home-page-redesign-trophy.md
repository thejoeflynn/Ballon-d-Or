# Home Tab Redesign — Immersive Trophy Hero — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Redesign the Home tab so the World Cup trophy photo becomes an immersive, full-tab background, with the title/countdown and key cards floating over it (mockup "Concept 2"). This is a spec, not code.

## 1. Goal

Replace today's contained hero card (`Home.jsx` → `.home-hero`) with a **full-bleed immersive hero**: the trophy-on-blue-sky photo sits behind the top of the Home tab, the brand-gradient page colour scrims up from the bottom, and the phase badge / title / countdown / a few match cards float over it as translucent "glass" elements. Below the immersive hero, the existing match strip and quick-nav grid continue on the normal page background.

This is a visual redesign only — no data, routing, or API changes. Reuse the existing phase logic, countdown, match strip, and nav-card data already in `Home.jsx`.

## 2. The background image

- **Asset:** the gold World Cup trophy held against a blue sky (open negative space on the **left**, trophy on the **right**). Joe will provide the file. **Note:** there is no `frontend/public` folder — Vite's `publicDir` is remapped to the repo-level `assets/` folder (`vite.config.js` → `publicDir: resolve(__dirname, '../assets')`), the same place `crests/` and `logos/` live. Place the image at `assets/hero-trophy.jpg`, which is served at `/hero-trophy.jpg` (exactly like `/logos/app-icon.png` today). Export a reasonable web size (~1920px wide, optimized JPG/WebP, target < ~300KB).
- **Focal point:** the trophy must stay visible on the right at all widths → `background-position: right center; background-size: cover;`. On narrow/mobile widths, shift toward the trophy (`object-position`/`background-position: 72% center`) so it doesn't get cropped out.
- **Alt/accessibility:** the image is decorative background → no `alt` needed, but keep the hero's text as real DOM (title, countdown) so it's readable by screen readers and scales with `--font-scale`.

## 3. Layout & composition (Concept 2)

- **Hero region:** a full-width block at the top of `.home-page` (edge-to-edge within the content column), roughly `min-height: 320px` desktop / `clamp(260px, 42vh, 360px)` responsive. The trophy photo is its background.
- **Text lives in the left negative space:** phase badge → title (`Ballon d'Or`, Oswald display, can wrap to two lines) → countdown label + numerals, stacked top-left.
- **Floating cards at the bottom of the hero:** 2–3 "glass" cards pulled from existing data — the next/today match cards (reuse `MatchStripCard` content) plus optionally one quick-nav shortcut (e.g. Standings). They sit at the bottom of the hero over the scrim.
- **Below the hero:** keep the existing `Today's / Up Next` match strip section and the 4-up quick-nav grid exactly as they are today, on the normal page background.

## 4. Scrim & contrast (important — readability)

Text sits directly on a photo, so contrast must be engineered, not assumed:

- **Bottom scrim:** overlay a gradient from transparent (top ~30%) → brand magenta/maroon at the bottom, e.g. `linear-gradient(180deg, rgba(60,135,166,0) 30%, rgba(138,34,72,0.55) 78%, rgba(138,34,72,0.92) 100%)`. This both anchors the floating cards and blends the photo's blue into the warm page palette so the tab feels cohesive.
- **Title/countdown legibility:** white text with a soft `text-shadow: 0 2px 10px rgba(0,0,0,0.28)`; if the sky area behind the text is too light, add a subtle left-side scrim too (`linear-gradient(90deg, rgba(0,0,0,0.18), transparent 45%)`).
- **Phase badge:** light pill (`rgba(255,255,255,0.85)` bg, dark `--dark` text) so it reads on the sky. **Badge text = the phase only** (e.g. "Group Stage") — do **not** append live counts or extra text. Keep the existing small live-dot indicator if `liveMatches.length > 0`, but the label itself stays just the phase.
- **Glass cards:** `background: rgba(255,255,255,0.16)` + `backdrop-filter: blur(3px)` + `0.5px solid rgba(255,255,255,0.3)`, white text. Ensure the scoreline/abbr meet AA against the blurred photo; if marginal, deepen the card bg or its own mini-scrim.
- Target **WCAG AA** (4.5:1 body, 3:1 large) for all hero text in the worst-case region of the photo.

## 5. Theme behavior

- The hero photo and scrim are the same in light and dark app themes (the photo is intentionally the bright moment of the page). In **dark mode**, deepen the bottom scrim toward the dark page colour (`rgba(18,8,15,…)`) instead of the light magenta so it blends into `[data-theme="dark"] --page-bg`.
- This redesign supersedes the dark/lightness of the old `.home-hero` glass card; remove or repurpose those styles.

## 6. Responsive

- **Desktop (≥900px):** full composition as above; trophy on the right, text left, floating cards along the bottom.
- **Tablet/mobile:** hero stays photo-backed but shorter; floating cards may collapse to a single horizontal scroll row or drop to just the title + countdown, with the match cards moving into the strip section below. Never let the title overlap the trophy — keep text in the left/upper area and let the bottom scrim grow.
- Verify nothing clips at the largest `--font-scale` setting (see `venue-map-readability.md`); the hero should grow in height rather than crop text.

## 7. Acceptance criteria

- Home tab opens with the trophy photo as a full-bleed hero background, trophy visible on the right at all widths.
- Phase badge shows **only** the phase label (e.g. "Group Stage"), with the existing live-dot when matches are live.
- Title, countdown, and 2–3 floating glass cards render over the photo with a bottom scrim into the brand colour; all hero text meets AA contrast.
- Existing match strip and quick-nav grid remain below the hero, unchanged in data/behavior.
- Works in light and dark themes (scrim adapts), is responsive, and doesn't clip at max text size.
- Reuses existing phase/countdown/match data from `Home.jsx`; no API or routing changes.
- `npm run build` succeeds.

## 8. Notes

- Mockup reference: "Concept 2 — immersive background" from the design review (trophy photo behind the whole hero, glass cards floating, scrim into brand colour).
- Image not yet committed; gate the hero on the asset existing, or commit the optimized file with the change. It belongs in `assets/hero-trophy.jpg` (Vite `publicDir`, served at `/hero-trophy.jpg`) — **not** `frontend/public`, which doesn't exist.
