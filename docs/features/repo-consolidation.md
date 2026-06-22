# Repo Consolidation — Branches + Directory Cleanup — Implementation Brief

> **For:** Claude Code / Joe. **Drafted:** 2026-06-21 (read-only analysis; no branches or files
> were changed). This is a spec — the actual git surgery is executed by whoever runs it.
>
> **Decisions (from Joe):**
> - Canonical mainline: **`api-int-TEST` → `main`** (promote the integration branch to be `main`).
> - **Protected — do NOT delete or modify:** `api-int-TEST`, `michaelgiovannisie`, `Collin`.

## 0. Do this FIRST — sync, then snapshot
Local branches are stale vs `origin` in places (see table), so act on fresh data:
```bash
git fetch --all --prune
git tag archive/pre-consolidation-2026-06-21 api-int-TEST   # recovery point
git push origin archive/pre-consolidation-2026-06-21
```
Key divergences found locally: `origin/api-integration` is **3 commits ahead** of local
(it holds the AI-commentary work), `origin/dev` is 5 ahead of local, and **`API_Data` is
local-only (no remote)**. Don't reason about those branches until after the fetch.

---

## 1. Branch consolidation

### State vs `api-int-TEST` (analyzed 2026-06-21)
"Unique" = commits on that branch not in `api-int-TEST`. Most "unique" commits on the old
branches are **superseded scaffolding/merge history**, not new features — verify before deleting.

| Branch | Unique commits | Contains | Local vs origin | Verdict |
|---|---|---|---|---|
| **api-int-TEST** | trunk | the integrated app | in sync | 🔒 PROTECTED — source of new `main` |
| **michaelgiovannisie** | 2 | `73b0ad6` AI commentary + secrets cleanup | in sync | 🔒 PROTECTED — leave as-is (commentary source) |
| **Collin** | 6 | collin's original backend (superseded) | in sync | 🔒 PROTECTED — leave as-is |
| **main** | 0 (17 behind) | fully inside api-int-TEST | in sync | **Promote** — fast-forward to api-int-TEST (§1.1) |
| **NewCombine** | 0 | fully merged | in sync | Delete after promotion |
| **combinebranch** | 0 | fully merged | in sync | Delete |
| **api-integration** | 0 *local* | **origin +3 = the Groq commentary** | local 3 behind | Keep `origin/api-integration` until commentary is ported (see `ai-commentary.md`); then retire. Delete the stale *local* copy is fine. |
| **dupebranch1** | 5 | **venue backend + seed + images** | in sync | **KEEP** until venue work is ported (see `venues-backend-data-fix.md`); retire after |
| **dev** | 7 | scaffolding, merge history, "logos corrected" | local 5 behind | Verify nothing novel after fetch → delete |
| **Joe** | 3 | old "Frontend skeleton / file structure / plan" | in sync | Verify superseded → delete |
| **Joe2** | 8 | scaffolding + **"Bracket added, logo added"** | in sync | Verify bracket/logo already in trunk → delete; else cherry-pick first |
| **API_Data** | 6 | original REST backend (now integrated), **local-only** | no remote | Confirm integrated → delete local |

### 1.1 Promote api-int-TEST to main
```bash
git checkout main
git merge --ff-only api-int-TEST     # main is 0-ahead/17-behind, so this fast-forwards cleanly
git push origin main
```
If `--ff-only` refuses (history changed after fetch), use a no-fast-forward merge and resolve,
rather than force-pushing over a shared `main`.

### 1.2 Port the two pieces of unique work still outside the mainline
Before retiring anything, land these on `main` (each has its own brief):
- **AI commentary** from `origin/api-integration` / `michaelgiovannisie` (`73b0ad6`) → see
  `ai-commentary.md` (port section). `michaelgiovannisie` stays protected regardless.
- **Venue backend** (endpoints + seed + images) from `dupebranch1` → see
  `venues-backend-data-fix.md`.

### 1.3 Retire merged branches (only after §1.1–1.2 verified on `main`)
Never touch the three protected branches. For each branch confirmed fully contained:
```bash
git branch -d <branch>                 # -d (safe) refuses if not merged; investigate, don't -D blindly
git push origin --delete <branch>      # remote
```
Suggested deletion order once verified: `NewCombine`, `combinebranch`, `Joe`, `API_Data` (local),
then `dev`, `Joe2` after confirming their unique commits are superseded, then
`api-integration` + `dupebranch1` **after** their work is ported. Keep
`api-int-TEST` until `main` is confirmed good in CI/everyone has switched.

