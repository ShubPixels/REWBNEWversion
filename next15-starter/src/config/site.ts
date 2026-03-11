export const siteConfig = {
  name: "Next.js WP Starter",
  description: "Production-ready Next.js 15 App Router starter for headless WordPress.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-US",
};

export type SiteConfig = typeof siteConfig;
