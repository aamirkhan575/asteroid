import type { Dictionary } from "@/content";
import { SectionHead } from "@/components/ui/SectionHead";

export function Process({ t }: { t: Dictionary }) {
  const p = t.process;
  return (
    <section className="sec" id="how" data-anchor aria-labelledby="how-title">
      <SectionHead index={p.index} title={p.title} intro={p.intro} id="how-title" />
      <ol className="steps" id="steps">
        <li className="rail" id="rail" aria-hidden="true" />
        {p.steps.map((s, i) => (
          <li className="step" key={s.title}>
            <div className="k">
              <b aria-hidden="true">0{i + 1}</b>
              <span className="mono" style={{ color: "var(--mute)" }}>
                {s.label}
              </span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <span className="time mono">{s.time}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
