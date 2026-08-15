# MyBizAI product backlog

Living roadmap after the design-foundation PRs (#1–#5). Prefer large multi-surface batches per agent run.

## Done (foundation)

- Brand tokens, fonts, theme (Light / Dark / System), `/design`
- Marketing home, pillars, interactive `/shell`
- Pricing, auth, dashboard chrome, brand kit, i18n, admin login polish
- Mobile nav, insights blog, account shortcuts
- Operator `/playbook`, docs chrome, loaders / empty / billing polish

## Ship-now (this wave + next FE polish)

| Item | Status |
| --- | --- |
| Common `siteConfig` → MyBizAI | Done (this PR) |
| Rename `sidebar_nav_clusters` → `modules` | Done |
| Shared `BrandAuthFrame` for login / register / Clerk | Done |
| Branded loading + locale `error` panels | Done |
| Studio stubs: research / plan / campaigns / finance | Done |
| Quarantine unused Saasfly demo widgets | Done |
| Home trim (drop features-grid clutter) | Done |
| Denser billing card + light-friendly surfaces | Done |
| README rewrite (MyBizAI-first) | Done |
| Light-theme pass on remaining dark-only panels | Partial — continue |
| Auth CTA dictionary consolidation (all locales) | Next |
| Wire shell modules ↔ studio deep links both ways | Next |
| Loading screen for dashboard routes via `BrandProcessScreen` | Next |

## Product builders (mock → live)

Priority order from `mocks/` + shell modules:

1. **Market research** (`/research` stub exists) — charts, AI summary, deepen prompt → ADAPT
2. **Business plan editor** (`/plan` stub) — section approvals, venture handoff
3. **Campaign architect** (`/campaigns` stub) — channels, budget, approve gate
4. **Financial projections** (`/finance` stub) — base / stretch / conservative
5. **Brand identity kit** (live builder exists) — connect export to venture records
6. **AI agent marketplace** — skills, install, feedback loops
7. **Onboarding complete** — first-run checklist after private access
8. **Academy / help** — tutorials tied to playbook
9. **Data import / export** — mapping, confirmation, status
10. **Team invite / guest access** — Clerk orgs rename (“My Application” → MyBizAI)

## Data & ops

- Live ADAPT signals in dashboard + shell (replace mock metrics)
- k8s cluster CRUD → venture CRUD naming end-to-end
- Real Clerk / Postgres / Stripe / Resend (no placeholders)
- Dual auth cleanup (NextAuth leftovers vs Clerk)
- Deploy, webhooks, admin hardening
- PostHog + Sentry
- Clerk dashboard branding rename

## Infra / docs

- Keep this file updated when batches merge
- Design notes: `docs/plans/MyBizAI Design Foundation.md`
- Prefer ready (non-draft) PRs; branch pattern `cursor/<name>-d537`

## Run guidance

Cover **more than one task per run**: polish leftovers + one product slice + backlog updates. Do not block on Live Preview — ship screenshots / local `127.0.0.1:3000` when needed.
