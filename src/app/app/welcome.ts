import { recordError, store } from "./client";
import type { Folder, SummaryBlock, TranscriptSegment } from "./data";
import { getLocal, putLocal } from "./local";
import { t } from "./i18n";

// The welcome recording (app repo: src/lib/welcome.ts, folders.ts): the
// two-host intro to Captio AI, in a Welcome folder that exists only here,
// never synced. Seeded once per browser, in the browser's language from the
// same public bucket the app uses, English (bundled) when that fails.

export const WELCOME_ID = "welcome-v5";
export const WELCOME_FOLDER_ID = "welcome-folder";
export const ONBOARDING_DEMO_PREFIX = "onboarding-demo-";
export const isStarterRecording = (id: string) => id.startsWith("welcome-v") || id.startsWith(ONBOARDING_DEMO_PREFIX);

// Its name in the app's language (app: folders.welcomeName), read when it's
// shown, never at import time; code knows the folder by WELCOME_FOLDER_ID. A
// name the user gave it here replaces it (folders.ts, applyChanges).
export const WELCOME_FOLDER: Folder = {
  id: WELCOME_FOLDER_ID, ownerId: "", icon: "mood-smile", color: "#4DA8F7", position: -1,
  get name() { return t("folders.welcomeName"); },
};

type WelcomeContent = {
  title: string; emoji: string; speakerNames: Record<string, string>; durationSeconds: number;
  segments: TranscriptSegment[]; summary: SummaryBlock[];
};

const SEEDED_FLAG = `captio_welcome_seeded_${WELCOME_ID}`;

async function fetchContent(supabaseUrl: string): Promise<WelcomeContent> {
  const lang = navigator.language.toLowerCase().split("-")[0];
  if (lang !== "en" && lang !== "or" && supabaseUrl) {
    try {
      const res = await fetch(`${supabaseUrl}/storage/v1/object/public/welcome/${WELCOME_ID.slice("welcome-".length)}/${lang}.json`, { signal: AbortSignal.timeout(10_000) });
      if (res.ok) {
        const content = (await res.json()) as WelcomeContent;
        if (content.segments?.length) return content;
      }
    } catch (e) {
      // English below.
      recordError("welcome_download", e, { language: lang });
    }
  }
  return (await (await fetch("/web-app/welcome/en.json")).json()) as WelcomeContent;
}

// Once per browser; deleting it is final (the flag stays).
export async function seedWelcome(userId: string, supabaseUrl: string): Promise<void> {
  if (store.get<boolean>(SEEDED_FLAG, false) || getLocal(WELCOME_ID)) return;
  store.set(SEEDED_FLAG, true);
  try {
    const c = await fetchContent(supabaseUrl);
    putLocal({
      id: WELCOME_ID,
      userId,
      title: c.title,
      emoji: c.emoji,
      durationSeconds: c.durationSeconds,
      createdAt: Date.now(),
      folderId: WELCOME_FOLDER_ID,
      body: { segments: c.segments, speakerNames: c.speakerNames, labels: null, people: {}, summary: c.summary },
    });
  } catch (e) {
    recordError("welcome_seed", e);
    store.set(SEEDED_FLAG, false);
  }
}
