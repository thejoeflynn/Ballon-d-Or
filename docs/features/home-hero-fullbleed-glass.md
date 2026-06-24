# Home Hero v2 — Full-Bleed Background + Side-Scrolling Glass Matches — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Iteration on the immersive trophy hero (`home-page-redesign-trophy.md`, now implemented in `Home.jsx` + `theme.css`). Two changes: make the hero background **truly full-bleed**, and turn the hero match cards into a **horizontal side-scrolling rail** of glass cards. Desktop only. This is a spec, not code.

## 1. What's wrong now

The hero (`.home-hero-immersive`) currently renders as a **contained, rounded, shadowed card** — it looks like the old "Concept 3" split card, not the immersive "Concept 2" we chose. Causes, all in `theme.css`:

- `.app-main > * { max-width: var(--maxw); margin: 0 auto; }` (≈line 206) caps the whole `.home-page` — and therefore the hero — at **1080px** and centers it.
- `.app-main { padding: 1.5rem 1.25rem; }` (≈line 204) insets it from the content-area edges.
- `.home-hero-immersive` itself adds `border-radius: var(--radius-card)` and `box-shadow: var(--shadow-card)` (≈lines 886, 897), which read as "card," not "background."

Net effect: the photo sits in a floating rounded box instead of filling the tab.

## 2. Goal A — full-bleed hero

The hero photo + scrims should **fill the entire content area** (the region to the right of the sidebar): flush to the top of the content area (no top gap), edge-to-edge left/right out to the window's right edge and the sidebar's right edge, with **no border-radius, no box-shadow, and no surrounding margin**. It's a background band, not a card. The remaining home sections (match rail, quick-nav grid) keep the readable centered max-width below it.

**Required outcome:**
- Hero spans the full width of `.app-main` and beyond the 1080px cap (fills wide screens completely).
- Hero touches the very top of the content area — cancel the `.app-main` top padding for the hero only.
- No rounded corners, no shadow on the hero.
- Increase presence: `min-height` ~ `clamp(420px, 52vh, 520px)`.
- Inner hero **content** (badge, title, countdown, match rail) stays readable: constrain it to the existing max-width and left-align it, so text/cards don't stretch across an ultrawide monitor. Keep the trophy anchored right (`background-position` right-of-center) and the left scrim for text contrast.

**Recommended implementation** (pick the cleaner of these; don't hack negative margins that only cancel padding but leave the 1080 cap):

- *Preferred — restructure so the hero escapes the centered wrapper.* Let the hero be a full-width band and center only the inner content. e.g. add a `full-bleed` exception so `.app-main > .home-page` no longer caps the hero: either render the hero as a direct full-width child and wrap the rest of the page in an inner `max-width` container, or add a utility:
  ```
  .app-main > .home-page { max-width: none; margin: 0; }   /* let home manage its own width */
  .home-hero-immersive { /* full-bleed band */
    margin-top: -1.5rem;            /* cancel app-main top padding */
    margin-left: -1.25rem;          /* cancel app-main side padding */
    margin-right: -1.25rem;
    max-width: none; border-radius: 0; box-shadow: none;
  }
  .home-strip-section, .home-nav-grid, .home-hero-content {
    max-width: var(--maxw); margin-left: auto; margin-right: auto;  /* re-center the readable bits */
  }
  ```
  (Exact approach is the implementer's call — the acceptance criteria below define "done," not the mechanism.)
- Verify it lines up with the sidebar edge and the window right edge with **no gap or horizontal scrollbar**.

## 3. Goal B — side-scrolling glass match rail

Replace the wrap-flow hero cards (`.home-hero-cards`, currently `flex-wrap: wrap`, showing only 2 matches) with a **horizontal scrolling rail** of glass match cards — the design Joe liked, extended.

- **Content:** show more matches — today's matches, falling back to upcoming `SCHEDULED` (e.g. up to ~8–10), rendered as `MatchStripCard … glass`. End the rail with a trailing "All matches →" link-card.
- **Behavior:** single horizontal row, `flex-wrap: nowrap; overflow-x: auto;` with `scroll-snap-type: x mandatory` and `scroll-snap-align: start` on each card. Smooth, momentum scroll. Cards keep a fixed width (e.g. `flex: 0 0 230px`) so they form a consistent rail.
- **Affordances:** style the scrollbar slim/subtle (or hide it and rely on a soft fade-mask on the right edge to signal more content). Optional but nice: left/right chevron buttons that scroll the rail by one card (`scrollBy`). Keep it keyboard- and trackpad-friendly.
- **Standings shortcut:** keep the existing `.home-hero-shortcut` glass quick-link, but **pin it outside the scroll** (to the left of the rail, non-scrolling) so the quick link always stays visible while matches scroll beside it. (Alternatively drop it here since it duplicates the nav grid — implementer's call, but pinning is preferred.)
- Since the hero now owns the matches, keep the current logic that hides the separate `.home-strip-section` when the hero is showing match cards (already in `Home.jsx` via `showStrip`).

## 4. Glass as a reusable design language (scope note)

Joe wants this frosted-glass language to potentially extend across the whole app later, but **this brief is home-page only.** To make that future rollout cheap rather than a rewrite, **extract the glass treatment into reusable tokens/utilities now** instead of leaving it inline on `.home-match-card--glass`:

- Define glass tokens in `:root` (and a `[data-theme="dark"]` variant), e.g. `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-text`, plus a `.glass` utility class that applies them (`background: var(--glass-bg); border: 0.5px solid var(--glass-border); backdrop-filter: blur(var(--glass-blur));`).
- Reimplement the hero's glass cards and the Standings shortcut on top of that `.glass` utility.
- That's all for now — **do not** restyle other tabs in this brief. A later brief can roll `.glass` out to Teams/Standings/Matches/Venues surfaces. (Flag for later: the warm page gradient + dark frosted glass combo will need a contrast pass per surface when it's applied app-wide.)

## 5. Scope / out of scope

- **Desktop only.** Mobile is explicitly out of scope for this iteration — don't invest in mobile layout, but don't crash it either (the existing `@media (max-width: 767px)` hero rules can stay as-is or be left untouched).
- No data, routing, or API changes — reuse existing phase/countdown/match data in `Home.jsx`.
- Keep AA contrast for all hero text/cards over the photo (existing dark-frosted glass already handles this; preserve it).

## 6. Acceptance criteria

- The hero photo + scrims fill the entire content area edge-to-edge and top-flush on desktop — no rounded corners, no shadow, no inset margin, no 1080px cap on the background, and no horizontal scrollbar/overflow.
- Hero inner content (badge, title, countdown, rail) stays left-aligned and width-constrained for readability on wide screens; trophy stays framed on the right.
- Hero matches render as a horizontal, scroll-snapping rail of glass cards (more than 2), with a trailing "All matches →" affordance and a usable scroll cue (fade or chevrons); the Standings quick-link remains visible (pinned).
- Glass styling is driven by shared tokens/`.glass` utility (light + dark variants), with the hero cards rebuilt on it; no other tabs restyled.
- Light/dark themes both look correct; `npm run build` succeeds.

## 7. Reference

- Chosen direction: "Concept 2 — immersive background" from the design review. Current implementation reads as the contained "Concept 3" because of the card framing + max-width cap described in §1.
