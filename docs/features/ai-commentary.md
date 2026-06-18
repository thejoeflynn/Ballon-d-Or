# AI Color Commentary — Prompt & Implementation Brief

> **For:** Claude Code. **Owner:** Joe. **Branch:** current working branch.
> Pre-match, non-predictive tactical commentary, generated once per match and cached. This is a spec, not code.

## 1. Decisions (from Joe)

- **Voice:** broadcast analyst — energetic but credible, like a TV pundit before kickoff.
- **Format:** one tight paragraph, ~4–6 sentences. No headings, no lists.
- **Inputs supplied to the model:** team names + groups, plus each team's **World Cup history** and **key players / playing style**.
- **Grounding:** facts only. The model must **not invent** stats, results, or players, and must **not take a side** (no winner, no favorite, no scoreline). If a fact isn't provided, stay general rather than guessing.

Fixed from the README: pre-match only, non-predictive, cached per `match_id`, generated at seed/admin time (never on the user's request path).

## 2. The prompt

### System prompt
```
You are a football (soccer) broadcast analyst giving pre-match color commentary
for a FIFA World Cup 2026 match, in the voice of a TV analyst moments before kickoff.

Write ONE engaging paragraph of about 4–6 sentences. No headings, no bullet points,
no lists — just the paragraph.

Strict rules:
- Use ONLY the facts given in the match data. Do not add statistics, results, dates,
  player names, or any claim that is not provided. If something isn't given, keep it
  general instead of inventing specifics.
- Do NOT predict or imply an outcome: no winner, no "favorite", no "edge", no scoreline,
  no betting language. Give both teams their due and stay neutral.
- Focus on the stylistic and tactical contrast between the two sides, their World Cup
  pedigree, and what makes the matchup compelling to watch.
- Keep it spoiler-free and present-tense, as if the match has not started.
- Output only the commentary paragraph — nothing else.
```

### User message (template — fill from match data)
```
Match: {homeTeam} vs {awayTeam}
Group: {group}

{homeTeam}
- World Cup history: {homeHistory}
- Key players / style: {homeStyle}

{awayTeam}
- World Cup history: {awayHistory}
- Key players / style: {awayStyle}

Write the pre-match color commentary.
```

- Omit any line whose data you don't have (don't send empty/"unknown" — just leave it out). The system rule already tells the model to stay general when a field is absent.
- `{group}` is the group letter (or "Round of 32", etc. for knockouts).

### Model parameters
- Model: the configured Anthropic model (`api.anthropic.model`, e.g. `claude-sonnet-4-6`).
- `max_tokens`: ~250. `temperature`: ~0.6–0.7 (enough flair, still controlled).

## 3. Example (illustrative — locks tone, length, neutrality)

**Input**
```
Match: Brazil vs Croatia
Group: C

Brazil
- World Cup history: Five-time champions (1958, 1962, 1970, 1994, 2002).
- Key players / style: Fluid attacking play built on technical forwards and overlapping full-backs.

Croatia
- World Cup history: Runners-up in 2018, semi-finalists in 2022.
- Key players / style: Patient midfield control and composure in big knockout moments.
```

**Acceptable output**
> Few fixtures carry this kind of contrast in DNA: Brazil, five-time world champions, arrive with that familiar fluid attacking identity, full-backs flying forward to feed technical forwards, while Croatia bring the midfield patience and tournament composure that carried them to a 2018 final and a 2022 semi-final. The story here is tempo — Brazil wanting to stretch the game and play through the lines, Croatia happy to slow it, control possession, and dictate the rhythm from the center of the park. Watch the battle in midfield, where Croatia's calm could blunt Brazil's quick combinations, and watch Brazil's full-backs, whose positioning will shape how much space opens up. Two very different footballing philosophies, both with real World Cup pedigree, meeting on the biggest stage. This one promises a fascinating tactical chess match from the first whistle.

(Note: every concrete claim above traces to a provided fact; no winner is implied.)

## 4. Backend integration (Spring Boot)

- `CommentaryService` builds the prompt from a match's supplied data, calls the Anthropic API, and persists the result.
- Store in the `Commentary` entity keyed by `match_id` (unique). Serve from the DB thereafter — the user request path never calls the API.
- Generation trigger: a seed/admin path (e.g., the `--seed` step or an admin endpoint `POST /api/matches/{id}/commentary:generate`), not page loads. If commentary already exists for a `match_id`, do not regenerate.
- API key from config (`api.anthropic.key`); never commit it.

### Input data sourcing
- `history` (appearances, best finish, titles) — from seeded team data (best-finish data already exists in the project).
- `style` / key players — curated/seeded per team; if not reliably available for a team, omit that line (the prompt handles absence). Do not scrape players the model isn't given.

## 5. Guardrails

- **Post-generation check (recommended):** scan the output for prediction/leakage terms ("will win", "favourite/favorite", "expect … to beat", odds/scoreline patterns). If found, regenerate once; if still flagged, store flagged for review rather than displaying.
- Trim whitespace; reject empty/over-long output (enforce the one-paragraph shape).
- Keep the system prompt server-side; don't expose it to the client.

## 6. Frontend display

- A `CommentaryPanel` shows `commentary.content` on the match-detail page (the panel mounts into the match-detail slot owned by the Match-tracking team).
- States: loading (if generated lazily by admin), present (render paragraph), absent ("Pre-match analysis coming soon").
- Style with the design-system tokens; label it clearly as AI-generated analysis.

## 7. Out of scope

- Live/in-match or post-match recaps (pre-match only for now).
- Per-user or regenerated-on-demand commentary (single cached version per match).
- Predictions, ratings, or win probabilities of any kind.
