"use client";

import { useEffect } from "react";
import { isTouchDevice, prefersReducedMotion } from "@/lib/env";

/**
 * Progressive enhancement for the pricing tickets:
 *  - price "loader" count-up (0 → price, scrambled low digits) when in view
 *  - 3D tilt, cursor-following edge light and holographic sheen
 */
export function TicketEffects() {
  useEffect(() => {
    const tickets = Array.from(document.querySelectorAll<HTMLElement>(".ticket"));
    if (!tickets.length) return;
    const reduce = prefersReducedMotion();
    const fmt = (n: number) => n.toLocaleString("en-US");
    const cleanups: (() => void)[] = [];

    const run = (tk: HTMLElement) => {
      if (tk.dataset.running) return;
      tk.dataset.running = "1";
      tk.classList.remove("done");
      window.setTimeout(() => tk.classList.add("seen"), 900);
      const target = Number(tk.dataset.price);
      const num = tk.querySelector<HTMLElement>(".num")!;
      const bar = tk.querySelector<HTMLElement>(".t-load .bar i")!;
      const pct = tk.querySelector<HTMLElement>(".pct")!;
      const len = fmt(target).length;
      const t0 = performance.now();
      const duration = reduce ? 1 : 2200;
      const step = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const e = 1 - Math.pow(1 - p, 4);
        let s = fmt(Math.round(target * e));
        if (p < 0.82) {
          s = s
            .padStart(len, " ")
            .split("")
            .map((c, i) => (/\d/.test(c) && i > len - 4 ? String(Math.floor(Math.random() * 10)) : c))
            .join("")
            .trim();
        } else if (p >= 1) s = fmt(target);
        num.textContent = s;
        bar.style.transform = `scaleX(${e})`;
        pct.textContent = `${Math.round(e * 100)}%`;
        if (p < 1) requestAnimationFrame(step);
        else {
          tk.classList.add("done");
          delete tk.dataset.running;
        }
      };
      requestAnimationFrame(step);
    };

    // Reset to 0 until visible (server HTML keeps the real price for crawlers / no-JS).
    tickets.forEach((tk) => {
      tk.querySelector<HTMLElement>(".num")!.textContent = "0";
      tk.querySelector<HTMLElement>(".pct")!.textContent = "0%";
    });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en, i) => {
          if (!en.isIntersecting) return;
          window.setTimeout(() => run(en.target as HTMLElement), i * 180);
          io.unobserve(en.target);
        }),
      { threshold: 0.35 },
    );
    tickets.forEach((tk) => {
      io.observe(tk);
      const price = tk.querySelector<HTMLElement>(".t-price");
      const replay = () => run(tk);
      price?.addEventListener("click", replay);
      cleanups.push(() => price?.removeEventListener("click", replay));
      if (isTouchDevice()) return;
      const move = (e: PointerEvent) => {
        const r = tk.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        tk.classList.add("is-tilting");
        tk.style.setProperty("--mx", `${px * 100}%`);
        tk.style.setProperty("--my", `${py * 100}%`);
        tk.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
        tk.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
      };
      const leave = () => {
        tk.classList.remove("is-tilting");
        tk.style.setProperty("--rx", "0deg");
        tk.style.setProperty("--ry", "0deg");
      };
      tk.addEventListener("pointermove", move);
      tk.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        tk.removeEventListener("pointermove", move);
        tk.removeEventListener("pointerleave", leave);
      });
    });
    return () => {
      io.disconnect();
      cleanups.forEach((c) => c());
    };
  }, []);
  return null;
}