---

## 2. Directory cleanup

### Current mess
The repo holds **two** parallel Maven projects plus a duplicated frontend:
- Top-level `pom.xml` + `src/` — the **legacy Thymeleaf** full-stack app (8 templates under
  `src/main/resources/templates/`, JPA + Postgres + `anthropic-java` + the original
  Anthropic-based `CommentaryService`/`CommentaryController`, static `flags/crests/logos/audio`).
  Superseded by the React + REST architecture. Last touched 2026-06-18.
- `backend/pom.xml` + `backend/src/` — the **canonical REST API** (port 8081) the React app
  consumes.
- `backend/frontend/` — a **stale Vite starter scaffold** (only 7 src files: default
  `App.css`/`index.css`/`assets`, template README). NOT the real UI.
- Top-level `frontend/` — the **real React app** (41 src files: components, context, data, lib,
  pages, styles). Last touched 2026-06-19.
- Stray junk: `vite.config.js.timestamp-*.mjs` files, committed `target/` build output, a
  root-level `venue-explorer.html` (legacy Leaflet prototype).

No CI workflow or build config references either layout (`.github/` only contains the
java-upgrade tool), so restructuring is safe.

### Target layout
```
Ballon-d-Or/
├── backend/        # Spring Boot REST API (8081) — backend/src + backend/pom.xml
├── frontend/       # React + Vite app (the real one)
├── assets/         # shared flag/crest/logo source
├── docs/
├── README.md  LICENSE  .gitignore  .github/
```

### Actions
1. **Delete `backend/frontend/`** — stale scaffold, nothing references it.
2. **Remove the legacy Thymeleaf app from the mainline:** top-level `src/` and top-level
   `pom.xml`. **Archive first** so it's recoverable:
   ```bash
   git tag archive/legacy-thymeleaf main      # or the last sha that touched src/ (fd80ba1)
   git push origin archive/legacy-thymeleaf
   git rm -r src pom.xml
   ```
3. **Delete junk:** `frontend/vite.config.js.timestamp-*.mjs`, root `venue-explorer.html`
   (recoverable via the tag), and any committed `target/` directories.
4. **Gitignore build output** so it stops getting committed: add `target/`, `**/dist/`,
   `**/node_modules/`, and `.DS_Store` (the locked `dist/.DS_Store` already breaks `vite build`).
5. After removal, ensure the only Maven project is `backend/` and the only frontend is
   top-level `frontend/`; update `README.md`'s Project Structure section (currently describes the
   old `src/main/java/...` Thymeleaf layout).

### Safety checks before deleting the legacy `src/`
- **Asset parity:** confirm every file under `src/main/resources/static/{flags,crests,logos,audio,images}`
  also exists in the React app's source (`assets/` / `frontend`). The React app serves flags/crests
  from its own publicDir — verify nothing is *only* in the legacy static dir before removing it.
- **Commentary:** the legacy app contains the *Anthropic* commentary; the version being kept is the
  *Groq* one on `michaelgiovannisie`. That's intentional — just be aware you're dropping the
  Anthropic variant (recoverable via the archive tag).
- Build the survivors clean: `cd backend && mvn clean spring-boot:run` and
  `cd frontend && npm run build` (frontend build verified green on api-int-TEST 2026-06-21).

---

## 3. Recommended order of operations
1. `git fetch --all --prune` + create the archive tag (§0).
2. Promote `api-int-TEST` → `main` (§1.1).
3. Port AI commentary and venue backend onto `main` (§1.2; their own briefs).
4. Directory cleanup on `main` (§2) — tag legacy first, then remove.
5. Verify both builds + the app end-to-end.
6. Retire merged/superseded branches (§1.3), leaving `api-int-TEST`, `michaelgiovannisie`,
   `Collin` untouched.

## Out of scope
- Java 11→21 / Maven setup (env concern; see `api-health-audit.md`).
- Rewriting history on shared branches (don't force-push `main`).
- Touching the three protected branches.
