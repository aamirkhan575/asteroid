import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * All scroll + intro choreography in one place.
 * Components only add classes / data-attributes; this file decides how they move.
 *
 * Hooks used in markup:
 *   .reveal               fade-up when entering the viewport
 *   [data-count]          number counts up from 0
 *   #manifestoText .w     words light up while scrolling the manifesto
 *   #steps / #rail        process rail fills on scroll
 *   .work-pin/#workTrack  horizontal gallery (desktop only)
 */

gsap.registerPlugin(ScrollTrigger);

export interface MotionHandle {
  lenis: Lenis | null;
  playIntro: (onProgress?: (v: number) => void) => void;
  scrollTo: (target: string | HTMLElement | number) => void;
  refresh: () => void;
  /** Rebuild word-reveal after the manifesto text changes. */
  rebindManifesto: () => void;
  dispose: () => void;
}

export function initMotion({ reduce }: { reduce: boolean }): MotionHandle {
  const ctx = gsap.context(() => undefined);
  let lenis: Lenis | null = null;
  let manifestoTween: gsap.core.Tween | null = null;

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollTo = (target: string | HTMLElement | number) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, offset: typeof target === "number" ? 0 : -20 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView({ behavior: "smooth" });
  };

  // In-page anchor links use smooth scroll.
  const onAnchorClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!;
    const el = id === "#top" ? 0 : document.querySelector<HTMLElement>(id);
    if (el === null) return;
    e.preventDefault();
    scrollTo(el);
    history.replaceState(null, "", id === "#top" ? location.pathname : id);
  };
  document.addEventListener("click", onAnchorClick);

  const bindManifesto = () => {
    manifestoTween?.scrollTrigger?.kill();
    manifestoTween?.kill();
    if (reduce) return;
    manifestoTween = gsap.to("#manifestoText .w", {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: "#manifesto", start: "top 65%", end: "bottom 75%", scrub: true },
    });
  };

  const setupScroll = () => {
    if (reduce) return;
    ctx.add(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
        gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
      );

      gsap.to(".hero h1", {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      bindManifesto();

      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        if (!end) return;
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
        });
      });

      const steps = document.querySelectorAll(".step");
      gsap.to("#rail", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#steps",
          start: "top 75%",
          end: "bottom 55%",
          scrub: true,
          onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle("on", self.progress > i / 4 + 0.02)),
        },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        const track = document.getElementById("workTrack");
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".work-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      gsap.from(".final h2", { scale: 0.85, opacity: 0, ease: "expo.out", duration: 1.4, scrollTrigger: { trigger: ".final", start: "top 70%" } });
      gsap.from(".mc-title, .term, .mods", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".mc", start: "top 75%" },
      });
    });
    ScrollTrigger.refresh();
  };

  const playIntro = (onProgress?: (v: number) => void) => {
    const state = { intro: 0 };
    if (reduce) {
      onProgress?.(1);
      setupScroll();
      return;
    }
    ctx.add(() => {
      gsap
        .timeline()
        .to(state, { intro: 1, duration: 2.2, ease: "expo.out", onUpdate: () => onProgress?.(state.intro) }, 0)
        .from(".hero h1 .ch", { yPercent: 110, rotate: 6, duration: 1.3, ease: "expo.out", stagger: 0.035 }, 0.05)
        .from(
          ".hero-kicker, .hero-eyebrow, .hero-copy, .hero-ctas > *, .scroll-cue, .hero-meta span",
          { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07 },
          0.45,
        )
        .from(".nav > *", { y: -30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, clearProps: "transform,opacity" }, 0.4);
    });
    setupScroll();
  };

  return {
    lenis,
    playIntro,
    scrollTo,
    refresh: () => ScrollTrigger.refresh(),
    rebindManifesto: bindManifesto,
    dispose: () => {
      document.removeEventListener("click", onAnchorClick);
      manifestoTween?.kill();
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis?.destroy();
    },
  };
}
