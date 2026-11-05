import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Website Design Agency in Dubai`,
    short_name: site.name,
    description: "Premium website design agency in Dubai, UAE. 3D, bilingual, SEO-ready websites.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0A09",
    theme_color: "#0B0A09",
    lang: "en-AE",
    dir: "ltr",
    categories: ["business", "design"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
