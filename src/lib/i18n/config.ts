export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; ogLocale: string; hreflang: string; label: string }> = {
  en: { dir: "ltr", ogLocale: "en_AE", hreflang: "en-AE", label: "English" },
  ar: { dir: "rtl", ogLocale: "ar_AE", hreflang: "ar-AE", label: "العربية" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Public path for a locale. The default locale lives at the root (no prefix). */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
