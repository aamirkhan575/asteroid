import type { Dictionary } from "@/content";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * SEO content section: explains who we are, what we do and where we work,
 * naturally covering the target keywords (Dubai, UAE, 3D websites, premium agency).
 */
export function Expertise({ t }: { t: Dictionary }) {
  const e = t.expertise;
  return (
    <section className="sec" id="expertise" data-anchor aria-labelledby="expertise-title">
      <SectionHead index={e.index} title={e.title} id="expertise-title" />
      <div className="expertise-grid">
        <div className="expertise-copy reveal">
          {e.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <ul className="services-list">
          {e.services.map((s) => (
            <li className="service reveal" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="areas reveal">
        <span className="mono">{e.areasLabel}</span>
        <ul aria-label={e.areasLabel}>
          {e.areas.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
