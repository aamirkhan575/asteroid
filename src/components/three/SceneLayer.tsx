"use client";

import { useEffect, useRef } from "react";
import { EVENTS, isTouchDevice } from "@/lib/env";
import { getAmbience } from "@/lib/audio/space-ambience";

/**
 * Fixed WebGL layers behind/above the content.
 * Three.js is code-split and loaded only after the page is idle, so it never
 * blocks the first paint (LCP) or the crawler-visible HTML.
 */
export function SceneLayer() {
  const glRef = useRef<HTMLCanvasElement>(null);
  const iconsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    const cleanups: (() => void)[] = [];
    const isTouch = isTouchDevice();

    const start = async () => {
      const [{ createAsteroidScene }, { createFeatureIcons }] = await Promise.all([
        import("@/lib/three/asteroid-scene"),
        import("@/lib/three/feature-icons"),
      ]);
      if (disposed) return;

      const ambience = getAmbience();
      const scene = glRef.current
        ? createAsteroidScene(glRef.current, { isTouch, onScrollVelocity: (v) => ambience.scroll(v) })
        : null;
      if (scene) {
        const onIntro = (e: Event) => scene.setIntro((e as CustomEvent<number>).detail);
        window.addEventListener(EVENTS.intro, onIntro);
        // Layout changes (pinned sections, accordions, fonts) → re-measure anchors.
        const ro = new ResizeObserver(() => scene.measure());
        ro.observe(document.body);
        cleanups.push(() => {
          window.removeEventListener(EVENTS.intro, onIntro);
          ro.disconnect();
          scene.dispose();
        });
      } else if (glRef.current) {
        glRef.current.style.display = "none";
      }

      const section = document.getElementById("what");
      if (iconsRef.current && section) {
        const icons = createFeatureIcons(iconsRef.current, section, isTouch);
        if (icons) cleanups.push(() => icons.dispose());
      }
    };

    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(cb, { timeout: 1200 })
        : window.setTimeout(cb, 200);
    idle(() => void start());

    return () => {
      disposed = true;
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <>
      <div className="bg-fallback" aria-hidden="true" />
      <canvas id="gl" ref={glRef} aria-hidden="true" />
      <canvas id="icons" ref={iconsRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
