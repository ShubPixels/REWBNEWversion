import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

function getSiteOrigin(): string {
  try {
    return new URL(siteConfig.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    host: origin,
    sitemap: [`${origin}/sitemap.xml`],
  };
}
