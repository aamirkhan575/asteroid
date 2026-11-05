import type { Dictionary } from "@/content";
import { WordReveal } from "@/components/ui/Accent";

export function Manifesto({ t }: { t: Dictionary }) {
  return (
    <section className="manifesto" id="manifesto" data-anchor aria-label={t.manifesto.label}>
      <div className="mono">{t.manifesto.label}</div>
      <p className="big" id="manifestoText">
        <WordReveal segments={t.manifesto.text} />
      </p>
    </section>
  );
}
