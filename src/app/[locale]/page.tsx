import { getDictionary } from "@/content";
import { isLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { homeJsonLd } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { SceneLayer } from "@/components/three/SceneLayer";
import { Experience } from "@/components/providers/Experience";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { LanguageWipe } from "@/components/layout/LanguageWipe";
import { Footer } from "@/components/layout/footer/Footer";
import { Cursor } from "@/components/ui/Cursor";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Features } from "@/components/sections/Features";
import { Work } from "@/components/sections/work/Work";
import { Expertise } from "@/components/sections/Expertise";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/pricing/Pricing";
import { Care } from "@/components/sections/Care";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

/**
 * Home page. Every word is server-rendered from /src/content/<locale>.ts;
 * client components only add motion, 3D and sound on top.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const t = getDictionary(locale);
  const other = locale === "en" ? "ar" : "en";

  return (
    <>
      <JsonLd data={homeJsonLd(locale, t)} />
      <SceneLayer />
      <Cursor />
      <Preloader tagline={t.ui.preloaderTag} location={t.ui.location} />
      <Header t={t} locale={locale} />

      <main id="main">
        <div id="top" />
        <Hero t={t} locale={locale} />
        <Marquee items={t.marquee} />
        <Manifesto t={t} />
        <Features t={t} />
        <Work t={t} />
        <Expertise t={t} />
        <Process t={t} />
        <Pricing t={t} />
        <Care t={t} />
        <Faq t={t} />
        <Contact t={t} />
      </main>

      <Footer t={t} />
      <WhatsAppFab tip={t.ui.fabTip} message={t.nav.waMessage} />
      <LanguageWipe label={localeMeta[other].label} />
      <Experience />
    </>
  );
}
