# Fix the Venue Tab (backend data + endpoints) — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Branch:** `api-int-TEST`. **Verified:** 2026-06-21.
> The React venue UI is already built and routed — the Venue tab breaks because the
> **backend serves venues with no coordinates/capacity**, which crashes the page. This is a spec, not code.

## What's already done (don't rebuild)
`frontend/src/pages/Venues.jsx` (Leaflet map + country pills + card grid),
`frontend/src/pages/VenueDetail.jsx` (galleries, weather widget, attractions), the
`/venues` and `/venues/:id` routes in `App.jsx`, and `frontend/src/data/venueAttractions.js`
all exist. The earlier `venue-explorer-react-port.md` brief (a NewCombine React port) is
**superseded** — that port is complete on this branch.

## Root cause (why the tab is blank/broken)
Venues are created **only** by `FootballDataImportService.importVenue(...)` during fixture
import. That method sets **only** `apiId`, `name`, `city`, and a default `country`. It never
sets `lat`, `lng`, `capacity`, `flag`, `countryColor`, or `imageUrl`. There is **no venue
seed** (backend has `schema.sql` only — no `data.sql`, no seed service for venues).

So `GET /api/venues` returns rows with `capacity: null`, `lat: null`, `lng: null`,
`flag: null`, `countryColor: null`. The frontend then crashes/breaks:
- `Venues.jsx` L88/L107: `v.capacity.toLocaleString()` → **TypeError on null** → the whole
  Venues page throws and renders blank.
- `Venues.jsx` L82: `position={[v.lat, v.lng]}` = `[null, null]` → Leaflet markers error.
- `markerIcon(v.countryColor)` → undefined color.
- `VenueDetail.jsx` L158/L189: `venue.capacity.toLocaleString()` → same TypeError.

Three endpoints the UI calls also don't exist yet (these are *handled gracefully* — they
404 and the UI degrades — so they're secondary, not the crash):
`GET /api/venues/{id}/images`, `/weather`, `/attraction-images`.
Also `getVenues()` ignores the `?country=` param, so the country filter returns everything.

## The fix

### 1. Seed the host venues with full data (primary fix)
Provide the World Cup 2026 host stadiums with complete fields:
`name, city, country, flag (emoji), capacity, lat, lng, countryColor, imageUrl`, plus the
api-football `apiId` where known. Two acceptable approaches:
- **`data.sql` seed** under `backend/src/main/resources/` (simplest, runs on boot), **or**
- a **`VenueSeedService`** (mirrors `SampleDataService`) run from an admin endpoint.

Then make `importVenue(...)` **enrich, not overwrite**: when a fixture's venue matches a
seeded venue (by `apiId`, else by name+city via the existing
`findByNameAndCity`), keep the seeded `lat/lng/capacity/flag/countryColor/imageUrl` and only
fill blanks. Never null-out populated fields.

> The venue records (with coords, capacity, country colors, attractions) already exist on
> `dupebranch1` (`data.sql` seeds 14 venues + the `VENUE_ATTRACTIONS` data, already ported to
> `frontend/src/data/venueAttractions.js`). Reuse those values as the seed source of truth;
> add any remaining 2026 host venues to reach the full set.

### 2. Add the three missing endpoints (port from `dupebranch1`)
Bring `VenueController` + `VenueService` logic over so these resolve:

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/venues/{id}/images` | `string[]` stadium photo URLs |
| GET | `/api/venues/{id}/weather` | `{ tempF, windMph, code, label, icon }` (Open-Meteo, no key) |
| GET | `/api/venues/{id}/attraction-images` | `string[][]` photo-sets, indexed to `venueAttractions.js` order |

Static images live under `backend/src/main/resources/static/images/**`; carry those folders
over too (none exist on this branch yet). Weather needs outbound network and must return
`{}` on failure (the widget already handles the empty case).

### 3. Implement the country filter
`getVenues()` should honor `?country=USA|Canada|Mexico` (e.g. `findByCountry`) and return all
when absent.

### 4. Defensive frontend null-guards (belt-and-suspenders)
Even after seeding, guard against nulls so one bad row can't blank the page:
`(v.capacity ?? 0).toLocaleString()`, skip markers where `lat == null || lng == null`, and
default `countryColor` to a token color. Apply in both `Venues.jsx` and `VenueDetail.jsx`.

## Acceptance criteria
- `GET /api/venues` returns all host venues with non-null `lat/lng/capacity/flag/countryColor`.
- The Venues tab renders the map with all markers + the card grid; country pills filter.
- `/venues/:id` shows header (no crash), stadium gallery, attractions, and the weather widget
  (live value or graceful "unavailable").
- `npm run build` succeeds (verified green on this branch as of 2026-06-21).

## Gotchas
- `importVenue` must **merge**, never blank seeded fields.
- Vite dev proxy must forward **both** `/api` and `/images` to the backend (8081) or stadium
  photos 404 in dev.
- Run backend with `mvn clean` (stale classes from sibling branches have crashed boot before).
