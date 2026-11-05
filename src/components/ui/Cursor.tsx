/** Custom cursor markup — behaviour lives in lib/motion/interactions.ts. Hidden on touch via CSS. */
export function Cursor() {
  return (
    <>
      <div className="cursor" aria-hidden="true">
        <span />
      </div>
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
