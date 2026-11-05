"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { EVENTS, prefersReducedMotion } from "@/lib/env";

/**
 * Short branded loader (first visit per session only).
 * Kept under ~1s so it doesn't hurt perceived performance; a CSS fail-safe
 * hides it even if JavaScript never runs (see styles/components/preloader.css).
 */
export function Preloader({ tagline, location }: { tagline: string; location: string }) {
  const [gone, setGone] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const signal = () => {
      root.dataset.ready = "1";
      window.dispatchEvent(new Event(EVENTS.ready));
    };

    let seen = false;
    try {
      seen = !!sessionStorage.getItem("ast-loader");
      sessionStorage.setItem("ast-loader", "1");
    } catch {
      /* private mode */
    }
    if (seen || prefersReducedMotion()) {
      setGone(true);
      signal();
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 950;
    const tick = () => {
      const p = Math.min((performance.now() - start) / duration, 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      if (countRef.current) countRef.current.textContent = String(v);
      if (barRef.current) barRef.current.style.width = `${v}%`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        rootRef.current?.classList.add("is-leaving");
        window.setTimeout(() => {
          setGone(true);
          signal();
        }, 650);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <div className="row">
        <div className="logo">
          <BrandMark moon={false} />
          asteroid
        </div>
        <span className="mono tag">{tagline}</span>
      </div>
      <div className="row">
        <span className="mono" style={{ color: "var(--mute)" }}>
          {location}
        </span>
        <div className="count">
          <span ref={countRef}>0</span>
          <span className="serif ember" style={{ fontSize: ".5em" }}>
            %
          </span>
        </div>
      </div>
      <div className="bar" ref={barRef} />
    </div>
  );
}
