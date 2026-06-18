# Team Card — Flag Treatment B (accent bar + chip) — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Supersedes `team-card-flag-treatment.md` (the "flag-as-header" approach A — not used). This is a spec, not code.

## 1. Goal

Make the flag feel intentional, not slapped on, without putting it behind the crest. Two moves per card:

1. A thin **top accent bar** in the flag's **dominant color**, giving each card its own identity.
2. The flag as a small, **rounded, bordered chip** beside the team name (a refined version of today's raw rectangle).

The crest stays the hero on its neutral panel. This is a lighter change than approach A and stays consistent across all 48 cards.

## 2. Files

- `frontend/src/data/mockTeams.js` — add an `accent` hex per team (see §4).
- `frontend/src/components/TeamCard.jsx` — add the accent bar; move/refine the flag into a chip next to the name.
- `frontend/src/components/Flag.jsx` — support a small "chip" usage (or render the `<img>` with a chip class).
- `frontend/src/styles/theme.css` — accent bar + flag-chip styles (update the `.team-card-*` rules).

## 3. Card structure & styling

- **Accent bar:** a full-width strip (~4px) at the very top of the card, colored by the team's accent. Set the color via a CSS custom property on the card (e.g. `style={{ '--card-accent': team.accent }}`) and have the bar use `var(--card-accent)`, with `--orange` as fallback. The card already has `overflow: hidden` + radius, so the bar's corners stay clean.
- **Crest panel:** unchanged — crest centered on the existing neutral panel (`.team-card-crest`), placeholder fallback via the `Crest` component still works.
- **Body row:** a flag **chip** on the left, with the **name** and **group** stacked to its right. Replace the current loose `.team-card-flag` rectangle with the chip styling below.
- **Flag chip:** ~24×16 (3:2), `object-fit: cover`, `border-radius: 3px`, a hairline border (`0.5–1px` on `var(--border)` or a soft white), and a faint shadow so it reads as a deliberate badge, not a raw image. `loading="lazy"`; decorative (`aria-hidden` since the name is present, or `alt={team.name}`).
- **Hover (subtle):** tint the card border / a soft glow toward `var(--card-accent)` alongside the existing lift. Keep it gentle; no large motion.
- All styling on existing `theme.css` tokens; match the warm/glass look.

Suggested DOM (illustrative):
```
.team-card  (style: --card-accent: <hex>)
  a (link)
    .team-card-accent          (the 4px bar)
    .team-card-crest           (Crest, unchanged)
    .team-card-body
      .team-card-row
        img.team-card-flag-chip   (24x16, rounded, bordered, lazy)
        .team-card-meta
          .team-card-name
          .team-card-group
```

## 4. Accent color data

Each card's accent = its flag's dominant (non-white/black, saturated) color.

- Add an `accent` hex field to every team in `mockTeams.js`.
- If those values don't exist yet, derive them once: sample each flag in `assets/flags/{slug}.jpg`, pick the most frequent saturated color (skip near-white/near-black/grey), and bake the hex into the data. (This is the same dominant-color logic used when the placeholder crests were generated — reuse that approach to produce the 48 values.)
- Fallback to `var(--orange)` if a team has no `accent`.

## 5. Acceptance criteria

- `npm run build` succeeds.
- Each team card shows a top accent bar in its flag's color and a refined flag chip beside the name; the old loose flag rectangle is gone.
- Crest remains the hero with working placeholder fallback; name + group readable; layout consistent across all 48 cards (spot-check varied palettes — Brazil, Japan, Argentina, Mexico).
- Flags load lazily; hover is a subtle accent-tinted lift; styling uses theme tokens and matches the current look.

## 6. Out of scope

- Approach A (flag-as-header) — not used; ignore/remove `team-card-flag-treatment.md`.
- Changing flag/crest assets or the data model beyond adding `accent`.
- Team detail hero (can follow later with the same accent idea).
