# Home Page — Redesign — Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Target:** React app (`frontend/`), current working branch.
> Turn the placeholder Home into a real landing/dashboard for Ballon d'Or. This is a spec, not code.

## 1. Problem

Today's `Home.jsx` is a skeleton: a heading, a tagline, a dev-only "Backend status" line, and a hint. It doesn't feel like a landing page and leaks dev info. Make it a welcoming hub that orients users and routes them into the app.

## 2. Suggested content (build the recommended set; rest optional)

Recommended core:
1. **Hero** — the Ballon d'Or logo + name + a one-line tagline ("Your guide to the FIFA World Cup 2026™"), centered, on the brand surface. Use `.page-title` styling.
2. **Tournament countdown / status band** — since the tournament runs June 11–July 19 2026, show a small contextual line: a countdown to the next phase, the current matchday, or "Knockouts begin June 28" (can be static/derived from a date for now).
3. **Quick-nav cards** — a responsive grid of cards linking to the four sections: Teams, Standings, Matches, Venues. Each card: icon, title, one-line description. This is the primary navigation aid.
4. **Stat band** — a compact row of tournament facts (48 teams · 12 groups · 16 host cities · 104 matches · 3 host nations). Reads as a polished touch and reuses known data.

Optional / nice-to-have (pull in if data is handy):
- **Today's / next matches** strip reusing `MatchCard` (mock data ok).
- **Featured** snippet — e.g. a group-leaders mini-snapshot or a featured host venue with image.

## 3. Cleanup

- **Remove the "Backend status" line** from the user-facing Home (it's a dev artifact). If a connectivity check is still wanted, keep it silent/dev-only, not shown to users.
- Use the shared `.page-title` / `.page-subtitle` / card classes from `ui-consistency-audit.md`; no one-off inline styling.

## 4. Design

- Match the design system + the side-menu layout; cards use the same surface/hover treatment as Teams/Venues cards for consistency.
- Works in light and dark mode (token-driven), responsive, and respects reduced-motion for any hover/entrance animation.
- Quick-nav and stat content should be keyboard-accessible and screen-reader friendly (real links, sensible headings).

## 5. Acceptance criteria

- Home shows a hero, quick-nav cards to all four sections (working links), and a tournament stat band; no "Backend status" dev line.
- Styling uses the shared system; consistent in both themes; responsive.
- `npm run build` succeeds.

## 6. Out of scope

- Live data feeds (mock/static is fine now).
- Auth/personalization.
