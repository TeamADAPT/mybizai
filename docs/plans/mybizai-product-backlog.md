# MyBizAI product backlog

Living roadmap after the design-foundation PRs (#1–#5). Prefer large multi-surface batches per agent run.

## Done (foundation)

- Brand tokens, fonts, theme (Light / Dark / System), `/design`
- Marketing home, pillars, interactive `/shell`
- Pricing, auth, dashboard chrome, brand kit, i18n, admin login polish
- Mobile nav, insights blog, account shortcuts
- Operator `/playbook`, docs chrome, loaders / empty / billing polish
- Railway staging + Postgres (https://mybizai-production-63b8.up.railway.app)

## Ship-now

| Item | Status |
| --- | --- |
| Common `siteConfig` → MyBizAI | Done |
| Shared auth / loading / error chrome | Done |
| Studio stubs + marketplace | Done |
| Research competitor matrix | Done |
| Plan / campaigns / finance interactive builders | Done |
| Academy + onboarding studios | Done |
| Light-theme shell / dashboard cards | Done (continue elsewhere) |
| Home CTA → shell / onboarding first | Done |
| Ventures empty state on dashboard | Done |
| Path B Railway coding-worker loop | Done |
| Voice studio (main) + presence surface | Done (studio = `/voice`, presence = `/voice/presence`) |
| Real Clerk keys on Railway | Next |
| Wire live ADAPT data into shell metrics | Next |
| Venture CRUD (rename k8s clusters) | Next |

## Voice presence (founder surface) — next polish

Default tonight: **studio stays main** at `/[lang]/voice`. Presence is opt-in at `/[lang]/voice/presence`.

Capture these without expanding scope tonight:

1. **Left rail menu on presence** — start in presence if we want the demo entrance, but keep a slim left menu so founders can jump without losing the orb.
2. **Orb reacts to voice** — pulsate with speaking inflections (talking only first; listening optional later). Not a static pulse.
3. **Hide typed transcript** on presence — orb + voice only in the center. No scrolling chat text in the main field.
4. **Side “written chat” button** — opens text chat when someone wants to type instead of talk; otherwise stay orb-only.
5. **Left journey buttons** — Idea / Research / Plan / Brand / Venture as compact done-state buttons (not a bottom strip). Tap jumps into that studio/part.
6. **“Back to studio / workspace” control** — clear return from presence into the full operator surface (name TBD: Studio, Workspace, or Desk).
7. **Simplify presence page** — remove leftover labels/noise so it really is “just them and the orb” unless they open a side control.

## Product builders (mock → live)

1. **Market research** — stub + matrix live; deepen → ADAPT next
2. **Business plan editor** — interactive section approve builder live
3. **Campaign architect** — interactive channels + approval gate live
4. **Financial projections** — interactive scenarios + runway chart live
5. **Brand identity kit** — connect export to ventures
6. **AI agent marketplace** (`/marketplace`)
7. **Onboarding** (`/onboarding`) — checklist live
8. **Academy** (`/academy`) — lesson doors live
9. **Data import / export**
10. **Team invite / guest access**

## Data & ops

- Live ADAPT signals in dashboard + shell
- Real Clerk / Stripe / Resend
- Dual auth cleanup
- PostHog + Sentry
- Point Railway deploy branch to `main` after merge

## Run guidance

Cover **more than one task per run**. Review on Railway staging URL — do not rely on localhost preview.
