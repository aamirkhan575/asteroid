import { site } from "@/config/site";

/** wa.me deep link with an optional pre-filled message. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const telHref = `tel:${site.contact.phoneE164}`;

export function mailHref(subject?: string): string {
  return subject
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${site.contact.email}`;
}
