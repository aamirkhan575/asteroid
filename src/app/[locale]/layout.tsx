import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import { fontVariables } from "@/styles/fonts";
import { getDictionary } from "@/content";
import { isLocale, localeMeta, locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
import { Analytics } from "@/components/seo/Analytics";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata(locale);
}

export const viewport: Viewport = {
  themeColor: "#0B0A09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint:
 *  - `js` class enables reveal animations only when JS is available
 *    (no-JS visitors and crawlers still see all content).
 *  - `seen-loader` skips the preloader on repeat visits this session.
 */
const bootScript = `(function(d){var c=d.documentElement.classList;c.add('js');try{if(sessionStorage.getItem('ast-loader'))c.add('seen-loader')}catch(e){}})(document)`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <html lang={locale} dir={localeMeta[locale as Locale].dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {t.ui.skipToContent}
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
