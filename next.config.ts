import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog reverse proxy (EU) — see src/instrumentation-client.ts
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // Required for PostHog API requests with trailing slashes
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
