import type { Dictionary } from "@/content";
import { site } from "@/config/site";
import { AccentTitle } from "@/components/ui/Accent";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";
import { LiveClock } from "./LiveClock";
import { Terminal } from "./Terminal";
import { ParticleWordmark } from "./ParticleWordmark";
import { ScrambleLinks } from "./ScrambleLinks";

/** "Mission control" footer. Business details are in a semantic <address> (consistent NAP for local SEO). */
export function Footer({ t }: { t: Dictionary }) {
  const f = t.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="mc" id="footer">
      <div className="mc-floor" aria-hidden="true" />
      <div className="mc-scan" aria-hidden="true" />
      <div className="mc-sweep" aria-hidden="true" />
      <div className="mc-in">
        <div className="mc-hud" aria-hidden="true">
          <span className="ok">{f.status}</span>
          <LiveClock />
          <span>
            {site.address.geo.lat}° N · {site.address.geo.lng}° E
          </span>
          <span>
            Build <b>v{year}.1</b>
          </span>
          <span>
            Dubai <b>UAE</b>
          </span>
        </div>

        <div className="mc-main">
          <div>
            <h2 className="mc-title">
              <AccentTitle value={f.title} />
            </h2>
            <Terminal title={f.terminalTitle} placeholder={f.terminalPlaceholder} />
          </div>
          <div className="mods">
            <nav className="mod mod-links" aria-label={f.navTitle}>
              <div className="mod-h">
                <span>{f.navTitle}</span>
                <span>{f.navCount}</span>
              </div>
              {t.nav.links.map((l, i) => (
                <a href={l.href} data-scramble key={l.href}>
                  <span>
                    <small>0{i + 1}</small>
                    {l.label}
                  </span>
                  <span className="arr" aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
            </nav>
            <div className="mod">
              <div className="mod-h">
                <span>{f.channelsTitle}</span>
                <span>{f.hours}</span>
              </div>
              <address className="mod-contact">
                <a href={whatsappHref("Hi Asteroid!")} target="_blank" rel="noopener noreferrer" data-cursor={t.ui.chat}>
                  <small>{f.labels.whatsapp}</small>
                  <b dir="ltr">{site.contact.phoneDisplay}</b>
                </a>
                <a href={telHref} data-cursor={t.ui.call}>
                  <small>{f.labels.call}</small>
                  <b dir="ltr">{site.contact.phoneDisplay}</b>
                </a>
                <a href={mailHref()} className="wide" data-cursor="Email">
                  <small>{f.labels.email}</small>
                  <b dir="ltr">{site.contact.email}</b>
                </a>
              </address>
              <p className="contact-nap">{f.nap}</p>
            </div>
          </div>
        </div>

        <ParticleWordmark hint={f.wordmarkHint} />

        <div className="mc-bottom">
          <span>
            © {year} {f.rights}
          </span>
          <span>{f.tagline}</span>
          <a href="#top">{f.backToTop}</a>
        </div>
      </div>
      <ScrambleLinks />
    </footer>
  );
}
