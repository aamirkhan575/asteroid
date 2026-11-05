import type { Dictionary } from "@/content";
import { site } from "@/config/site";
import { SectionHead } from "@/components/ui/SectionHead";
import { whatsappHref } from "@/lib/contact";
import { TicketEffects } from "./TicketEffects";

const ORBITS: Record<string, React.ReactNode> = {
  launch: (
    <g className="r" style={{ animationDuration: "9s" }}>
      <ellipse cx="95" cy="95" rx="44" ry="44" fill="none" stroke="rgba(255,91,31,.5)" />
      <circle cx="139" cy="95" r="4" fill="#FF5B1F" />
    </g>
  ),
  growth: (
    <>
      <g className="r" style={{ animationDuration: "8s" }}>
        <ellipse cx="95" cy="95" rx="44" ry="44" fill="none" stroke="rgba(255,91,31,.55)" />
        <circle cx="139" cy="95" r="4" fill="#FF5B1F" />
      </g>
      <g className="r" style={{ animationDuration: "14s", animationDirection: "reverse" }}>
        <ellipse cx="95" cy="95" rx="66" ry="66" fill="none" stroke="rgba(255,179,71,.35)" strokeDasharray="2 5" />
        <circle cx="95" cy="29" r="3.5" fill="#FFB347" />
      </g>
    </>
  ),
  signature: (
    <>
      <g className="r" style={{ animationDuration: "7s" }}>
        <ellipse cx="95" cy="95" rx="38" ry="38" fill="none" stroke="rgba(255,91,31,.55)" />
        <circle cx="133" cy="95" r="4" fill="#FF5B1F" />
      </g>
      <g className="r" style={{ animationDuration: "12s", animationDirection: "reverse" }}>
        <ellipse cx="95" cy="95" rx="58" ry="58" fill="none" stroke="rgba(255,179,71,.35)" strokeDasharray="2 5" />
        <circle cx="95" cy="37" r="3.5" fill="#FFB347" />
      </g>
      <g className="r" style={{ animationDuration: "20s" }}>
        <ellipse cx="95" cy="95" rx="80" ry="80" fill="none" stroke="rgba(237,230,218,.18)" />
        <circle cx="15" cy="95" r="3" fill="#EDE6DA" />
      </g>
    </>
  ),
};

/** Pricing "mission tickets". Prices are server-rendered (crawlable); the count-up is progressive enhancement. */
export function Pricing({ t }: { t: Dictionary }) {
  const p = t.pricing;
  return (
    <section className="sec" id="pricing" data-anchor aria-labelledby="pricing-title">
      <SectionHead index={p.index} title={p.title} intro={p.intro} id="pricing-title" />
      <div className="plans">
        {p.plans.map((plan, i) => {
          const price = site.pricing.plans[i].price;
          return (
            <article className={`ticket${plan.featured ? " hot" : ""}`} data-price={price} key={plan.id} aria-labelledby={`plan-${plan.id}`}>
              {plan.featured && <span className="badge-hot">{p.badge}</span>}
              <div className="t-top">
                <svg className="t-orbit" viewBox="0 0 190 190" aria-hidden="true">
                  <circle cx="95" cy="95" r="16" fill="#EDE6DA" opacity=".9" />
                  {ORBITS[plan.id]}
                </svg>
                <div className="t-head">
                  <span className="live">{plan.mission}</span>
                  <span aria-hidden="true">{plan.code}</span>
                </div>
                <h3 className="t-name" id={`plan-${plan.id}`}>
                  {plan.name}
                </h3>
                <div className="t-from">{p.from}</div>
                <div className="t-price">
                  <span className="cur">{p.currency}</span>
                  <span className="num">{price.toLocaleString("en-US")}</span>
                  <span className="plus">{plan.plus ? "+" : ""}</span>
                </div>
                <div className="t-load" aria-hidden="true">
                  <div className="bar">
                    <i />
                  </div>
                  <span className="pct">100%</span>
                </div>
                <p className="t-for">{plan.forWho}</p>
              </div>
              <div className="perf" aria-hidden="true" />
              <div className="t-bot">
                <dl className="t-specs">
                  {plan.specs.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"} magnetic`}
                  href={whatsappHref(plan.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor={t.ui.chat}
                >
                  {plan.cta}
                </a>
                <div className="t-code" aria-hidden="true">
                  <div className="bc" />
                  <span>
                    AST-{plan.code.slice(-1)}-{price / 1000}K{plan.plus ? "+" : ""}
                  </span>
                </div>
              </div>
              <div className="t-holo" aria-hidden="true" />
            </article>
          );
        })}
      </div>
      <div className="price-note reveal">
        {p.notes.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <TicketEffects />
    </section>
  );
}
