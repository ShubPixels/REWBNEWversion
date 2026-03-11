import path from "node:path";
import type { NextConfig } from "next";

type RemotePatterns = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>;

function parseHostnameFromUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function parseCsvHostnames(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter((hostname) => hostname.length > 0);
}

function createRemotePatterns(hostname: string): RemotePatterns {
  const isLocalhost = hostname === "localhost" || hostname.endsWith(".local");
  const patterns: RemotePatterns = [
    {
      protocol: "https",
      hostname,
    },
  ];

  if (isLocalhost) {
    patterns.unshift({
      protocol: "http",
      hostname,
    });
  }

  return patterns;
}

const configuredHostnames = new Set<string>();
const explicitWordPressHostname = process.env.NEXT_PUBLIC_WORDPRESS_HOSTNAME?.trim().toLowerCase();
if (explicitWordPressHostname) {
  configuredHostnames.add(explicitWordPressHostname);
}

const siteHostname = parseHostnameFromUrl(process.env.NEXT_PUBLIC_SITE_URL);
if (siteHostname) {
  configuredHostnames.add(siteHostname);
}

const wordPressBaseHostname = parseHostnameFromUrl(process.env.NEXT_PUBLIC_WORDPRESS_URL);
if (wordPressBaseHostname) {
  configuredHostnames.add(wordPressBaseHostname);
}

const wordPressGraphqlHostname = parseHostnameFromUrl(process.env.WORDPRESS_GRAPHQL_ENDPOINT);
if (wordPressGraphqlHostname) {
  configuredHostnames.add(wordPressGraphqlHostname);
}

parseCsvHostnames(process.env.NEXT_PUBLIC_IMAGE_HOSTNAMES).forEach((hostname) => configuredHostnames.add(hostname));

if (configuredHostnames.size === 0) {
  configuredHostnames.add("example.com");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [...configuredHostnames].flatMap((hostname) => createRemotePatterns(hostname)),
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
