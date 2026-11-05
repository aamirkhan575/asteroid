# SEO: implementation & growth playbook

> **Honest expectations:** code makes the site *eligible* to rank. Rankings for competitive terms like
> "website design Dubai" are won over **3–9 months** through local signals (Google Business Profile,
> reviews), content depth and backlinks. This document covers both what is already built and the plan
> to win.

---

## 1. Target keywords → where they live

| Keyword (EN) | Arabic equivalent | Intent | Primary placement today | Dedicated page to build next |
|---|---|---|---|---|
| website design in Dubai / website design Dubai | تصميم مواقع في دبي | Commercial, local | `<title>`, H1 kicker, Expertise H2 + service card, FAQ #1, JSON-LD `serviceType` | `/services/website-design-dubai` |
| website design in UAE | تصميم مواقع في الإمارات | Commercial | Title, meta description, Expertise card "Website design across the UAE", areas list, FAQ | `/website-design-abu-dhabi`, `/website-design-sharjah` |
| 3D website | مواقع ثلاثية الأبعاد | Commercial / inspiration | Title, description, Expertise card "3D website design", FAQ "Do you build 3D websites?", Signature plan | `/services/3d-website-design` |
| premium design agency | وكالة تصميم فاخرة | Brand / commercial | H1 kicker "Premium website design agency in Dubai", Expertise H2, OG alt | — (home page) |
| best website design agency | أفضل شركة تصميم مواقع | Comparison | Expertise paragraph (natural use, no unsupported claim) | Blog: "How to choose the best website design agency in Dubai" |

**Rules:** one primary keyword per page, used in the title, H1/H2 and the first 100 words. Write for
people first, and never stuff keywords. **Don't claim "#1" or "the best"** without independent proof
(awards, rankings). It hurts trust and can breach UAE advertising rules. Let reviews and awards say it.

---

## 2. What's implemented (technical & on-page)

### Indexing & crawlability
- [x] Fully **server-rendered HTML** (static pre-render). All copy, prices, FAQ answers and links are in
      the HTML without JavaScript.
- [x] `robots.txt` allows all search engines and AI answer engines (GPTBot, PerplexityBot, ClaudeBot,
      Google-Extended…) and points to the sitemap.
- [x] `sitemap.xml` with **hreflang alternates** and image entries.
- [x] **Canonical URLs**, one host (www → apex, `/en` → `/`, all permanent 308 redirects).
- [x] Branded **404** with `noindex` that links back home.
- [x] `llms.txt`: a clean summary for AI assistants and answer engines (GEO / AEO).

### International (EN / AR)
- [x] Separate URLs: `/` (English) and `/ar` (Arabic). No auto-redirects.
- [x] `hreflang` `en-AE`, `ar-AE`, `x-default` in both `<head>` and the sitemap.
- [x] `<html lang dir>` set per locale. The Arabic page is a real translation with its own title and
      description, not machine-swapped text.

### On-page
- [x] Unique `<title>` (≈60 chars) and meta description (≈150 chars) per language.
- [x] Exactly **one H1** containing the primary keyword phrase (visible kicker, no hidden text) and a
      logical H2 per section, H3 for items.
- [x] Semantic landmarks: `header`, `nav`, `main`, `section[aria-labelledby]`, `footer`, `address`;
      skip-link.
- [x] **Expertise section**: around 300 words of useful, keyword-relevant copy (services, areas served).
- [x] FAQ written around real search questions ("How much does website design cost in Dubai?").
- [x] Descriptive link labels (`aria-label="Fasset — Visit live site"`) and external links with
      `rel="noopener"`.

### Structured data (JSON-LD `@graph`, `lib/seo/structured-data.ts`)
- [x] `Organization` + `ProfessionalService` (a LocalBusiness subtype): name, logo, phone, email,
      Dubai address, geo, opening hours, `areaServed` (all emirates + GCC), `priceRange`, `knowsAbout`,
      `knowsLanguage`, `sameAs`, `hasOfferCatalog` (the 3 packages with AED prices).
- [x] `WebSite`, `WebPage` (with `BreadcrumbList` and `speakable`), `Service`, `FAQPage`, and an
      `ItemList` of portfolio `CreativeWork`s.
- ℹ️ Since 2023 Google shows FAQ rich results mainly for government and health sites. The FAQ markup
  still helps Google, Bing and AI engines understand the page, but don't expect FAQ dropdowns in Google.

### Social & sharing
- [x] Open Graph + Twitter cards, 1200×630 share images per language (`/public/og`), with `og:locale`
      and alternates.

### Local SEO signals in code
- [x] Consistent **NAP** (name, address, phone) from `config/site.ts` in the footer `<address>`,
      JSON-LD and `llms.txt`.
- [x] `geo.region` / `geo.position` meta and `GeoCoordinates`.

### Performance (Core Web Vitals are a ranking signal)
- [x] Static HTML on a CDN, self-hosted fonts (`next/font/local`, `display: swap`, preload).
- [x] Three.js, GSAP and Lenis code-split; WebGL starts on `requestIdleCallback`, pauses in hidden tabs
      and off-screen.
