import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

/**
 * Locale routing:
 *   /        → served from /en (internal rewrite, URL stays "/")
 *   /ar      → Arabic
 * We deliberately do NOT auto-redirect by Accept-Language: crawlers must be
 * able to reach every language version at a stable URL (hreflang best practice).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, metadata routes and any file with an extension.
  matcher: ["/((?!_next|api|robots.txt|sitemap.xml|manifest.webmanifest|icon|apple-icon|opengraph-image|.*\\..*).*)"],
};
