import list from "./app-images.json";

// The site's pictures of the app, made by scripts/app-images.mjs into
// public/app/<name>.webp. Each one has a fixed address named after what it
// shows and an alt text that names Captio AI, so image search (and the
// pictures in ChatGPT's answers) can tell what they are. Pages show them
// `unoptimized` on purpose: through the image optimizer their address carries a
// deploy id and changes with every deploy.

export type AppImage = { src: string; alt: string; width: number; height: number };

type Entry = { from: string; name: string; page: string | null; alt: string; w: number; h: number };
const entries = list as Entry[];

function toImage(e: Entry): AppImage {
  return { src: `/app/${e.name}.webp`, alt: e.alt, width: e.w, height: e.h };
}

/** A picture by its mockup's file name in public/ ("LC_mockup_1.png"). */
export function appImage(from: string): AppImage {
  const e = entries.find((x) => x.from === from);
  if (!e) throw new Error(`No app image for ${from}: add it to src/lib/app-images.json and run node scripts/app-images.mjs`);
  return toImage(e);
}

/** The pictures a page shows, in order ("home", "use-case", or a feature page's slug). */
export function pageImages(page: string): AppImage[] {
  return entries.filter((e) => e.page === page).map(toImage);
}

/** The app's best screens for SoftwareApplication.screenshot: one per main feature. */
export const SCREENSHOTS = [
  "LC_mockup_4.png",
  "LT_mockup_3.png",
  "AT_mockup_1.png",
  "AS_mockup_3.png",
  "RV_mockup_3.png",
  "SD_mockup_2.png",
  "RS_mockup_1.png",
  "AA_mockup_1.png",
].map(appImage);
