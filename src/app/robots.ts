import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * /robots.txt — allow all search engines and AI answer engines
 * (being cited by ChatGPT/Perplexity/Gemini is the new "page one").
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
