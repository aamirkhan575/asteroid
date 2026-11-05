# Asteroid — Website

Marketing website for **Asteroid**, a premium website design agency in Dubai, UAE.
Built with **Next.js 15 (App Router) + React 19 + TypeScript**, with a WebGL hero (Three.js),
GSAP/Lenis motion, a generative Web Audio soundtrack and full **English / Arabic (RTL)** support.

Every word on the page is **server-rendered** from typed content files, so Google and Bing can read
it. The 3D, motion and sound load after the content and never block it.

| | |
|---|---|
| Live URL | `https://asteroid.design` (EN) · `https://asteroid.design/ar` (AR) |
| Contact | WhatsApp / phone **+971 55 283 0119** · **hi@asteroid.design** |
| Node | ≥ 20.9 (see `.nvmrc`) |

---

## Quick start

```bash
nvm use               # Node 20+
npm install
cp .env.example .env.local
npm run dev           # http://localhost:3000  (Arabic: /ar)
```

| Script | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build (static pre-render of `/` and `/ar`) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | typecheck + lint + build. Run before every PR |
| `npm run format` | Prettier |

---

## Project structure

```
asteroid-web/
├─ docs/                      ← read these first
│  ├─ ARCHITECTURE.md         how the app is put together
│  ├─ SEO.md                  SEO implementation + growth playbook
│  ├─ CONTENT.md              editing copy, projects, prices, contact details
│  └─ DEPLOYMENT.md           Vercel / Node / Docker + launch checklist
├─ public/
│  ├─ brand/                  logo SVGs (all variants)
│  ├─ icons/                  PWA icons + brand icon sprite
│  ├─ og/                     Open Graph share images (EN/AR, 1200×630)
│  ├─ llms.txt                summary for AI answer engines
│  └─ humans.txt
├─ src/
│  ├─ app/                    Next.js routes (App Router)
│  │  ├─ [locale]/            /  (en, via middleware)  and  /ar
│  │  │  ├─ layout.tsx        <html lang/dir>, fonts, metadata, analytics
│  │  │  ├─ page.tsx          home page: assembles all sections
│  │  │  ├─ not-found.tsx     branded 404
│  │  │  └─ [...rest]/        unknown paths → 404
│  │  ├─ sitemap.ts           /sitemap.xml with hreflang alternates
│  │  ├─ robots.ts            /robots.txt
│  │  ├─ manifest.ts          /manifest.webmanifest
│  │  ├─ icon.svg             favicon
│  │  └─ apple-icon.png       iOS home-screen icon
│  ├─ components/
│  │  ├─ layout/              Header, Preloader, SoundControl, LanguageSwitch, footer/*
│  │  ├─ sections/            one file (or folder) per page section
│  │  ├─ ui/                  small reusable pieces (BrandMark, icons, SectionHead…)
│  │  ├─ three/               SceneLayer: mounts the WebGL canvases
│  │  ├─ providers/           Experience: boots motion + interactions
│  │  └─ seo/                 JsonLd, Analytics
│  ├─ config/site.ts          ★ business facts: name, phone, email, address, prices
│  ├─ content/                ★ all copy: en.ts, ar.ts (+ types.ts)
│  ├─ lib/
│  │  ├─ i18n/                locales, paths, direction
│  │  ├─ seo/                 metadata builder + JSON-LD (schema.org) builders
│  │  ├─ three/               WebGL scene, 3D icons, GLSL shaders
│  │  ├─ motion/              GSAP/Lenis choreography + pointer interactions
│  │  ├─ audio/               generative space ambience (Web Audio)
│  │  ├─ contact.ts           WhatsApp / tel / mailto link helpers
│  │  └─ env.ts               device helpers + cross-component events
│  ├─ styles/
│  │  ├─ globals.css          imports everything below, in order
│  │  ├─ base/                tokens, reset, utilities, RTL, reduced-motion
│  │  ├─ components/          header, buttons, cursor, sound, language…
│  │  ├─ sections/            one stylesheet per section
│  │  └─ fonts.ts             self-hosted fonts (next/font/local)
│  ├─ assets/fonts/           woff2 files
│  └─ middleware.ts           locale routing (/ → en, /ar → ar)
├─ next.config.ts             security headers, caching, redirects
└─ .env.example               environment variables
```

★ = the two places non-developers will edit most often.

---

## Common tasks

| I want to… | Edit |
|---|---|
| Change a headline, paragraph, FAQ or button label | `src/content/en.ts` **and** `src/content/ar.ts` |
| Change phone, WhatsApp, email, hours, prices, social links | `src/config/site.ts` |
| Add or replace a portfolio project | `content/*.ts` → `work.projects` + a preview in `components/sections/work/previews.tsx` |
| Change colours / spacing / fonts | `src/styles/base/tokens.css`, `src/styles/fonts.ts` |
| Add a new section | create `components/sections/MySection.tsx` + `styles/sections/my-section.css`, import both, add copy to `content/types.ts` + both dictionaries |
| Move where the 3D asteroid sits per section | `ANCHORS` in `src/lib/three/asteroid-scene.ts` (+ `data-anchor` on the section) |
| Tune SEO titles/descriptions | `meta` in `content/en.ts` / `content/ar.ts` |

Full guides: [`docs/CONTENT.md`](docs/CONTENT.md) · [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Environment variables

See `.env.example`. Only `NEXT_PUBLIC_SITE_URL` is needed in production; the rest are optional
(Search Console / Bing / Yandex verification tokens and the GA4 ID).

## Deploy

Recommended: **Vercel** (zero config). Import the repo, set `NEXT_PUBLIC_SITE_URL`, add the
`asteroid.design` domain. Full steps, other hosts and the post-launch SEO checklist are in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Conventions

- **TypeScript strict.** No `any`. Shared types live next to the data they describe.
- **Server first.** Components are Server Components by default. Add `"use client"` only for
  browser APIs (WebGL, audio, observers), and keep those components small ("islands").
- **Copy never lives in components.** It always comes from `src/content/*`.
- **One stylesheet per component/section**, scoped by its root class name.
- **Accessibility:** one `<h1>`, an `<h2>` per section, real links/buttons, `aria-hidden` on decoration,
  `prefers-reduced-motion` respected.
- Run `npm run check` before pushing.
