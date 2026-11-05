import type { NextConfig } from "next";

/**
 * Security + performance headers applied to every route.
 * Good headers are a (small) ranking + trust signal and protect visitors.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["three", "gsap"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Long-lived caching for static brand assets.
        source: "/(brand|icons|og)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // One canonical host: www → apex (avoids duplicate-content splits).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.asteroid.design" }],
        destination: "https://asteroid.design/:path*",
        permanent: true,
      },
      // Never serve the default locale under a prefix — one URL per page.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
