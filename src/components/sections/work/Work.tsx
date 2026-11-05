import type { Dictionary } from "@/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { AccentTitle } from "@/components/ui/Accent";
import { whatsappHref } from "@/lib/contact";
import { projectPreviews } from "./previews";

/** Portfolio — pinned horizontal gallery on desktop, vertical stack on mobile. */
export function Work({ t }: { t: Dictionary }) {
  const w = t.work;
  return (
    <section className="work" id="work" data-anchor aria-labelledby="work-title">
      <SectionHead index={w.index} title={w.title} intro={w.intro} id="work-title" />
      <div className="work-pin">
        <div className="work-track" id="workTrack">
          {w.projects.map((p, i) => (
            <a
              className="proj"
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener"
              data-cursor={t.ui.visit}
            >
              <div className="proj-frame" aria-hidden="true">
                {projectPreviews[p.id]}
              </div>
              <div className="proj-cap">
                <div>
                  <h3>
                    <span className="proj-num">0{i + 1}</span>
                    {p.name} <span className="chip">{p.category}</span>
                  </h3>
                  <span className="proj-link">
                    {w.visit} <i aria-hidden="true">↗</i>
                  </span>
                </div>
                <p>{p.description}</p>
              </div>
            </a>
          ))}
          <div className="work-end">
            <h3>
              <AccentTitle value={w.end.title} emberClass="ember" />
            </h3>
            <p style={{ color: "#BDB5A9" }}>{w.end.text}</p>
            <div>
              <a className="btn btn-primary magnetic" href={whatsappHref(w.end.waMessage)} target="_blank" rel="noopener noreferrer" data-cursor={t.ui.chat}>
                {w.end.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
