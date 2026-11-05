export function Marquee({ items }: { items: string[] }) {
  // Rendered twice for a seamless loop; the duplicate is hidden from assistive tech.
  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((s) => (
          <span key={s}>{s}</span>
        ))}
        {items.map((s) => (
          <span key={`d-${s}`} aria-hidden="true">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
