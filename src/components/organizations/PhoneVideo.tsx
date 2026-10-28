"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// A short muted loop of the real app in an iPhone frame (the app repo's
// onboarding feature videos, assets/features, re-encoded to 600 px wide in
// public/organizations). Nothing downloads until it scrolls into view, it
// pauses when it leaves, and people who asked their device for less motion
// get the still picture with controls instead of autoplay. The frames have a
// white background baked in, so they sit on white: no shadow, no tint behind
// (Nejc 2026-10-28).

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function PhoneVideo({ name, label, priority = false }: { name: string; label: string; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === "none") video.preload = "auto";
          video.play().catch(() => {
            // Low-power mode and some in-app browsers block autoplay: the poster stays.
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.2 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      src={`/organizations/${name}.mp4`}
      poster={`/organizations/${name}.jpg`}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "none"}
      controls={reduced}
      aria-label={label}
      width={600}
      height={1258}
      className="h-auto w-full select-none"
    />
  );
}
