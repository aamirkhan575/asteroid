/**
 * Single source of truth for business facts (NAP: name, address, phone).
 * Keep these identical everywhere — website, Google Business Profile,
 * LinkedIn, directories. Consistent NAP is a core local-SEO signal.
 */
export const site = {
  name: "Asteroid",
  legalName: "Asteroid Design Studio",
  tagline: "Websites with gravity.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://asteroid.design").replace(/\/$/, ""),
  foundingYear: 2026,

  contact: {
    /** Display format */
    phoneDisplay: "+971 55 283 0119",
    /** E.164 format — used for tel: links and structured data */
    phoneE164: "+971552830119",
    /** Digits only — used for wa.me links */
    whatsapp: "971552830119",
    email: "hi@asteroid.design",
  },

  address: {
    locality: "Dubai",
    region: "Dubai",
    country: "AE",
    countryName: "United Arab Emirates",
    /** Approximate city-centre coordinates (no street address published). */
    geo: { lat: 25.2048, lng: 55.2708 },
  },

  hours: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "20:00",
    timezone: "Asia/Dubai",
  },

  areaServed: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "United Arab Emirates", "GCC"],

  /** Add profile URLs as they go live — they power schema.org `sameAs`. */
  social: {
    linkedin: "https://www.linkedin.com/company/asteroid-design",
    instagram: "",
    x: "",
    behance: "",
  },

  pricing: {
    currency: "AED",
    plans: [
      { id: "launch", price: 10000 },
      { id: "growth", price: 25000 },
      { id: "signature", price: 50000 },
    ],
  },
} as const;

export type Site = typeof site;
