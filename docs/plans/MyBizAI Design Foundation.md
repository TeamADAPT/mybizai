# MyBizAI Design Foundation

Living notes for frontend design. Implementation: `/[lang]/design` and `apps/nextjs/src/config/brand.ts`.

## Brand feel (from mocks + logo)

- **Business**: Fifth Avenue agency gravity + autonomous AI execution (MyBizAI / ADAPT).
- **Logo**: Interlocking cobalt / orange swirl (vortex / shutter) on textured midnight.
- **Tone**: Exclusive, precise, warm action accents — not generic purple SaaS.

## Color anchors

| Token | Hex | Role |
| --- | --- | --- |
| Cobalt / Ultramarine | `#120a8f` | Brand primary, trust, deep fills |
| Cobalt soft | `#3b2fd4` | Readable cobalt on dark UI |
| Dark orange | `#ff8c00` | Primary CTAs, progress, energy |
| Gold | `#d4af37` | Rare emphasis, outlines, private-access |
| Midnight | `#070b18` | Dark canvas |
| Chalk | `#f3f5fb` | Light canvas (cool, not cream) |

### Suggestions

1. **A · Vortex (default dark)** — logo-faithful midnight + orange CTAs + gold sparingly.
2. **B · Fifth Avenue Warm** — lifted cobalt chrome, gold borders (Architecture mock).
3. **C · Dawn Contrast** — light mode: chalk background, cobalt type, orange CTAs.

## Typography

| Role | Face | Why |
| --- | --- | --- |
| Display / wordmark | Instrument Serif | Premium editorial authority from Vision / Architecture mocks |
| UI / body | Manrope | Modern geometric sans without Inter / Roboto |
| Mono | IBM Plex Mono | Tokens, hex, code |

## Theme

- Default: **dark**
- Switch: **Light · Dark · System** (`next-themes`, `ThemeSwitch`)
- CSS variables in `apps/nextjs/src/styles/globals.css`
- Tailwind: `brand.cobalt`, `brand.orange`, `brand.gold`, `font-display`

## Wireframes (v0)

1. **Marketing hero** — brand-first, one headline, one sentence, CTA group, full-bleed wash (no card clutter).
2. **Product shell** — left rail modules, top context + theme, sparse interactive surfaces, AI dock.
3. **Welcome / access** — centered private-access stack, Fifth Avenue footer credit.

## Motion (shipped)

- `animate-fade-up` — hero entrance
- `animate-mark-spin` — slow logo presence
- `animate-cta-glow` — orange CTA pulse

## Next polish

- Drop production 3D logo raster/WebP over SVG mark
- Restyle dashboard / brand-kit screens from stitch mocks onto these tokens
- Layer `@saasfly/ui` motion primitives (sparkles, glowing-effect, text-reveal) on feature sections
