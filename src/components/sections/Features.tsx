import type { Dictionary } from "@/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { FeatureFallbackIcons } from "@/components/ui/icons";

/** "What you actually get": promise counters + six tech module cards (3D icons render into .ico3d). */
export function Features({ t }: { t: Dictionary }) {
  const f = t.features;
  return (
    <section className="sec" id="what" data-anchor aria-labelledby="what-title">
      <SectionHead index={f.index} title={f.title} intro={f.intro} id="what-title" />

      <div className="promises reveal">
        {f.promises.map((p) => (
          <div className="promise" key={p.text}>
            <div className="n">
              <span data-count={p.value}>{p.value}</span>
              {p.suffix && <small>{p.suffix}</small>}
            </div>
            <p>{p.text}</p>
          </div>
        ))}
      </div>

      <div className="cards">
        {f.cards.map((c, i) => (
          <article className="card tilt reveal" key={c.icon}>
            <div className="c-grid" aria-hidden="true" />
            <div className="c-frame" aria-hidden="true" />
            <div className="c-scan" aria-hidden="true" />
            <div className="c-hud" aria-hidden="true">
              <span>
                MOD_0{i + 1} / {c.module}
              </span>
              <span className="c-led">
                <i />
                {f.online}
              </span>
            </div>
            <div className="c-stage" aria-hidden="true">
              <svg className="c-pad" viewBox="0 0 200 60">
                <ellipse className="p1" cx="100" cy="30" rx="94" ry="24" />
                <ellipse className="p2" cx="100" cy="30" rx="70" ry="17" />
                <ellipse className="p3" cx="100" cy="30" rx="42" ry="9" />
              </svg>
              <div className="c-beam" />
              <div className="ico3d" data-icon={c.icon}>
                <svg className="ico-fb" viewBox="0 0 64 64" fill="none" stroke="#FF5B1F" strokeWidth="1.5">
                  {FeatureFallbackIcons[c.icon]}
                </svg>
              </div>
            </div>
            <div className="c-body">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
            <div className="c-spec" aria-hidden="true">
              <span>{`// ${c.specKey}`}</span>
              <b>{c.specValue}</b>
            </div>
            <div className="c-meter" aria-hidden="true">
              <i style={{ ["--p" as string]: `${c.meter}%` }} />
            </div>
            <div className="tagline">
              <span>{c.tag}</span>
              <span aria-hidden="true">0{i + 1}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
