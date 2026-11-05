import type { Metadata } from "next";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { defaultLocale, localeMeta, localePath, locales, type Locale } from "@/lib/i18n/config";

/** Absolute URL for a path on the canonical origin. */
export const absoluteUrl = (path = "/") => `${site.url}${path === "/" ? "" : path}` || site.url;

/** hreflang map for a page path: every locale + x-default. */
export function languageAlternates(path = "/") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].hreflang] = absoluteUrl(localePath(l, path));
  languages["x-default"] = absoluteUrl(localePath(defaultLocale, path));
  return languages;
}

/**
 * Page-level metadata. Covers: title, description, canonical, hreflang,
 * Open Graph, Twitter cards, robots directives and search-console verification.
 */
export function buildMetadata(locale: Locale, path = "/"): Metadata {
  const t = getDictionary(locale).meta;
  const url = absoluteUrl(localePath(locale, path));
  const ogImage = `/og/og-${locale}.jpg`;

  return {
    metadataBase: new URL(site.url),
    title: { absolute: `${t.title} | ${site.name}` },
    description: t.description,
    keywords: t.keywords,
    applicationName: site.name,
    authors: [{ name: site.legalName, url: site.url }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "Website design",
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: t.title,
      description: t.description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: t.ogAlt, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [{ url: ogImage, alt: t.ogAlt }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.YANDEX_SITE_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
    formatDetection: { telephone: false, email: false, address: false },
    other: {
      "geo.region": "AE-DU",
      "geo.placename": "Dubai",
      "geo.position": `${site.address.geo.lat};${site.address.geo.lng}`,
      ICBM: `${site.address.geo.lat}, ${site.address.geo.lng}`,
    },
  };
}
