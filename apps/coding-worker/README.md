# Coding worker (Path B)

Disposable Railway worker that executes one coding task at a time.

## Contracts

- `Task` / `Worker` / `Result` shapes in `src/types.js` + `src/store.js`
- `CodingAgent` providers in `src/providers.js` (`grok` | `stub`)

## API

- `GET /health`
- `GET /v1/worker`
- `POST /v1/tasks` (Bearer `CODING_WORKER_SECRET`)
- `GET /v1/tasks/:id`

## Required env

- `GITHUB_TOKEN` — **durable PAT** (Contents + Pull requests write). Short-lived GitHub App installation tokens can push branches but usually cannot `createPullRequest`.
- `XAI_API_KEY` — Grok coding agent
- `CODING_WORKER_SECRET` — shared with MyBizAI
- `REPO_URL` (optional) — default `https://github.com/TeamADAPT/mybizai`
- `BASE_BRANCH` (optional)
- `APP_TARGET` (optional) — e.g. `http://mybizai.railway.internal:8080`
- `CODING_AGENT_PROVIDER` — `grok` | `stub`

## Path A vs Path B

Same brief from MyBizAI voice:

- **Path A** — copy into local Grok Build (SuperGrok subscription)
- **Path B** — `POST` to this worker (API-key billed)

## Tonight success

Submit one task → worker opens a PR. Prefer Railway PR environments for verification.
