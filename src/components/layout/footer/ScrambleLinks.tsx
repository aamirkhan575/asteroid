"use client";

import { useEffect } from "react";

/** Decoding/scramble text effect on footer links (Latin only — Arabic letters must stay joined). */
export function ScrambleLinks() {
  useEffect(() => {
    if (document.documentElement.lang === "ar") return;
    const glyphs = "!<>-_\\/[]{}=+*^?#01";
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLAnchorElement>("[data-scramble]").forEach((a) => {
      const span = a.querySelector("span");
      const node = span?.lastChild;
      if (!node) return;
      const text = node.textContent ?? "";
      let timer = 0;
      const enter = () => {
        let frame = 0;
        window.clearInterval(timer);
        timer = window.setInterval(() => {
          frame++;
          node.textContent = Array.from(text)
            .map((c, i) => (i < frame / 1.6 || c === " " ? c : glyphs[Math.floor(Math.random() * glyphs.length)]))
            .join("");
          if (frame / 1.6 >= text.length) {
            window.clearInterval(timer);
            node.textContent = text;
          }
        }, 28);
      };
      a.addEventListener("pointerenter", enter);
      cleanups.push(() => {
        a.removeEventListener("pointerenter", enter);
        window.clearInterval(timer);
        node.textContent = text;
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
