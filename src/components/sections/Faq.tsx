import type { Dictionary } from "@/content";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * FAQ with native <details>/<summary>: answers are in the HTML (crawlable),
 * keyboard-accessible and work without JavaScript. Mirrors the FAQPage JSON-LD.
 */
export function Faq({ t }: { t: Dictionary }) {
  const f = t.faq;
  return (
    <section className="sec" id="faq" data-anchor aria-labelledby="faq-title">
      <div className="faq-wrap">
        <SectionHead index={f.index} title={f.title} intro={f.intro} id="faq-title" />
        <div className="faqs">
          {f.items.map((item, i) => (
            <details className="qa" key={item.q} name="faq" open={i === 0}>
              <summary>
                <h3>{item.q}</h3>
                <span className="pm" aria-hidden="true" />
              </summary>
              <div className="ans">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
