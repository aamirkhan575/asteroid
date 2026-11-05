import type { Dictionary } from "@/content";
import { site } from "@/config/site";
import { AccentTitle } from "@/components/ui/Accent";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";

export function Contact({ t }: { t: Dictionary }) {
  const c = t.contact;
  return (
    <section className="final" id="contact" data-anchor aria-labelledby="contact-title">
      <div className="mono">{c.label}</div>
      <h2 id="contact-title">
        <AccentTitle value={c.title} />
      </h2>
      <p>{c.text}</p>
      <div className="ctas">
        <a className="btn btn-primary magnetic" href={whatsappHref(c.waMessage)} target="_blank" rel="noopener noreferrer" data-cursor={t.ui.chat}>
          <WhatsAppIcon />
          <span className="tx">{c.whatsapp}</span>
        </a>
        <a className="btn btn-ghost magnetic" href={telHref} data-cursor={t.ui.call}>
          <PhoneIcon />
          <span className="tx">{c.call}</span>{" "}
          <span dir="ltr">{site.contact.phoneDisplay}</span>
        </a>
        <a className="btn btn-ghost magnetic" href={mailHref(c.emailSubject)} data-cursor="Email">
          <MailIcon />
          <span className="tx">{c.email}</span>{" "}
          <span dir="ltr">{site.contact.email}</span>
        </a>
      </div>
      <div className="hours mono">{c.hours}</div>
    </section>
  );
}
