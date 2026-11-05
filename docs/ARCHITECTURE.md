# Architecture

## 1. Rendering model: "content on the server, magic on the client"

```
            ┌──────────────────────── Server (static HTML at build time) ────────────────────────┐
request ──▶ │ middleware → [locale]/layout (html lang/dir, metadata, fonts)                        │
            │            → [locale]/page  → Header + Sections + Footer   (all text, links, JSON-LD) │
            └──────────────────────────────────────────────────────────────────────────────────────┘
                                   │ hydrate
            ┌──────────────────────▼──────────── Client islands ("use client") ──────────────────┐
            │ Preloader ──(asteroid:ready)──▶ Experience ──▶ lib/motion  (GSAP, Lenis, cursor)     │
            │ SceneLayer (idle) ──dynamic import──▶ lib/three (hero scene + 3D icons)              │
            │ SoundControl ──▶ lib/audio (Web Audio singleton)                                     │
            │ TicketEffects · Terminal · LiveClock · ParticleWordmark · ScrambleLinks              │
            └──────────────────────────────────────────────────────────────────────────────────────┘
```

- **Pages are statically pre-rendered** (`generateStaticParams` for `en` and `ar`). Hosting is a CDN
  file; time-to-first-byte is minimal.
- **Heavy code is code-split.** Three.js, GSAP and Lenis are loaded with dynamic `import()`, the 3D
  only after `requestIdleCallback`. First-load JS is around 116 kB.
- **Progressive enhancement.** Without JavaScript, all content, links, FAQ answers and prices still
  work. The `js` class (set in `<head>` before paint) is what turns on the hide-then-reveal animations.

## 2. Routing & i18n

| URL | Rendered from | `<html>` |
|---|---|---|
| `/` | `/en` (internal rewrite in `middleware.ts`) | `lang="en" dir="ltr"` |
| `/ar` | `/ar` | `lang="ar" dir="rtl"` |
| `/en`, `/en/*` | 308 redirect to `/`, `/*` | — |
| `www.asteroid.design/*` | 308 redirect to the apex domain | — |

- Locales live in `src/lib/i18n/config.ts`. To add a language: add it to `locales` and `localeMeta`,
  create `src/content/<code>.ts`, and register it in `src/content/index.ts`. TypeScript flags any
  missing strings.
- We **never auto-redirect by browser language**. Every language has a stable URL plus `hreflang`
  (an SEO requirement).
- RTL is handled with `dir="rtl"` and the overrides in `styles/base/rtl.css`. The 3D scene mirrors
  itself automatically (it reads `document.documentElement.dir`).

## 3. Content & config

- `src/config/site.ts`: business facts (NAP, hours, prices, socials). These feed the UI, the links,
  JSON-LD, `llms.txt` and the docs. **Keep them in sync with Google Business Profile.**
- `src/content/types.ts`: the `Dictionary` interface.
- `src/content/en.ts`, `ar.ts`: all copy, including SEO `meta`.

## 4. Client modules (framework-agnostic)

| Module | Responsibility | Entry used by |
|---|---|---|
| `lib/three/asteroid-scene.ts` | nebula, asteroid shader, orbit, debris, stars; scroll choreography via `ANCHORS` + `[data-anchor]` | `SceneLayer` |
| `lib/three/feature-icons.ts` | six 3D icons rendered into `.ico3d` slots from **one** WebGL context (scissor) | `SceneLayer` |
| `lib/three/shaders.ts` | GLSL source | the two above |
| `lib/motion/init-motion.ts` | Lenis smooth scroll, intro timeline, reveals, counters, manifesto, process rail, horizontal work gallery | `Experience` |
| `lib/motion/interactions.ts` | cursor, magnetic buttons, tilt, header hide, floating WhatsApp | `Experience` |
| `lib/audio/space-ambience.ts` | generative soundtrack + analyser (singleton `getAmbience()`) | `SoundControl`, `SceneLayer`, `Experience` |

All modules return a `dispose()` so React Strict Mode and route changes don't leak listeners or GPU memory.

### Cross-island events (`lib/env.ts → EVENTS`)

| Event | Fired by | Consumed by |
|---|---|---|
| `asteroid:ready` | Preloader (or immediately on repeat visits) | Experience (starts intro), SoundControl (shows tip) |
| `asteroid:intro` (`detail: 0..1`) | Experience intro timeline | SceneLayer (asteroid scales in) |
| `asteroid:scrollto` (`detail: selector \| "top"`) | Terminal | Experience (Lenis scroll) |

## 5. Styling

- Plain CSS, split into partials and imported once in `styles/globals.css`, in this order:
  tokens → reset → components → sections → RTL → reduced-motion.
- Each partial is scoped by its root class (`.hero …`, `.ticket …`).
- Design tokens: `styles/base/tokens.css`. Fonts are self-hosted via `next/font/local`
  (`styles/fonts.ts`) and exposed as CSS variables.

## 6. Performance budget

| Metric | Target | How |
|---|---|---|
| LCP | < 2.0 s | static HTML, preloaded display font, preloader ≤ 1 s and first visit only |
| CLS | < 0.05 | fonts with `swap` + size-adjust, fixed-size canvases, no late-injected content |
| INP | < 200 ms | WebGL in rAF with visibility pausing; icons pause off-screen |
| First-load JS | < 130 kB | Three/GSAP/Lenis code-split |

## 7. Adding a page (e.g. `/services/website-design-dubai`)

1. Create `src/app/[locale]/services/website-design-dubai/page.tsx`.
2. Export `generateMetadata` using `buildMetadata(locale, "/services/website-design-dubai")`
   (this gives the canonical URL and hreflang automatically).
3. Add the copy to the dictionaries.
4. Add the path to `PAGES` in `src/app/sitemap.ts`.
5. Link to it from the home page or footer (internal links pass authority).
