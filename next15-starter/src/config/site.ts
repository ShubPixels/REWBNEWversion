import { getPublicEnv } from "@/lib/env";

const publicEnv = getPublicEnv();

export const siteConfig = {
  name: "Next.js WP Starter",
  description: "Production-ready Next.js 15 App Router starter for headless WordPress.",
  url: publicEnv.siteUrl,
  locale: "en-US",
};

export type SiteConfig = typeof siteConfig;
