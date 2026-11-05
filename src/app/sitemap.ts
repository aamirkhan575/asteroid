import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/seo/metadata";

/**
 * /sitemap.xml — every page in every language, with hreflang alternates.
 * Add new routes to PAGES as the site grows (services, case studies, blog…).
 */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.flatMap((page) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, page.path)),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: locale === "en" ? page.priority : page.priority * 0.9,
      alternates: { languages: languageAlternates(page.path) },
      images: [absoluteUrl(`/og/og-${locale}.jpg`)],
    })),
  );
}
