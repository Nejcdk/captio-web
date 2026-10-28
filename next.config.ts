import type { NextConfig } from "next";
import { LOCALE_CODES } from "./src/i18n/locales";

// /de, /de/live-captions… (the translated home and feature pages).
const locale = `:locale(${LOCALE_CODES.join("|")})`;

const nextConfig: NextConfig = {
  // Removed pages that were indexed — 301 them so search engines transfer any
  // signals instead of hitting a 404 (they would otherwise fall into /[language]).
  async redirects() {
    return [
      { source: "/demo", destination: "/live-captions", permanent: true },
      { source: "/pricing", destination: "/", permanent: true },
      { source: "/support", destination: "/", permanent: true },
      // English has no prefix.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  // Language of the translated pages for crawlers that read the header (the
  // root layout's <html lang="en"> is corrected by script, see DocumentLanguage).
  async headers() {
    return [
      { source: `/${locale}`, headers: [{ key: "Content-Language", value: ":locale" }] },
      { source: `/${locale}/:path*`, headers: [{ key: "Content-Language", value: ":locale" }] },
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
