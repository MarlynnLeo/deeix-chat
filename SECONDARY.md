# DEEIX Secondary Deployment (MarlynnLeo)

This instance is a **secondary fork** maintained by MarlynnLeo.

## Own repositories

- Chat secondary: https://github.com/MarlynnLeo/deeix-chat
- Gateway secondary: https://github.com/MarlynnLeo/grok2api

## Disabled official updates

- Frontend no longer calls official GitHub `releases/latest`
- Official DEEIX / chenyme links are rebranded to MarlynnLeo repos
- Compose uses `pull_policy: never` (will not pull official images)

## Do not run

- `docker compose pull`
- Switching image tag to a newer official release

unless you intentionally abandon this secondary base.

## Frontend

Mounted secondary build from `frontend-out/` (media quick params + MarlynnLeo branding).
