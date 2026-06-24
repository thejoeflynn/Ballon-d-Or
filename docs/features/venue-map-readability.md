# Venue Map Visibility + App-Wide Text Readability — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Two pieces of demo feedback: (1) the Venue world map is hard to view, and (2) text is too small across the app, even on the largest accessibility setting. This is a spec, not code.

## 1. Goals

1. **Venue map is easy to read at a glance** — a light, high-visibility basemap with clear land/water distinction (green-ish land, blue water), no longer switching to a dark basemap in dark mode, and venue place-names readable directly on the map.
2. **App-wide text is comfortably larger** — raise the accessibility text-size range and lift the smallest text so the top setting is genuinely large. This is the primary ask; the map is the secondary one.

## 2. Context — why the current behavior fails

- **Map (`frontend/src/pages/Venues.jsx`):** uses Leaflet + CARTO raster tiles, and swaps to CARTO `dark_all` when `resolvedTheme === 'dark'`. The dark basemap plus low-contrast Voyager tiles is what testers found hard to view.
- **Map labels can't be enlarged today:** city/country names are **baked into the raster tile PNGs**, so the `--font-scale` accessibility control (and any CSS) cannot affect them. That's the core reason "the text is too small even on the largest setting" applies to the map — its labels are images, not DOM text.
- **App text:** scaling is driven by `--font-scale` on `html { font-size: calc(100% * var(--font-scale)) }` (`SettingsContext.jsx`). The preset steps are `FONT_SCALES = [0.9, 1, 1.15, 1.3]`, so the **maximum is only 1.3×** off a 16px base. Combined with **32 rules in `theme.css` below 0.8rem** (some as small as 0.62rem), even the top setting leaves a lot of text small.

## 3. Venue map — basemap

Decouple the basemap from the theme and always use one clear, light basemap regardless of light/dark mode.

- **Recommended (primary): Stadia "Stamen Terrain".** Best matches the green-land / blue-water request and gives the strongest land/water separation of the readable options.
  - Tiles: `https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png`
  - Works **keyless on localhost** (so the demo runs immediately); a **free Stadia Maps API key** is required once deployed to a real domain. Add the key via env (`VITE_STADIA_KEY`) and append `?api_key=…` when present.
  - Attribution (required): Stadia Maps, Stamen Design, OpenMapTiles, OpenStreetMap contributors.
- **No-key fallback (if we don't want to manage a key): OpenStreetMap standard.**
  - Tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Blue water, green parks/landcover, large legible labels, zero config. Land reads more beige than green. Respect OSM tile-usage policy + attribution.
- **Implementation:** remove the `resolvedTheme === 'dark'` ternary for `tileUrl`; use the single chosen basemap. Keep `{r}` retina suffix for crisp tiles on HiDPI. Keep the existing `key={resolvedTheme}` swap behavior out — the layer no longer needs to react to theme.
- **Optional future (not this brief):** for full control of exact land/water colors, move to vector tiles via MapLibre GL with a custom style. Bigger lift; only if raster options don't satisfy.

## 4. Venue map — readable place-names + markers

Make the map's own labels real DOM text so they're legible and scale with the accessibility setting.

- **Permanent labels on markers:** attach a Leaflet `tooltip` to each venue marker with `{ permanent: true, direction: 'right', className: 'venue-map-label' }` showing the city (and/or short venue name). Because tooltips are DOM, style `.venue-map-label` in **rem** so it grows with `--font-scale`. Add a white/edge halo (text-shadow or background pill) so labels stay readable over terrain.
  - Guard against clutter at low zoom: it's fine to show labels always for ~16 venues; if overlap is bad, show labels from a zoom threshold up, or only for the active country filter.
- **Markers:** keep the colored `divIcon` circles but increase contrast/size slightly for visibility (e.g. 26→30px, keep the white border + stronger shadow). Don't set marker/label font sizes in `px` — use rem so they scale.
- **Map sizing:** confirm `.venues-map-wrap` height is generous on desktop and tall enough on mobile that the basemap and labels are actually viewable (testers struggled to view it — give it room).

## 5. App-wide text size (primary)

- **Raise the preset range.** Replace `FONT_SCALES` so the steps start at "comfortable" and top out genuinely large, e.g.:
  - `[{label:'S', value:1.0}, {label:'M', value:1.15}, {label:'L', value:1.4}, {label:'XL', value:1.7}]`
  - Default = the second step (≈1.15) rather than 1.0, since 1.0 already tested as too small. Migrate any persisted `fontScale` that falls outside the new set to the nearest valid value.
- **Lift the base.** Bump base type so everything scales up even at the default: `html { font-size: calc(106.25% * var(--font-scale)) }` (17px base) — tune to taste, but the base should move up, not just the multiplier.
- **Floor the smallest text.** Audit the **32 `theme.css` rules under 0.8rem** (smallest ~0.62–0.72rem: pills, captions, stat labels, badges). Raise the floor so body-adjacent text is **≥ ~0.8rem** and incidental labels are **≥ ~0.78rem**. Keep everything in `rem` (no `px` font-sizes) so the scale reaches all of it.
- **Settings UI (`Sidebar.jsx`):** relabel the steps from `1/2/3/4` to `S/M/L/XL` (or `A−/A/A+/A++`) so the control's meaning is obvious; reflect the active step with `aria-pressed`.
- **No clipping at XL.** Verify standings rows, team/venue cards, sidebar, and the matches strip wrap/scroll rather than clip or overlap at the new maximum.

## 6. Acceptance criteria

- Venue map uses a single light, high-visibility basemap with clear green-ish land / blue water in **both** light and dark app themes (no dark basemap anymore).
- Venue place-names are readable directly on the map as DOM labels, and they grow with the text-size setting.
- The accessibility text-size control offers a meaningfully larger range; the top setting is clearly large, and the default is larger than today's 1.0.
- No app text renders below the new floor at default size; nothing clips or overlaps at XL.
- Map markers/labels and all app text scale via `--font-scale` (no `px` font-sizes left in the styles or marker/tooltip code).
- If Stadia is chosen: works on localhost with no key, and reads the key from env for deployed builds with correct attribution shown.
- `npm run build` succeeds.

## 7. Out of scope

- Vector-tile/MapLibre migration (noted as optional future in §3).
- Broader color-contrast/a11y audit beyond text size (tracked separately in `accessibility-settings.md` / `ui-consistency-audit.md`).
