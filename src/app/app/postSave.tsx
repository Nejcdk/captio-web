"use client";

import { api, capture, getSupabase, isPreview, recordError, recordErrorOnce, store, isGuest } from "./client";
import { loadLibrary, updateRecording, type Folder, type Library, type Recording } from "./data";
import { notifyLibraryChanged } from "./events";
import { FolderArt } from "./FolderArt";
import { getLocal, patchLocal } from "./local";
import { t } from "./i18n";
import { openEditSheet } from "./editSheet";
import { openPaywall } from "./paywallStore";
import { isPlusNow, plusForSale } from "./plus";
import { PREVIEW_LIBRARY, PREVIEW_USER } from "./preview";
import { shouldAskForRating, showRatingPrompt } from "./RatingPrompt";
import { Button, isCardOpen, ModalCard, QuietButton, showCard } from "./ui";
import { FREE_DAILY_CREDITS } from "./usage";
import { WELCOME_FOLDER_ID, isStarterRecording } from "./welcome";

// After a recording is saved (live or upload), the app's follow-ups, one at a
// time and never over another card:
// 1. the folder question (app: FolderPrompts, shared.ts suggestFolder): the
//    user's own folders (never Welcome, never a shared one) go to the AI with
//    a few titles each; only a sure pick asks "Save to {folder}?", and nothing
//    moves without the yes;
// 2. the transcript rating (live recordings, lib/transcriptRating rules);
// 3. Plus after the first saved recording (app: firstSavePlus.ts), for an
//    account made in the last 24 hours, never for Plus or after a save the
//    free limit ended.
export type SavedRecording = {
  id: string;
  transcript: string;
  folderId: string | null;
  where: "live" | "upload";
  // Optional details the caller knows; read from the account otherwise.
  kind?: "captions" | "translation" | "upload";
  durationSeconds?: number;
  limitStop?: boolean;
};

const FIRST_SAVE_KEY = "captio_first_save_plus";
const DAY_MS = 24 * 3600_000;

// Shown as a card; resolves once it's answered or closed.
function cardDone(render: (done: () => void) => React.ReactNode): Promise<void> {
  return new Promise(resolve => {
    showCard(close => render(() => { close(); setTimeout(resolve, 250); }));
  });
}

// Something else is up: the paywall, the captions sheet, a card.
function screenBusy(): boolean {
  return isCardOpen() || !!document.querySelector(".paywall, .cs");
}

async function me(): Promise<{ id: string; createdAt: number | null }> {
  if (isPreview()) return { id: PREVIEW_USER, createdAt: Date.now() };
  const { data } = await getSupabase().auth.getSession();
  const user = data.session?.user;
  return { id: user?.id ?? "", createdAt: user?.created_at ? Date.parse(user.created_at) : null };
}

async function library(): Promise<Library> {
  if (isPreview()) return PREVIEW_LIBRARY;
  return loadLibrary(getSupabase());
}

export function afterSave(saved: SavedRecording): void {
  // A guest has no folders, ratings table or plans to buy without an account.
  if (isGuest()) return;
  void run(saved);
}

async function run(saved: SavedRecording) {
  if (!saved.transcript.trim()) return;
  // Let the sheet close and the recording open first (app: ~1 s after the title).
  await new Promise(r => setTimeout(r, saved.where === "live" ? 1000 : 750));
  let lib: Library | null = null;
  let user = { id: "", createdAt: null as number | null };
  try {
    [lib, user] = await Promise.all([library(), me()]);
  } catch (e) {
    recordErrorOnce("post_save_load", e);
  }
  const fromAccount = lib?.recordings.find(r => r.id === saved.id);
  const local = getLocal(saved.id);
  const rec: Recording | undefined = fromAccount ?? local;
  const durationSeconds = saved.durationSeconds ?? rec?.durationSeconds ?? 0;

  if (lib && rec && user.id) await askFolder(saved, rec, lib, user.id);

  const kind = saved.kind ?? (saved.where === "upload" ? "upload" : "captions");
  if (saved.where === "live" && kind !== "upload" && shouldAskForRating(durationSeconds) && !screenBusy()) {
    await showRatingPrompt(kind, durationSeconds, lib ? ownCount(lib, user.id) : 0);
  }

  if (lib && user.id) await maybeFirstSavePlus(saved, lib, user);
}

// ─── The folder question ──────────────────────────────────────────────────────

