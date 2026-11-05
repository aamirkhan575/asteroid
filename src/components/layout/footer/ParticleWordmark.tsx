"use client";

import { useEffect, useRef } from "react";

/** "asteroid" drawn with thousands of particles that scatter from the cursor and burst on click. */
export function ParticleWordmark({ hint }: { hint: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    type P = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; h: number };
    let particles: P[] = [];
    let W = 0;
    let H = 0;
    let visible = false;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d")!;
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";
      let size = H * 1.15;
      o.font = `700 ${size}px ${family}`;
      const tw = o.measureText("asteroid").width;
      if (tw > W * 0.98) {
        size *= (W * 0.98) / tw;
        o.font = `700 ${size}px ${family}`;
      }
      o.fillStyle = "#fff";
      o.fillText("asteroid", (W - o.measureText("asteroid").width) / 2, H * 0.86);
      const data = o.getImageData(0, 0, W, H).data;
      const gap = W < 700 ? 4 : 5;
      particles = [];
      for (let y = 0; y < H; y += gap)
        for (let x = 0; x < W; x += gap)
          if (data[(y * W + x) * 4 + 3] > 128)
            particles.push({ x: x + (Math.random() - 0.5) * W * 0.6, y: y + H * (Math.random() + 0.3), ox: x, oy: y, vx: 0, vy: 0, h: x / W });
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() * 0.001;
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12100) {
          const f = (1 - Math.sqrt(d2) / 110) * 6;
          const a = Math.atan2(dy, dx);
          p.vx += Math.cos(a) * f;
          p.vy += Math.sin(a) * f;
        }
        p.vx = (p.vx + (p.ox - p.x) * 0.06) * 0.82;
        p.vy = (p.vy + (p.oy - p.y) * 0.06) * 0.82;
        p.x += p.vx;
        p.y += p.vy;
        const speed = Math.min(Math.hypot(p.vx, p.vy) / 6, 1);
        const wave = 0.5 + 0.5 * Math.sin(p.h * 12 - t * 2.2);
        ctx.fillStyle =
          speed > 0.08
            ? `rgb(255,${(120 + (1 - speed) * 80) | 0},60)`
            : `rgb(${(90 + 165 * Math.max(speed, wave * 0.55)) | 0},${(70 + 40 * wave + 20 * speed) | 0},${(60 - 30 * speed) | 0})`;
        const s = speed > 0.08 ? 2.4 : 1.8;
        ctx.fillRect(p.x, p.y, s, s);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => (mouse.x = mouse.y = -9999);
    const onDown = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      particles.forEach((p) => {
        const a = Math.atan2(p.y - cy, p.x - cx);
        const f = Math.max(0, 40 - Math.hypot(p.y - cy, p.x - cx) * 0.08);
        p.vx += Math.cos(a) * f;
        p.vy += Math.sin(a) * f;
      });
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointerdown", onDown);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(cv);
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);
    void document.fonts.ready.then(() => {
      build();
      raf = requestAnimationFrame(draw);
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="mc-word">
      <span className="hint" aria-hidden="true">
        {hint}
      </span>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
