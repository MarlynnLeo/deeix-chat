# DEEIX Secondary Deployment (MarlynnLeo)

This instance is a **secondary fork package** for local customization.

## Disabled official updates

- Frontend no longer calls GitHub `releases/latest`
- Official GitHub / deeix.com links are neutralized where patched
- Compose uses `pull_policy: never` (will not pull official images)

## Do not run

- `docker compose pull`
- Switching image tag to a newer official release

unless you intentionally abandon this secondary base.

## Frontend

Mounted secondary build from `frontend-out/` (includes media quick params + update disable).

Recovered secondary sources live under `recovered-src/` for future re-integration into a full monorepo.