- [x] Preloader is under 1 s, shown on the first visit per session only, with a CSS fail-safe.
- [x] Security headers (HSTS, nosniff, referrer policy, permissions policy) and immutable caching for
      static assets.
- [x] `prefers-reduced-motion` disables smooth scroll and animations.

### Measurement hooks
- [x] Search Console / Bing / Yandex verification via env vars.
- [x] Optional GA4 (`NEXT_PUBLIC_GA_ID`) that auto-tracks **`whatsapp_click`, `phone_click`,
      `email_click`**. Mark these as *Key events* in GA4: they are your conversions.

---

## 3. Launch-day checklist

1. Deploy with `NEXT_PUBLIC_SITE_URL=https://asteroid.design`.
2. **Google Search Console**: add a *Domain* property (DNS TXT), submit `https://asteroid.design/sitemap.xml`,
   then use URL Inspection → *Request indexing* for `/` and `/ar`.
3. **Bing Webmaster Tools**: *Import from Google Search Console* (one click). Bing also powers
   DuckDuckGo, Yahoo, Ecosia and ChatGPT search.
4. Validate structured data at <https://search.google.com/test/rich-results> and <https://validator.schema.org>.
5. Test the share cards: LinkedIn Post Inspector, Facebook Sharing Debugger, WhatsApp (paste the link).
6. Run PageSpeed Insights on mobile. Target 90+ for Performance, Accessibility, Best Practices and SEO.
7. Turn on GA4 and mark the three click events as Key events.

---

## 4. Local SEO: the biggest lever for "website design Dubai"

**Google Business Profile** (business.google.com). This is what wins the map pack.
- Category: **Website designer** (primary). Secondary: *Web hosting company* only if you offer it,
  *Graphic designer*, *Marketing agency*.
- Service-area business: hide the street address if there's no public office, and set the service
  areas to Dubai, Abu Dhabi, Sharjah, Ajman and RAK.
- NAP must match the site exactly: **Asteroid · +971 55 283 0119 · hi@asteroid.design · Dubai**.
- Hours: Sun–Fri 09:00–20:00. Website: `https://asteroid.design`. Add a WhatsApp chat button.
- Services: list each package with its AED price. Add 10+ photos and project screenshots.
- **Reviews:** ask every happy client and reply to all reviews. Aim for 10 reviews in the first
  90 days. Velocity and recency matter.
- Post weekly (a project, a tip, an offer).

**Citations** (same NAP everywhere): Yellow Pages UAE, Connect.ae, Dubai Chamber directory, Clutch,
DesignRush, GoodFirms, Sortlist, Behance, Dribbble, LinkedIn company page, Apple Business Connect and
Bing Places.

---

## 5. Content plan (topical authority)

Build these pages, in this order. Each one is 800–1,500 words, in English and Arabic, with FAQs and
internal links back to the home page and pricing.

1. `/services/website-design-dubai`: the money page. Process, pricing, Dubai case studies, FAQ.
2. `/services/3d-website-design`: what 3D/WebGL sites are, when they pay off, demos (link the live projects).
3. `/website-design-abu-dhabi`, `/website-design-sharjah`: genuinely local pages with local projects. Avoid
   near-duplicate city pages; Google treats copy-paste location pages as doorway pages.
4. `/work/<project>`: one case study per project (problem → solution → result), with screenshots and
   a client quote when you have permission.
5. `/pricing`: website cost guide for the UAE.
6. Blog (two posts a month), for example:
   - "How much does a website cost in Dubai in 2026?"
   - "How to choose the best website design agency in Dubai (checklist)"
   - "3D websites: are they worth it for UAE businesses?"
   - "Arabic & English websites: RTL done right"
   - "Website design for clinics / restaurants / real estate in Dubai" (one per industry)

Add every new route to `PAGES` in `src/app/sitemap.ts`.

---

## 6. Backlinks & authority

- **Award submissions:** Awwwards, CSS Design Awards, FWA, Godly, Lapa Ninja. The 3D site is a
  strong candidate, and winners earn high-authority links.
- **Client footers:** a "Website by Asteroid" credit link on every client site (ask permission).
- **Case-study PR:** pitch notable launches to UAE business and tech media, and to startup newsletters.
- **Partnerships:** photographers, branding studios and hosting companies in the UAE (referral pages).
- **Directories with reviews:** Clutch and DesignRush profiles with verified reviews.
- Avoid buying links or joining link networks; it risks a manual penalty.

---

## 7. Monthly SEO routine

| Task | Tool |
|---|---|
| Check Coverage / Page indexing errors | Search Console |
| Review queries, CTR and positions for the 5 target keywords (EN + AR) | Search Console → Performance |
| Improve titles of pages with high impressions but low CTR | `content/*.ts` → `meta` |
| Publish 2 articles + 1 case study | new routes |
| Reply to reviews, post on GBP | Google Business Profile |
| Check Core Web Vitals | Search Console → Core Web Vitals, PageSpeed Insights |
| Track conversions (WhatsApp, call, email) | GA4 Key events |
