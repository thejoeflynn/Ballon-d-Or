# Fix the Venue Tab (backend data + endpoints) — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Branch:** `api-int-TEST`. **Verified:** 2026-06-21.
> The React venue UI is already built and routed — the Venue tab breaks because the
> **backend serves venues with no coordinates/capacity**, which crashes the page. This is a spec, not code.

## Status (as of 2026-06-22)
Items 1–4 and 5c (16-venue set) are **done**. Remaining open work:
- `attraction-images` endpoint still returns `[]` (item 2 / section 5a–5b)
- Stadium gallery hardcodes 5 paths; venues have exactly 3 images (item 2 new finding)
- Attraction photo files have mixed extensions (.jpg, .jpeg, .png, .webp, .avif) — scan must not assume `.jpg`
- Venue detail page shows no match schedule (new item — API endpoint exists, UI never calls it)
- Venue list cards have no photo thumbnail (new item — `imageUrl` is already in the API response)

---

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

## 5. Venue map overhaul — attractions mismatch + images
> Added 2026-06-21. Decisions (from Joe): **graceful image tier now, full galleries later.**

### 5a. Why attractions mismatch (root cause)
`frontend/src/data/venueAttractions.js` is keyed by a hardcoded `1`–`14` order, and
`VenueDetail.jsx` looks them up with `VENUE_ATTRACTIONS[Number(venueId)]` where `venueId` is the
**database row id**. Venues are created by `importVenue` with auto-increment `IDENTITY` ids in
api-import order, so DB ids don't line up with the authored 1–14 order → a venue renders another
city's attractions. The (planned) `/attraction-images` endpoint returns a `string[][]` indexed the
same fragile way, so photos drift too.

### 5b. Fix: key by a stable identifier (not row id)
- Re-key attractions to the venue's **api-football `apiId`** (or a `name`/`city` slug) and resolve
  against the venue object at render time — never the DB row id. Seed venues so the venue row, its
  attractions, and its images all share that one key (ties into §1).
- **Co-locate image URLs in the data module:** give each attraction (and the stadium hero) its
  `imageUrl`(s) directly in `venueAttractions.js`, keyed by the stable id. This lets you **drop the
  positional `/attraction-images` endpoint entirely** — simpler and mismatch-proof. (Stadium photos
  can stay on `/api/venues/{id}/images` or also move client-side; prefer one approach.)

### 5c. Complete the set to 16 host venues
The data covers only **14**; add the two missing 2026 hosts — **Atlanta (Mercedes-Benz Stadium)**
and **Houston (NRG Stadium)** — with attractions + distances. Sanity-check existing entries
(e.g. Levi's mixes San Francisco landmarks ~48–50 km out with San Jose ones ~5 km — scope to the
actual host city).

### 5d. Images — graceful tier now
- Ship **one hero image per stadium** (seed `imageUrl`; easy to source) and a **styled placeholder**
  for attractions where no photo exists (the `Gallery` empty state already handles this).
- Treat full multi-photo galleries as a later enhancement; don't block the map on them.
- Keep everything keyed by the stable id so adding real photos later is a data-only change.


## 6. New items (found 2026-06-22)

### 6a. Stadium gallery 404s on images 4 and 5
`VenueController.getVenueImages` loops `i = 1..5` unconditionally. Every seeded venue has
exactly 3 stadium images. The frontend requests all 5, silently 404s on `/N/4.jpg` and `5.jpg`,
and the gallery shows dead slots because `Gallery` has no `onError` handler on `<img>`.

**Fix:** scan the actual directory instead of hardcoding a count:
```java
// Return paths for files that actually exist
Path dir = Paths.get("src/main/resources/static" + venue.getImageUrl());
Files.list(dir).filter(...).map(p -> venue.getImageUrl() + "/" + p.getFileName()).collect(...)
```
Add `onError={() => setImgErr(true)}` to the `<img>` in `Gallery` as belt-and-suspenders.

### 6b. Attraction images have mixed extensions
Attraction photo files are `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`. The planned directory
scan in item 2 / section 5b must return the actual filenames (not assume `.jpg`) and not filter
by extension.

### 6c. Venue detail: no match schedule
`VenueController.getMatchesAtVenue(id)` exists and returns the right data. `VenueDetail.jsx`
never calls it. Add a "Matches at this Venue" section: kickoff date + time, home vs away, stage,
result or "Scheduled", link to `/matches/:id`. Show "No matches scheduled" if empty.

### 6d. Venue list cards: no photo thumbnail
`imageUrl` is already in `GET /api/venues`. In `Venues.jsx`, add a `<img>` thumbnail at the top
of each venue card using `imageUrl + '/1.jpg'` (or the scan approach once 6a is done). Venues
with no `imageUrl` (NRG, Rose Bowl) fall back to the current emoji-flag layout.

---

## Acceptance criteria

- The Venues tab renders the map with all markers + the card grid; country pills filter.
- `/venues/:id` shows header (no crash), stadium gallery, attractions, and the weather widget
  (live value or graceful "unavailable").
- **Each venue shows its own city's attractions** (no cross-city mismatch), resolved by a stable
  id rather than DB row id; all **16** host venues are covered.
- Every stadium shows a hero image; attractions without a photo show a clean placeholder, not a
  broken image.
- `npm run build` succeeds (verified green on this branch as of 2026-06-21).

## Gotchas
- `importVenue` must **merge**, never blank seeded fields.
- Vite dev proxy must forward **both** `/api` and `/images` to the backend (8081) or stadium
  photos 404 in dev.
- Run backend with `mvn clean` (stale classes from sibling branches have crashed boot before).
