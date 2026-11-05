/**
 * Pointer + scroll UI behaviours (framework-agnostic, event delegation).
 *  - custom cursor with contextual label  ([data-cursor="Chat"])
 *  - magnetic buttons                      (.magnetic)
 *  - 3D tilt + spotlight                   (.tilt, .ticket uses its own logic)
 *  - header hide-on-scroll / floating WhatsApp reveal
 */
export function initInteractions({ isTouch, onHover }: { isTouch: boolean; onHover?: () => void }) {
  const cleanups: (() => void)[] = [];
  const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
    window.addEventListener(type, fn, opts);
    cleanups.push(() => window.removeEventListener(type, fn));
  };

  /* header + FAB */
  const nav = document.getElementById("nav");
  const fab = document.getElementById("floatWa");
  let lastY = 0;
  on(
    "scroll",
    () => {
      const y = window.scrollY;
      nav?.classList.toggle("is-hidden", y > lastY && y > 200);
      nav?.classList.toggle("is-solid", y > 40);
      fab?.classList.toggle("show", y > window.innerHeight * 0.7);
      lastY = y;
    },
    { passive: true },
  );

  /* hover chime for interactive elements */
  const hoverTargets = document.querySelectorAll<HTMLElement>(".magnetic, .ticket, .proj");
  const chime = () => onHover?.();
  hoverTargets.forEach((el) => el.addEventListener("pointerenter", chime));
  cleanups.push(() => hoverTargets.forEach((el) => el.removeEventListener("pointerenter", chime)));

  if (isTouch) return () => cleanups.forEach((c) => c());

  /* cursor */
  const cursor = document.querySelector<HTMLElement>(".cursor");
  const dot = document.querySelector<HTMLElement>(".cursor-dot");
  const label = cursor?.querySelector("span");
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;
  on("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    if (dot) dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    if (cursor && label) {
      cursor.classList.toggle("is-hover", !!target);
      if (target) label.textContent = target.dataset.cursor ?? "";
    }
  });
  let raf = 0;
  const loop = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    if (cursor) cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  cleanups.push(() => cancelAnimationFrame(raf));

  /* magnetic buttons */
  const magnets = document.querySelectorAll<HTMLElement>(".magnetic");
  magnets.forEach((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    };
    const leave = () => {
      el.style.transition = "transform .6s cubic-bezier(.16,1,.3,1),color .4s";
      el.style.transform = "";
      window.setTimeout(() => (el.style.transition = ""), 600);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });

  /* tilt cards */
  const tilts = document.querySelectorAll<HTMLElement>(".tilt");
  tilts.forEach((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg)`;
    };
    const leave = () => {
      el.style.transition = "transform .8s cubic-bezier(.16,1,.3,1),border-color .4s";
      el.style.transform = "";
      window.setTimeout(() => (el.style.transition = ""), 800);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });

  return () => cleanups.forEach((c) => c());
}
