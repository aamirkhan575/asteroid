# Deployment

## Option A: Vercel (recommended)

1. Push the repo to GitHub, GitLab or Bitbucket.
2. In Vercel, go to **Add New → Project**, import the repo. The framework (Next.js) is auto-detected;
   no build settings are needed.
3. **Environment variables** (Production):
   - `NEXT_PUBLIC_SITE_URL` = `https://asteroid.design`
   - optional: `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_ID`
4. **Domains:** add `asteroid.design` (primary) and `www.asteroid.design` (it redirects to the apex,
   which is also enforced in `next.config.ts`).
5. Deploy. Every PR gets a preview URL automatically. Previews are on `*.vercel.app`; Vercel adds
   `noindex` to preview deployments.

## Option B: any Node host (VPS, Render, Railway, Azure, AWS)

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://asteroid.design npm run build
PORT=3000 npm start
```

Put it behind HTTPS (nginx, Caddy or the platform's TLS). Node 20.9+ is required.

## Option C: Docker

Add `output: "standalone"` to `next.config.ts`, then:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://asteroid.design
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## DNS / email

- `hi@asteroid.design` needs MX records from your email provider (Google Workspace, Zoho, Microsoft 365).
- Add SPF, DKIM and DMARC so enquiry replies don't land in spam.

## Post-deploy verification

```bash
curl -I https://asteroid.design            # 200, security headers present
curl -I https://www.asteroid.design        # 308 → https://asteroid.design/
curl -I https://asteroid.design/en         # 308 → /
curl https://asteroid.design/robots.txt
curl https://asteroid.design/sitemap.xml
```

Then follow the **Launch-day checklist** in [`SEO.md`](SEO.md#3-launch-day-checklist).

## CI suggestion

Run `npm run check` (typecheck, lint and build) on every pull request. Vercel blocks a deployment
when the build fails.
