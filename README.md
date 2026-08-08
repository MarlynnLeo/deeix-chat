# deeix-chat (MarlynnLeo independent secondary)

Independent **secondary deployment package** for DEEIX Chat, maintained by **MarlynnLeo**.

- Repo: https://github.com/MarlynnLeo/deeix-chat
- Pairs with: https://github.com/MarlynnLeo/grok2api
- Official upstream: https://github.com/DEEIX-AI/DEEIX-Chat (not tracked for updates)

## What this repo contains

| Path | Description |
|------|-------------|
| `frontend-out/` | Production static frontend build (includes media quick params + official update endpoints neutralized) |
| `recovered-src/` | Recovered TypeScript sources for secondary UI (`chat-media-quick-params.tsx`, `chat-input.tsx`) from sourcemaps |
| `packages/` | Partial monorepo packages snapshot when available |
| `docker-compose.yml` | Base compose |
| `docker-compose.override.yml` | Secondary: `pull_policy: never` + frontend mount |
| `config.sqlite.example.yaml` | Example config (**no secrets**) |
| `SECONDARY.md` | Operational policy: no official updates |

> Backend runs from a pinned local/official container image. Full monorepo backend source is **not** included here because the upstream checkout was incomplete on the build host. Frontend secondary features are preserved via `frontend-out` + recovered TS sources.

## Deploy

```bash
cp config.sqlite.example.yaml config.yaml
# edit config.yaml — never commit it
docker compose up -d
```

Override mounts:

- `./frontend-out` → `/app/frontend/out`
- `pull_policy: never` so official tags are not auto-pulled

## Security

- Do **not** store admin passwords in `DEPLOYED.txt` or git
- Prefer binding to LAN-only firewall rules
- Change bootstrap admin password immediately after first login

## Secondary policy

See `SECONDARY.md`. This instance intentionally **does not** follow official release channels.

## License / attribution

DEEIX Chat is upstream open-source software. This package is a private secondary deployment artifact. Comply with upstream license and terms.
