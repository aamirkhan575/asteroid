"use client";

import { useEffect } from "react";
import { EVENTS, isTouchDevice, prefersReducedMotion } from "@/lib/env";
import { getAmbience } from "@/lib/audio/space-ambience";

/**
 * Boots motion (Lenis + GSAP) and pointer interactions once the preloader
 * signals the page is ready. Renders nothing.
 */
export function Experience() {
  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;

    const boot = async () => {
      const [{ initMotion }, { initInteractions }] = await Promise.all([
        import("@/lib/motion/init-motion"),
        import("@/lib/motion/interactions"),
      ]);
      if (disposed) return;
      const reduce = prefersReducedMotion();
      const motion = initMotion({ reduce });
      const stopInteractions = initInteractions({ isTouch: isTouchDevice(), onHover: () => getAmbience().blip() });

      const play = () => {
        motion.playIntro((v) => window.dispatchEvent(new CustomEvent(EVENTS.intro, { detail: v })));
        document.documentElement.classList.add("js-ready");
      };
      if (document.documentElement.dataset.ready === "1") play();
      else window.addEventListener(EVENTS.ready, play, { once: true });

      const onScrollTo = (e: Event) => {
        const target = (e as CustomEvent<string>).detail;
        motion.scrollTo(target === "top" ? 0 : target);
      };
      window.addEventListener(EVENTS.scrollTo, onScrollTo);

      teardown = () => {
        window.removeEventListener(EVENTS.ready, play);
        window.removeEventListener(EVENTS.scrollTo, onScrollTo);
        stopInteractions();
        motion.dispose();
      };
    };
    void boot();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return null;
}