async function askFolder(saved: SavedRecording, rec: Recording, lib: Library, myId: string) {
  if (saved.folderId || rec.folderId) return;
  const members = (f: Folder) => new Set(lib.people.filter(p => p.folderId === f.id).map(p => p.userId)).size;
  const folders = lib.folders.filter(f => f.id !== WELCOME_FOLDER_ID && f.ownerId === myId && members(f) <= 1);
  if (!folders.length) return;
  const choices = folders.map(f => ({
    id: f.id,
    name: f.name,
    // A few titles already in it say more than the name alone.
    examples: lib.recordings.filter(r => r.folderId === f.id).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map(r => r.title),
  }));
  let folderId: string | null = null;
  try {
    const res = await api<{ folderId: string | null; picked: boolean; confidence: string | null }>(
      "/api/app/folder", { transcript: saved.transcript, folders: choices },
    );
    folderId = res.folderId;
    capture("folder_suggestion", { suggested: !!res.folderId, picked: res.picked, confidence: res.confidence, folders: choices.length });
  } catch (e) {
    // No question this time; reported once.
    recordErrorOnce("folder_suggest", e);
    return;
  }
  const folder = folderId ? folders.find(f => f.id === folderId) : undefined;
  if (!folder) return;
  if (screenBusy()) {
    capture("folder_suggestion_skipped", { reason: "card_open", where: saved.where });
    return;
  }
  capture("folder_suggestion_shown", { where: saved.where });
  await cardDone(done => {
    const answer = async (choice: "yes" | "no" | "other") => {
      let moved = false;
      if (choice === "yes") {
        try {
          if (getLocal(rec.id)) patchLocal(rec.id, { folderId: folder.id });
          else if (!isPreview()) await updateRecording(getSupabase(), rec.id, { folderId: folder.id });
          moved = true;
          notifyLibraryChanged();
        } catch (e) {
          recordError("folder_suggestion_move", e);
        }
      }
      capture("folder_suggestion_answered", { answer: choice, moved, where: saved.where });
      done();
      if (choice === "other") setTimeout(() => openEditSheet(rec, "detail", { mode: "folder" }), 300);
    };
    return (
      <ModalCard
        art={<FolderArt color={folder.color} icon={folder.icon} width={110} filled />}
        title={t("folders.suggestTitle", { folder: folder.name })}
        body={t("folders.suggestBody", { title: rec.title })}
        onClose={() => void answer("no")}
      >
        <Button label={t("folders.suggestYes")} size="compact" onPress={() => void answer("yes")} style={{ marginTop: 6 }} />
        <Button label={t("folders.suggestOther")} variant="secondary" size="compact" onPress={() => void answer("other")} />
        <QuietButton label={t("common.noThanks")} onPress={() => void answer("no")} />
      </ModalCard>
    );
  });
}

// ─── Plus after the first saved recording ─────────────────────────────────────

async function maybeFirstSavePlus(saved: SavedRecording, lib: Library, user: { id: string; createdAt: number | null }) {
  if (store.get<string | null>(FIRST_SAVE_KEY, null)) return;
  const own = ownCount(lib, user.id);
  const due = !isPlusNow() && plusForSale() && !saved.limitStop && !!user.createdAt && Date.now() - user.createdAt < DAY_MS && own <= 1;
  // Decided once, on the first save this browser sees.
  store.set(FIRST_SAVE_KEY, "done");
  if (!due || screenBusy()) return;
  capture("first_save_plus_prompt_shown", { minutes_since_save: 0 });
  capture("plus_button_shown", { where: "first_save", style: "gold" });
  await cardDone(done => (
    <ModalCard
      owl="owl-plus"
      title={t("firstSavePlus.title")}
      body={t("firstSavePlus.body", { credits: FREE_DAILY_CREDITS })}
      onClose={() => { capture("first_save_plus_prompt_dismissed"); done(); }}
    >
      <Button
        label={t("limit.cta")}
        variant="gold"
        size="compact"
        onPress={() => {
          capture("first_save_plus_prompt_upgrade");
          capture("plus_button_tapped", { where: "first_save", style: "gold" });
          done();
          openPaywall("first_save");
        }}
      />
      <QuietButton label={t("common.noThanks")} onPress={() => { capture("first_save_plus_prompt_dismissed"); done(); }} />
    </ModalCard>
  ));
}

// The user's own saved recordings (not the demos, not a friend's), the one
// just saved included.
function ownCount(lib: Library, userId: string): number {
  return [...lib.recordings, ...localOwn(userId)]
    .filter((r, i, all) => r.userId === userId && !isStarterRecording(r.id) && all.findIndex(x => x.id === r.id) === i).length;
}

// This browser's own recordings that aren't on the account (preview saves).
function localOwn(userId: string): Recording[] {
  try {
    return (JSON.parse(localStorage.getItem("captio_local_recordings") ?? "[]") as Recording[]).filter(r => r.userId === userId);
  } catch {
    return [];
  }
}
