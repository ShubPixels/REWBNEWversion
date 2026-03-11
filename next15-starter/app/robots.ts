import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

function getSiteOrigin(): string {
  try {
    return new URL(siteConfig.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function shouldDisallowIndexing(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }
  } catch {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  const disallowAll = shouldDisallowIndexing(origin);

  return {
    rules: [
      disallowAll
        ? {
            userAgent: "*",
            disallow: "/",
          }
        : {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/"],
          },
    ],
    host: origin,
    sitemap: [`${origin}/sitemap.xml`],
  };
}
