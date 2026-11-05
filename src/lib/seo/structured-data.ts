import { site } from "@/config/site";
import type { Dictionary } from "@/content";
import { localeMeta, localePath, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "./metadata";

/**
 * schema.org JSON-LD graph for the home page.
 * One @graph with stable @ids so Google can connect the entities:
 *   Organization/ProfessionalService ← WebSite ← WebPage → FAQPage, Service, ItemList
 * Validate at https://validator.schema.org and https://search.google.com/test/rich-results
 */
export function homeJsonLd(locale: Locale, t: Dictionary) {
  const pageUrl = absoluteUrl(localePath(locale));
  const lang = localeMeta[locale].hreflang;
  const ORG = `${site.url}/#organization`;
  const SITE = `${site.url}/#website`;
  const sameAs = Object.values(site.social).filter(Boolean);

  const organization = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG,
    name: site.name,
    legalName: site.legalName,
    alternateName: ["Asteroid Design", "Asteroid Studio", "أستيرويد"],
    url: site.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/asteroid-app-icon.svg"), width: 512, height: 512 },
    image: absoluteUrl(`/og/og-${locale}.jpg`),
    description: t.meta.description,
    slogan: site.tagline,
    foundingDate: String(site.foundingYear),
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    priceRange: "AED 10,000 – AED 50,000+",
    currenciesAccepted: "AED",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.geo.lat, longitude: site.address.geo.lng },
    areaServed: site.areaServed.map((name) => ({ "@type": name === "GCC" ? "Place" : "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: site.contact.phoneE164,
        email: site.contact.email,
        areaServed: "AE",
        availableLanguage: ["English", "Arabic"],
      },
    ],
    knowsAbout: [
      "Website design",
      "Web design Dubai",
      "3D website design",
      "WebGL",
      "Three.js",
      "UX design",
      "UI design",
      "Search engine optimisation",
      "Arabic and English bilingual websites",
      "E-commerce websites",
    ],
    knowsLanguage: ["en", "ar"],
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "ar" ? "باقات تصميم المواقع" : "Website design packages",
      itemListElement: t.pricing.plans.map((plan, i) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.forWho,
        url: `${pageUrl}#pricing`,
        priceCurrency: site.pricing.currency,
        price: site.pricing.plans[i].price,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: site.pricing.plans[i].price,
          priceCurrency: site.pricing.currency,
        },
        itemOffered: { "@id": `${site.url}/#service-website-design` },
      })),
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": SITE,
    url: site.url,
    name: site.name,
    description: t.meta.description,
    publisher: { "@id": ORG },
    inLanguage: ["en-AE", "ar-AE"],
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: lang,
    isPartOf: { "@id": SITE },
    about: { "@id": ORG },
    primaryImageOfPage: absoluteUrl(`/og/og-${locale}.jpg`),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: site.name, item: pageUrl }],
    },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#hero-title", ".hero-copy"] },
  };

  const service = {
    "@type": "Service",
    "@id": `${site.url}/#service-website-design`,
    name: locale === "ar" ? "تصميم وتطوير المواقع" : "Website design & development",
    serviceType: t.expertise.services.map((s) => s.title),
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    description: t.expertise.paragraphs[0],
    offers: { "@type": "AggregateOffer", priceCurrency: "AED", lowPrice: 10000, offerCount: 3 },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    inLanguage: lang,
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const portfolio = {
    "@type": "ItemList",
    "@id": `${pageUrl}#work`,
    name: locale === "ar" ? "أعمال مختارة" : "Selected work",
    itemListElement: t.work.projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "CreativeWork", name: p.name, url: p.url, description: p.description, creator: { "@id": ORG } },
    })),
  };

  return { "@context": "https://schema.org", "@graph": [organization, website, webpage, service, faq, portfolio] };
}
