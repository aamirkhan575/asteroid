/** The Asteroid mark (faceted asteroid + orbit + moon). Pure SVG, scales to any size. */
export function BrandMark({ moon = true, className }: { moon?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(20 21) rotate(-22)">
        <path d="M-19 0A19 6 0 0 1 19 0" fill="none" stroke="#FF5B1F" strokeWidth="1.6" opacity=".45" />
      </g>
      <polygon points="20,7 29,10 34,18 31,29 22,34 12,31 7,22 10,12" fill="#EDE6DA" />
      <polygon points="20,7 29,10 34,18 22,19" fill="#FFFFFF" opacity=".55" />
      <polygon points="22,19 34,18 31,29 22,34" fill="#A99F91" />
      <polygon points="22,19 22,34 12,31 7,22" fill="#CFC5B6" />
      <circle cx="17" cy="14" r="1.6" fill="#A99F91" />
      <circle cx="27" cy="25" r="1.2" fill="#7D7468" />
      <g transform="translate(20 21) rotate(-22)">
        <path d="M19 0A19 6 0 0 1 -19 0" fill="none" stroke="#FF5B1F" strokeWidth="1.6" />
      </g>
      {moon && (
        <g className="orbit-moon">
          <circle cx="38" cy="14" r="2.4" fill="#FF5B1F" />
        </g>
      )}
    </svg>
  );
}
