"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import { prefersReducedMotion } from "@/lib/env";

/**
 * EN | ع toggle. Real <a href> links (crawlable, work without JS);
 * with JS we play a short wipe before navigating.
 */
export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const target: Locale = locale === "en" ? "ar" : "en";
  const href = localePath(target);

  const onClick = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const wipe = document.getElementById("langWipe");
    try {
      sessionStorage.setItem("ast-wipe", "1");
    } catch {
      /* ignore */
    }
    wipe?.classList.add("in");
    window.setTimeout(() => router.push(href), 520);
  };

  return (
    <Link className="lang" href={href} hrefLang={target} title={label} onClick={onClick} prefetch>
      <span data-l="en">EN</span>
      <span data-l="ar">ع</span>
      <span className="sr-only" lang={target}>{label}</span>
    </Link>
  );
}
