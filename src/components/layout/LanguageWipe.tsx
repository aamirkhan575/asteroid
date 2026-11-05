"use client";

import { useEffect, useRef } from "react";

/** Full-screen curtain used when switching language; reveals the new page on arrival. */
export function LanguageWipe({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ast-wipe")) {
        sessionStorage.removeItem("ast-wipe");
        const el = ref.current;
        el?.classList.add("arrive");
        window.setTimeout(() => el?.classList.remove("arrive"), 900);
      }
    } catch {
      /* ignore */
    }
  }, []);
  return (
    <div className="lang-wipe" id="langWipe" ref={ref} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
