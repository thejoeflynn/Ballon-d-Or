# Crests

These 48 JPGs are **original placeholder badges** — one per 2026 World Cup team — not official federation crests.

## How real crests get displayed

The app does **not** commit real federation crests as files (they're trademarked logos; bundling them is an IP risk). Instead, real crests load by URL at runtime:

- The `Team` entity has a `crest_url` field.
- The seed importer populates it from football-data.org's `crest` field (e.g. `https://crests.football-data.org/{id}.png`), the same way `flag_url` works.
- The frontend `Crest` component renders `crestUrl`. If it's `null` or the image fails to load, it falls back to the local placeholder in this folder.

So when a developer runs the seed with a valid football-data.org API key, real crests appear automatically; these placeholders cover anything the API doesn't resolve, and keep the UI complete offline.

## Naming

Files are named by the same slug as `assets/flags/`, so each crest pairs one-to-one with a flag (e.g. `brazil.jpg`, `united-states.jpg`, `dr-congo.jpg`, `curacao.jpg`).

## Replacing a placeholder with a licensed crest

If you have crests you're cleared to use, drop them in `assets/crests-source/` and they can be converted to JPG at this folder's dimensions (400×440) and swapped in by matching filename.
