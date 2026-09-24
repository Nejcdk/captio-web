import posthog from "posthog-js";

// Same PostHog project (EU) as the iOS app, so web traffic and app funnels live
// side by side. Cookieless: nothing is stored in cookies/localStorage, unique
// visitors are counted with PostHog's server-side daily hash — this keeps the
// privacy policy's "no tracking cookies, no consent banner" promise true.
// Requires "Cookieless server hash mode" enabled in the PostHog project settings,
// otherwise events are dropped.
// Events go through /ingest (rewrite in next.config.ts) so ad blockers that
// block *.posthog.com don't silently drop visits.
if (process.env.NODE_ENV === "production") {
  posthog.init("phc_onGfnjHHLYmduU7NwB4i3Q6UmVr6L75cjM4Jh7qQBbX2", {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-05-30",
    cookieless_mode: "always",
    person_profiles: "never",
    disable_session_recording: true,
  });

  posthog.register({ platform: "web" });

  // Conversion event: any click on an App Store link, wherever it sits on the site.
  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='apps.apple.com']");
      if (link) {
        posthog.capture("app_store_click", {
          page: window.location.pathname,
          link_text: link.textContent?.trim().slice(0, 80) || undefined,
        });
      }
    },
    { capture: true },
  );
}
