# Venues — Fixes & Polish Brief

> **For:** Claude Code. **Owner:** Joe. **Drafted:** 2026-06-22.
> A collection of concrete bugs and gaps in the Venues tab, each with a clear
> acceptance criterion. Fix them in order of difficulty (quick wins first).

---

## 1. Attraction photos never load (backend returns empty list)

`GET /api/venues/:id/attraction-images` always returns `[]` — the controller
has a `// Static images not yet on this branch` comment and a hardcoded
`return List.of()`.

The files **are already there** at
`backend/src/main/resources/static/images/attractions/{venueId}/{attractionIdx}/`,
numbered `1.jpg`, `2.jpg`, `3.jpg` per attraction slot (attractions are
1-indexed to match the JS array). Some files are `.png`, `.webp`, `.avif`,
or `.jpeg` instead of `.jpg`; a few have no extension at all.

**Fix:**
- In `VenueController.getAttractionImages(id)`, scan the filesystem for
  `static/images/attractions/{id}/{1..N}/` and return URL paths for any
  files found.
- Handle mixed extensions (jpg, jpeg, png, webp, avif) — either stat each
  candidate in order, or list the directory and return whatever is there.
- Venues 15 (NRG) and 16 (Rose Bowl) have no attraction folders; return
  empty sublists for them.
- The `List<List<String>>` shape is correct — one inner list per attraction.

**Acceptance:** clicking an attraction pill on any venue detail page shows
its photo(s) in the gallery.

---

## 2. Stadium gallery always tries exactly 5 images and 404s silently

`VenueController.getVenueImages(id)` returns 5 hardcoded paths
(`/images/USA/ATT/1.jpg` … `5.jpg`) regardless of how many files exist.
All venues actually have exactly 3 stadium images. The frontend requests all
5, gets a 404 on 4.jpg and 5.jpg, and the `<img>` elements silently fail
(no `onError` handler on the gallery image).

**Fix:**
- Change the loop to scan the actual directory (or cap at 3 for now — every
  venue with images has exactly 3). Preferred: scan and return only paths
  that exist so it works if more images are added later.
- Add an `onError` handler to `<img>` in the `Gallery` component in
  `VenueDetail.jsx` so broken images don't leave dead slots in the gallery.

**Acceptance:** the gallery for AT&T Stadium shows exactly 3 photos with no
broken-image icons.

---

## 3. Attraction images have mixed extensions — frontend assumes `.jpg`

Some attraction photo files are `.png`, `.webp`, `.avif`, or `.jpeg`.
The backend should return the real filename (or URL) rather than assuming
`.jpg`, so the frontend `<img src="...">` resolves correctly regardless of
format.

This is mostly handled if Fix 1 is done by listing the directory instead of
guessing filenames. Just make sure the returned paths include the correct
extension.

---

## 4. Two venues have no stadium images (NRG, Rose Bowl)

Venues 15 and 16 have `imageUrl = ""` in the seed, so
`getVenueImages` returns `[]`. The `Gallery` component already handles
empty gracefully (shows the `🏟️` placeholder). **No code change needed
here** — just document it so it's not mistaken for a bug.

If real photos are added later, set `imageUrl` in `VenueSeedService` and
restart the backend; the scan-based fix from item 2 will pick them up
automatically.

---

## 5. Venue detail page: no match schedule

`VenueController.getMatchesAtVenue(id)` exists and returns the correct data,
but `VenueDetail.jsx` never calls it — there's no fixture list on the page.

**Fix:** add a "Matches at this Venue" section to `VenueDetail.jsx` below
the Stadium Gallery. Each row: kickoff date + time, home vs away (with
abbreviations), stage label, result or "Scheduled". Link to `/matches/:id`.
Show "No matches scheduled" if the list is empty. Keep it lightweight —
a simple table or card list, no new components needed.

---

## 6. Venue list cards: no photo thumbnail

The `Venues.jsx` grid shows emoji flag + name + city + capacity. Adding a
small thumbnail (stadium photo, `object-fit: cover`) would make the list
feel richer and let visitors identify venues visually before clicking
through.

**Fix:** in `Venues.jsx`, for each venue that has a `imageUrl`, render an
`<img src={v.imageUrl + '/1.jpg'}>` thumbnail. Style it at about
`180×100px` within the card, full-width at the top. Venues with no imageUrl
(NRG, Rose Bowl) fall back to the current emoji-flag layout.

This requires no backend change — `imageUrl` is already in the venue object
returned by `GET /api/venues`.

---

## 7. Minor: venue card on list page shows nothing when map is loading

When the filter changes, `loading = true` and the map shows
`"Loading map…"` but the card grid below still renders the stale venue list.
This is harmless but can look odd if the grid updates a moment later.
Optionally: show a subtle opacity on the grid while loading, or move
`setVenues([])` to the start of the effect so the grid clears with the map.

---

## Constraints

- All file scanning must use `java.nio.file.Files` / `Path` — not hardcoded
  counts or hardcoded extensions.
- Backend serves static files from `src/main/resources/static/`; the URL
  prefix is `/` (no `/static/` in the URL), so a file at
  `static/images/USA/ATT/1.jpg` is served at `/images/USA/ATT/1.jpg`.
- Token-driven CSS; no inline style for layout concerns.
- `npm run build` must pass.
