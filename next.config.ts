import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed pages that were indexed — 301 them so search engines transfer any
  // signals instead of hitting a 404 (they would otherwise fall into /[language]).
  async redirects() {
    return [
      { source: "/demo", destination: "/live-captions", permanent: true },
      { source: "/pricing", destination: "/", permanent: true },
      { source: "/support", destination: "/", permanent: true },
    ];
  },
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
