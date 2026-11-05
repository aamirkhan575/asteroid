/**
 * Shape of every language file in /src/content.
 * Add a field here first, then TypeScript will tell you every
 * dictionary that still needs a translation.
 */

/** A headline split so one phrase can be set in the accent serif. */
export interface Accented {
  pre: string;
  accent: string;
  post?: string;
}

/** Inline rich text: plain text with optional accent / ember spans. */
export type RichSegment = string | { text: string; accent?: boolean; ember?: boolean };

export interface Plan {
  id: "launch" | "growth" | "signature";
  mission: string;
  code: string;
  name: string;
  forWho: string;
  plus?: boolean;
  featured?: boolean;
  specs: { label: string; value: string }[];
  features: string[];
  cta: string;
  waMessage: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogAlt: string;
  };
  ui: {
    skipToContent: string;
    chat: string;
    call: string;
    visit: string;
    sound: string;
    soundOn: string;
    soundOff: string;
    volume: string;
    ambience: string;
    mute: string;
    soundTip: string;
    fabTip: string;
    preloaderTag: string;
    location: string;
    switchLanguage: string;
  };
  nav: {
    links: { href: string; label: string }[];
    call: string;
    whatsapp: string;
    waMessage: string;
  };
  hero: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    meta: string[];
    status: string;
    copy: string;
    ctaWhatsapp: string;
    ctaCall: string;
    scroll: string;
    waMessage: string;
  };
  marquee: string[];
  manifesto: { label: string; text: RichSegment[] };
  features: {
    index: string;
    title: Accented;
    intro: string;
    online: string;
    promises: { value: number; suffix?: string; text: string }[];
    cards: {
      icon: "gem" | "phone" | "search" | "magnet" | "layers" | "globe";
      module: string;
      title: string;
      text: string;
      specKey: string;
      specValue: string;
      meter: number;
      tag: string;
    }[];
  };
  work: {
    index: string;
    title: Accented;
    intro: string;
    visit: string;
    projects: {
      id: "infinia" | "token2049" | "fasset" | "xphoto" | "arsh" | "falak" | "akc";
      name: string;
      url: string;
      category: string;
      description: string;
    }[];
    end: { title: Accented; text: string; cta: string; waMessage: string };
  };
  expertise: {
    index: string;
    title: Accented;
    paragraphs: string[];
    services: { title: string; text: string }[];
    areasLabel: string;
    areas: string[];
  };
  process: {
    index: string;
    title: Accented;
    intro: string;
    steps: { label: string; title: string; text: string; time: string }[];
  };
  pricing: {
    index: string;
    title: Accented;
    intro: string;
    badge: string;
    from: string;
    currency: string;
    plans: Plan[];
    notes: string[];
  };
  care: {
    label: string;
    title: Accented;
    lede: string;
    items: { icon: "chat" | "clock" | "shield" | "growth"; title: string; text: string }[];
  };
  faq: {
    index: string;
    title: Accented;
    intro: string;
    items: { q: string; a: string }[];
  };
  contact: {
    label: string;
    title: Accented;
    text: string;
    whatsapp: string;
    call: string;
    email: string;
    hours: string;
    waMessage: string;
    emailSubject: string;
  };
  footer: {
    status: string;
    title: Accented;
    terminalTitle: string;
    terminalPlaceholder: string;
    navTitle: string;
    navCount: string;
    channelsTitle: string;
    hours: string;
    labels: { whatsapp: string; call: string; email: string };
    wordmarkHint: string;
    rights: string;
    tagline: string;
    backToTop: string;
    nap: string;
  };
}
