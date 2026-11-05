import type { Accented, RichSegment } from "@/content/types";

/** Renders "pre <em class=serif>accent</em> post". */
export function AccentTitle({ value, emberClass = "" }: { value: Accented; emberClass?: string }) {
  return (
    <>
      {value.pre}
      <span className={`serif ${emberClass}`.trim()}>{value.accent}</span>
      {value.post}
    </>
  );
}

/** Renders rich segments, wrapping every word in <span class="w"> for the scroll reveal. */
export function WordReveal({ segments }: { segments: RichSegment[] }) {
  const words = (text: string, keyBase: string) =>
    text.split(/(\s+)/).map((w, i) =>
      /^\s+$/.test(w) || !w ? w : (
        <span className="w" key={`${keyBase}-${i}`}>
          {w}
        </span>
      ),
    );
  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === "string" ? (
          <span key={i}>{words(seg, `s${i}`)}</span>
        ) : (
          <span key={i} className={`serif${seg.ember ? " ember" : ""}`}>
            {words(seg.text, `a${i}`)}
          </span>
        ),
      )}
    </>
  );
}
