import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

export const metadata = { title: "Page not found | Asteroid", robots: { index: false, follow: true } };

/** Lost in space. Keeps visitors (and link equity) on the site. */
export default function NotFound() {
  return (
    <main className="final" style={{ minHeight: "100vh" }} id="main">
      <BrandMark className="nf-mark" />
      <div className="mono">404 — Lost in space</div>
      <h1 style={{ fontSize: "clamp(64px,12vw,200px)", fontWeight: 600, letterSpacing: "-.07em", lineHeight: 0.85 }}>
        Off <span className="serif">orbit.</span>
      </h1>
      <p>This page drifted away. Let&apos;s get you back to somewhere useful.</p>
      <div className="ctas">
        <Link className="btn btn-primary" href="/">
          Back to Asteroid
        </Link>
        <Link className="btn btn-ghost" href="/ar">
          العربية
        </Link>
      </div>
    </main>
  );
}
