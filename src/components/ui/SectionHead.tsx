import type { Accented } from "@/content/types";
import { AccentTitle } from "./Accent";

/** Numbered section heading: (02) + H2 + intro. One H2 per section for a clean outline. */
export function SectionHead({ index, title, intro, id }: { index: string; title: Accented; intro?: string; id?: string }) {
  return (
    <div className="sec-head">
      <span className="idx mono" aria-hidden="true">
        {index}
      </span>
      <h2 className="reveal" id={id}>
        <AccentTitle value={title} />
      </h2>
      {intro && <p className="reveal">{intro}</p>}
    </div>
  );
}
