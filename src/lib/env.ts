/** Browser capability helpers (call only on the client). */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

/** Custom DOM events used to coordinate independent client islands. */
export const EVENTS = {
  /** Fired by the preloader when the page is revealed. */
  ready: "asteroid:ready",
  /** detail: number 0..1 — intro progress for the 3D scene. */
  intro: "asteroid:intro",
  /** detail: CSS selector or "top" — smooth-scroll request from any component. */
  scrollTo: "asteroid:scrollto",
} as const;
