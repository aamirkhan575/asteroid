import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n/config";
import { telHref, whatsappHref } from "@/lib/contact";
import { site } from "@/config/site";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

/**
 * Split text for the letter-drop intro. Latin is split per character;
 * Arabic per word (splitting Arabic letters would break cursive joining).
 * Text stays in the DOM in reading order, so crawlers read it normally.
 */
function Split({ text, locale }: { text: string; locale: Locale }) {
  const parts = locale === "ar" ? [text] : Array.from(text);
  return (
    <>
      {parts.map((p, i) => (
        <span className="ch" key={i}>
          {p}
        </span>
      ))}
    </>
  );
}

export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  const h = t.hero;
  return (
    <section className="hero" id="hero" data-anchor aria-labelledby="hero-title">
      <div className="hero-meta mono" aria-hidden="true">
        {h.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <h1 id="hero-title">
        {/* Primary keyword phrase — visible, part of the H1. */}
        <span className="hero-kicker">{h.kicker}</span>
        <span className="line">
          <span className="split">
            <Split text={h.titleLine1} locale={locale} />
          </span>
        </span>
        <span className="line">
          <span className="split">
            <Split text={h.titleLine2} locale={locale} />
          </span>{" "}
          <span className="split serif">
            <Split text={h.titleAccent} locale={locale} />
          </span>
        </span>
      </h1>

      <div className="hero-eyebrow mono">
        <span className="pulse" aria-hidden="true" /> {h.status}
      </div>

      <div className="hero-foot">
        <p className="hero-copy">{h.copy}</p>
        <div className="ctas hero-ctas">
          <a className="btn btn-primary magnetic" href={whatsappHref(h.waMessage)} target="_blank" rel="noopener noreferrer" data-cursor={t.ui.chat}>
            <WhatsAppIcon />
            <span className="tx">{h.ctaWhatsapp}</span>
          </a>
          <a className="btn btn-ghost magnetic" href={telHref} data-cursor={t.ui.call}>
            <PhoneIcon />
            <span>{h.ctaCall}</span>
            <span className="num" dir="ltr">
              {site.contact.phoneDisplay}
            </span>
          </a>
        </div>
        <div className="scroll-cue mono" aria-hidden="true">
          <i />
          {h.scroll}
        </div>
      </div>
    </section>
  );
}
