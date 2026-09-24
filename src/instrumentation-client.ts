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

  // Conversion events, caught site-wide so new buttons are tracked automatically:
  //   app_store_click       — any link to the App Store (the real outbound click)
  //   download_button_click — header "Download" buttons that jump to #download
  // sendBeacon + send_instantly: on iPhone the App Store app takes over the page
  // immediately, and a normally queued event would be lost.
  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const event_name = href.includes("apps.apple.com")
        ? "app_store_click"
        : href.endsWith("#download")
          ? "download_button_click"
          : null;
      if (!event_name) return;

      posthog.capture(
        event_name,
        {
          page: window.location.pathname,
          location: linkLocation(link),
          // 1-based order among App Store links on this page (1 = first/top one)
          position:
            event_name === "app_store_click"
              ? [...document.querySelectorAll("a[href*='apps.apple.com']")].indexOf(link) + 1
              : undefined,
          link_text: (link as HTMLElement).innerText?.replace(/\s+/g, " ").trim().slice(0, 80) || undefined,
        },
        { transport: "sendBeacon", send_instantly: true },
      );
    },
    { capture: true },
  );
}

// Human-readable spot on the page: "header", "footer", the enclosing section's
// heading, or — for inline CTAs between sections — "after: <previous heading>".
function linkLocation(link: Element): string {
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  const heading = (section: Element | null) =>
    section?.querySelector("h1, h2")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 60);

  const section = link.closest("section");
  if (section) return heading(section) || section.id || "section";

  const sections = [...document.querySelectorAll("section")];
  const previous = sections.filter(
    (s) => s.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).pop();
  return previous ? `after: ${heading(previous) ?? "section"}` : "body";
}
