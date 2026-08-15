# MyBizAI

Autonomous business architect from **Fifth Avenue Intelligence Group** / ADAPT.

Cobalt `#120a8f` · dark orange `#ff8c00` · gold — dark-first with Light / Dark / System.

## Product surfaces

| Route | Purpose |
| --- | --- |
| `/[lang]` | Marketing home |
| `/[lang]/design` | Design foundation |
| `/[lang]/shell` | Interactive product shell |
| `/[lang]/brand-kit` | Brand identity kit + JSON export |
| `/[lang]/research` `/plan` `/campaigns` `/finance` | Studio stubs (mock → live) |
| `/[lang]/playbook` | Operator playbook |
| `/[lang]/pricing` | Access / Architect / Fifth Avenue |
| `/[lang]/docs` `/blog` | Docs + insights |
| `/[lang]/dashboard` | Operator workspace |

Living roadmap: [`docs/plans/mybizai-product-backlog.md`](docs/plans/mybizai-product-backlog.md)  
Design notes: [`docs/plans/MyBizAI Design Foundation.md`](docs/plans/MyBizAI%20Design%20Foundation.md)

## Stack

Next.js (App Router) monorepo · Clerk · tRPC · Postgres · Stripe · Tailwind · Turborepo / Bun

Forked from [Saasfly](https://github.com/saasfly/saasfly); product and brand are MyBizAI.

## Setup

```bash
bun install
cp .env.example .env.local
# set POSTGRES_URL + real CLERK_SECRET_KEY for auth/dashboard
bun db:push
bun run dev:web
```

Open [http://localhost:3000/en](http://localhost:3000/en).

Without a real Clerk secret, marketing / design / shell / studio routes stay public; auth and dashboard need valid keys.

## Packages

- `apps/nextjs` — web app
- `packages/ui` · `auth` · `db` · `api` · `common`

## License

MIT — see [LICENSE](./LICENSE).
