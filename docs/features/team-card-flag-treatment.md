# Team Card — Flag-as-Header Treatment — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Make the country flag part of the card's structure instead of a loose rectangle. This is a spec, not code.

## 1. Goal

On the Teams grid, the flag currently sits as a small raw `<img>` rectangle above the name (`.team-card-flag`), which looks slapped on. Replace it with a **flag-as-header** treatment: the flag fills the card's top panel *behind* the crest, softened with a scrim so the crest and text stay legible. One cohesive, broadcast-style card.

Apply the same idea to the **Team detail hero** for consistency (secondary, §4).

## 2. Files

- `frontend/src/components/TeamCard.jsx` — restructure the header.
- `frontend/src/components/Flag.jsx` — support a "backdrop" usage (cover-fill `<img>`), or render the `<img>` directly in the card.
- `frontend/src/styles/theme.css` — update the `.team-card-*` rules (the `.team-card-crest` / `.team-card-flag` blocks).
- (Optional) `frontend/src/pages/TeamDetail.jsx` + its hero CSS.

## 3. Team card — structure & styling

Restructure the card's top into a layered header:

1. **Flag layer** — the flag image absolutely filling the header, `object-fit: cover`, `aria-hidden="true"`, `loading="lazy"`. (Decorative; the `Crest`'s `alt` already names the team.)
2. **Scrim layer** — a translucent overlay for legibility and to tie into the warm glass theme. Use a soft top-to-bottom fade that lands on the card surface — e.g. `linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.6))` (tune per theme) so the flag reads but doesn't overpower, and the panel melts into the body below.
3. **Crest layer** — the existing `Crest`, centered on top (`position: relative; z-index`). To keep crests readable over busy/similarly-colored flags, sit it on a subtle **white translucent disc/rounded panel** (e.g. `background: rgba(255,255,255,0.55); border-radius: 50%/var(--radius-sm); backdrop-filter: blur(2px)`) or give it a soft drop shadow.

Then the **body** keeps only the name + group. **Remove the standalone `.team-card-flag` rectangle** — the flag is the backdrop now.

Details:
- Fixed header height (~100–112px) and `overflow: hidden` on the card so the cover-flag crops cleanly and corners stay rounded.
- **Hover:** gently scale the flag layer (`transform: scale(1.05)`) alongside the existing card lift — subtle motion, not a jump.
- **Reduced motion:** wrap the hover zoom in `@media (prefers-reduced-motion: no-preference)` so it's disabled for users who opt out.
- Keep everything on existing `theme.css` tokens (surfaces, border, radius, shadow). Crest fallback (placeholder) must still work via the `Crest` component.

Suggested DOM (illustrative, not prescriptive):
```
.team-card
  a (link)
    .team-card-header
      img.team-card-flag-bg   (flag, cover, lazy, aria-hidden)
      .team-card-scrim
      .team-card-crest (Crest on a soft disc)
    .team-card-body
      .team-card-name
      .team-card-group
```

## 4. Team detail hero (secondary, same concept)

For consistency, give the detail page hero a flag banner: the flag as a wide, scrimmed banner behind the crest + team name/abbr/group, instead of the flag sitting beside them. Same scrim + legibility approach; respect reduced motion. Keep it within the warm theme.

## 5. Refinements (apply to whichever cards show a flag)

- Consistent flag aspect via `object-fit: cover` (generated flags are 4:3 / 480×360).
- The flag chip/backdrop always has a subtle treatment (scrim, rounded corners on the panel, soft border) so it never looks raw.
- Optional polish: derive each card's accent (a thin bottom border or the crest disc tint) from the flag's dominant color, so the palette feels intentional. Nice-to-have, not required.

## 6. Acceptance criteria

- `npm run build` succeeds.
- Teams grid: each card shows its flag as a softened header with the crest centered on top and clearly legible (test light flags like Japan and busy ones like Mexico); the old loose flag rectangle is gone.
- Name + group remain readable in the body; layout consistent across all 48 cards.
- Hover gives a subtle flag zoom + card lift; disabled under `prefers-reduced-motion`.
- Crest placeholder fallback still works; flags load lazily.
- Styling uses `theme.css` tokens and matches the current warm/glass look.

## 7. Out of scope

- Changing flag/crest assets or the data model.
- Team detail content (history/roster) beyond the hero flag banner.
