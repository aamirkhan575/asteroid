import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/content";
import { telHref, whatsappHref } from "@/lib/contact";
import { localePath, type Locale } from "@/lib/i18n/config";
import { LanguageSwitch } from "./LanguageSwitch";
import { SoundControl } from "./SoundControl";

export function Header({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <header className="nav" id="nav">
      <Link href={localePath(locale)} className="logo" aria-label="Asteroid — home">
        <BrandMark />
        asteroid<sup>®</sup>
      </Link>

      <nav aria-label="Primary">
        <ul>
          {t.nav.links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-cta">
        <SoundControl labels={t.ui} />
        <LanguageSwitch locale={locale} label={t.ui.switchLanguage} />
        <a className="btn btn-ghost btn-sm magnetic nav-call" href={telHref} data-cursor={t.ui.call}>
          <PhoneIcon />
          <span className="hide-sm">{t.nav.call}</span>
        </a>
        <a
          className="btn btn-primary btn-sm magnetic"
          href={whatsappHref(t.nav.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor={t.ui.chat}
        >
          <WhatsAppIcon className="wa-i" />
          <span className="lbl">{t.nav.whatsapp}</span>
        </a>
      </div>
    </header>
  );
}
