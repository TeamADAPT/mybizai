# MyBizAI product backlog

Living roadmap. Prefer large multi-surface batches. Review on Railway staging — not localhost.

**Staging:** https://mybizai-production-63b8.up.railway.app/en  
**Direction (agent lead):** Finish the **operator core loop** before spreading into secondary marketing/account chrome. Core loop = Ideas → Research → Plan → Brand → Campaigns → Finance → Approve in Shell → Venture. Everything else either feeds that loop, waits on Clerk/data, or stays out of the product for now.

---

## Mock triage (from `/mocks`)

### Ship now — core loop (in product)

| Mock theme | Decision | Status |
| --- | --- | --- |
| Market research / competitive analysis | Keep — interactive deepen | In progress |
| Business plan editor | Keep — interactive builder | Done |
| Marketing campaign planner | Keep — interactive builder | Done |
| Financial projections | Keep — interactive builder | Done |
| Brand identity kit | Keep — already live; later wire to ventures | Done (builder) |
| AI agent marketplace + skill config / feedback | Keep — interactive install next | Stub → deepen |
| Onboarding / welcome | Keep — first-run checklist | Done |
| Academy / help tutorials | Keep — thin doors into loop | Done |
| New idea / brainstorm / personalization | Keep — **Ideas** studio | Done |
| Project tracking / empty / archive | Keep as **Ventures** (rename k8s) | Done (interactive) |
| AI platform dashboard | Fold into shell + dashboard overview | Partial |

### Next — needs Clerk / real data

| Mock theme | Decision |
| --- | --- |
| Login / signup / 2FA / password reset | Use Clerk-hosted; don’t rebuild stitch auth |
| User profile / settings (notifications, language, privacy) | Thin settings after Clerk |
| Team invite / permissions / guest access / share | After orgs |
| Billing / plans / payment / pause / cancel | After Stripe keys |
| Data import / export | After venture CRUD |
| Integrations / calendar / partners | After core loop sticky |
| Notifications / activity feed / collaboration editor | After multi-user |
| Agent customization settings | After marketplace install works |

### Later — marketing / trust (not blocking product)

| Mock theme | Decision |
| --- | --- |
| About / contact / cookie / privacy / terms | Legal pages when going public |
| Blog / news / newsletter / webinars / community forum | Insights blog exists; rest later |
| Referral / testimonials / resource library | Growth loops later |
| System status / custom report builder | Ops polish later |
| Voice command AI | Explicitly defer — novelty, not core |
| Feature tour overlay | Optional once loop is stable |
| Legal / compliance guidance | Content pack later |

### Skip as separate apps

- Duplicate “subscription plans” vs current `/pricing` — keep one pricing surface  
- Duplicate login stitch screens — Clerk  
- Quarantined Saasfly demo widgets (`_saasfly-legacy`) — do not reintroduce  

---

## Recommended sequence (where we’re going)

1. **Deepen remaining core studios** — Research interactive + Marketplace install + Ideas brainstorm  
2. **Ventures surface** — replace k8s cluster CRUD naming; empty → create → archive  
3. **Clerk on Railway** — real keys unlock private access + dashboard for real  
4. **Wire builders ↔ shell ↔ ventures** — shared mock state → then ADAPT APIs  
5. **Team / billing / import** — only after 1–4 feel sticky on staging  
6. **Marketing chrome** (about, community, referral) — when positioning for external traffic  

Do **not** parallelize voice, forum, webinars, or report-builder until the loop above is daily-drivable.

---

## Done (foundation + recent)

- Design tokens, theme, `/design`, `/shell`, pricing, auth chrome, brand kit  
- Railway staging + Postgres; Clerk Development keys live; post-login workspace gate  
- Interactive **Plan / Campaigns / Finance / Research / Marketplace / Ideas / Ventures** builders  
- Academy, onboarding, playbook doors into the loop  
- Shell module **Ventures** (was My Businesses) → `/ventures`

## Ship-now checklist

| Item | Status |
| --- | --- |
| Research interactive builder | Done |
| Marketplace interactive install | Done |
| Ideas / brainstorm studio | Done |
| Ventures (k8s → venture) empty / create / archive | Done |
| Real Clerk keys on Railway | Done |
| Wire builders ↔ shell ↔ ventures (shared state / APIs) | Done (client store + assist seam) |
| Plug real LLM into `runAssist` (`/api/assist`) | Next |
| Point Railway branch to `main` after PR merge | After merge |

## Run guidance

Cover multiple tasks per run. Lead with core-loop depth. Say no (or “later”) to secondary mocks unless they unblock Review → Approve → Execute.
