import { WhatsAppIcon } from "./icons";
import { whatsappHref } from "@/lib/contact";

export function WhatsAppFab({ tip, message }: { tip: string; message: string }) {
  return (
    <a className="float-wa" id="floatWa" href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" aria-label={tip}>
      <span className="tip">{tip}</span>
      <WhatsAppIcon />
    </a>
  );
}
