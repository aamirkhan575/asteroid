import type { Dictionary } from "@/content";
import { AccentTitle } from "@/components/ui/Accent";
import { CareIcons } from "@/components/ui/icons";

export function Care({ t }: { t: Dictionary }) {
  const c = t.care;
  return (
    <section className="sec" id="care" data-anchor aria-labelledby="care-title">
      <div className="care">
        <div>
          <div className="mono" style={{ color: "var(--mute)", marginBottom: 26 }}>
            {c.label}
          </div>
          <h2 className="reveal" id="care-title">
            <AccentTitle value={c.title} />
          </h2>
          <p className="lede reveal">{c.lede}</p>
        </div>
        <ul className="care-list">
          {c.items.map((item) => (
            <li className="care-item reveal" key={item.title}>
              <div className="ic">{CareIcons[item.icon]}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
