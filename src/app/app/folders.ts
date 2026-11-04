import { useSyncExternalStore } from "react";
import { capture, generateId, getSupabase, isPreview, recordError, store } from "./client";
import type { Folder, Library, Recording, TranscriptSegment } from "./data";
import { notifyLibraryChanged } from "./events";
import { getLocal, patchLocal, removeLocal } from "./local";
import { deleteUpload } from "./upload";
import { dropLiveRest } from "./liveRest";
import { WELCOME_FOLDER_ID, WELCOME_ID } from "./welcome";

// Changing recordings and folders, the app's rules (app repo: lib/folders.ts,
// lib/folderSharing.ts, sync.ts folder writes, supabase/folders.sql and
// folder_sharing.sql): the same columns and RPCs, so the phone's next sync
// shows the change. Recordings that live only here (the Welcome demo, a file
// still transcribing, dev preview saves) change in ./local; the made-up dev
// preview changes in an overlay kept in memory. Every change asks the list to
// read again (notifyLibraryChanged).

export const FOLDER_NAME_MAX = 40;
export const FOLDER_DEFAULT_COLOR = "#4DA8F7";
export const FOLDER_COLORS = [
  "#C0362C", "#D35400", "#B7860B", "#1E8E3E", "#1C49F5", "#6D3FC0", "#B0306A",
  "#FF5A4F", "#FF9500", "#FFC530", "#34C759", "#4DA8F7", "#A55EEA", "#FF6FAE",
  "#FF9F99", "#FFC27A", "#FFE07A", "#9FE39A", "#A9D3FF", "#D3BBFF", "#FFB3D6",
  "#2C2C2E", "#5A5A5E", "#8E8E93", "#B5B5BA", "#D1D1D6", "#A2845E",
];

export function hslToHex(h: number, s: number, l: number): string {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
  return `#${((1 << 24) | (c(f(0)) << 16) | (c(f(8)) << 8) | c(f(4))).toString(16).slice(1)}`;
}

// ─── What the edit sheet and the folder pages read ────────────────────────────
// Home keeps it current (HomeColumn), so a sheet opened from anywhere (a row,
// the recording's ⋯) sees the same folders and people.

// openFolder: shows the Folders tab with that folder open (null = the grid).
type Context = { library: Library | null; me: string; openFolder: (id: string | null) => void };
let context: Context = { library: null, me: "", openFolder: () => {} };
export function setEditContext(next: Context) { context = next; }
export function editContext(): Context { return context; }

export const membersOf = (library: Library | null, folderId: string) =>
  new Set((library?.people ?? []).filter(p => p.folderId === folderId).map(p => p.userId)).size;
export const isSharedFolder = (library: Library | null, folderId: string) => membersOf(library, folderId) > 1;
// Ours to edit, delete and remove people from (the Welcome folder is ours).
export const ownsFolder = (f: Folder, me: string) => !f.ownerId || f.ownerId === me;
export const isWelcomeFolder = (f: Pick<Folder, "id">) => f.id === WELCOME_FOLDER_ID;

// ─── The Welcome folder's own settings (it's only in this browser) ────────────

type WelcomeSettings = { name?: string; color?: string; icon?: string };
const WELCOME_KEY = "captio_welcome_folder";

// ─── Overlay: the dev preview's changes, and the folders' order here ──────────

type Overlay = {
  recordings: Record<string, Partial<Recording> & { deleted?: boolean }>;
  folders: Record<string, Partial<Folder> & { deleted?: boolean }>;
  added: Folder[];
};
let overlay: Overlay = { recordings: {}, folders: {}, added: [] };
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };

// The order of the Folders grid in this browser (a friend's folder can't be
// moved on the server, so the order is kept here too, as the app keeps it on
// the phone).
const ORDER_KEY = "captio_folder_order";

export function useFolderChanges(): number {
  return useSyncExternalStore(
    l => { listeners.add(l); return () => listeners.delete(l); },
    () => version,
    () => 0,
  );
}

// The library as it should show now: the overlay applied, the Welcome folder's
// settings, the grid's order.
export function applyChanges(library: Library | null): Library | null {
  if (!library) return library;
  const welcome = store.get<WelcomeSettings>(WELCOME_KEY, {});
  const folders = [...library.folders, ...overlay.added.filter(a => !library.folders.some(f => f.id === a.id))]
    .map(f => ({ ...f, ...(f.id === WELCOME_FOLDER_ID ? welcome : {}), ...(overlay.folders[f.id] ?? {}) }))
    .filter(f => !(f as { deleted?: boolean }).deleted);
  const order = store.get<string[]>(ORDER_KEY, []);
  const rank = (f: Folder) => {
    const i = order.indexOf(f.id);
    return i >= 0 ? i : order.length + (f.position ?? 0) + 1000;
  };
  folders.sort((a, b) => rank(a) - rank(b));
  const ids = new Set(folders.map(f => f.id));
  const recordings = library.recordings
    .map(r => ({ ...r, ...(overlay.recordings[r.id] ?? {}) }))
    .filter(r => !(r as { deleted?: boolean }).deleted)
    // A folder that's gone: its recordings are back in All transcripts.
    .map(r => (r.folderId && !ids.has(r.folderId) && overlay.folders[r.folderId]?.deleted ? { ...r, folderId: null } : r));
  return { ...library, folders, recordings };
}

function patchOverlayRecording(id: string, patch: Partial<Recording> & { deleted?: boolean }) {
  overlay = { ...overlay, recordings: { ...overlay.recordings, [id]: { ...(overlay.recordings[id] ?? {}), ...patch } } };
  emit();
}

function patchOverlayFolder(id: string, patch: Partial<Folder> & { deleted?: boolean }) {
  if (overlay.added.some(f => f.id === id)) {
    overlay = { ...overlay, added: overlay.added.map(f => (f.id === id ? { ...f, ...patch } : f)).filter(f => !(f as { deleted?: boolean }).deleted) };
  } else {
    overlay = { ...overlay, folders: { ...overlay.folders, [id]: { ...(overlay.folders[id] ?? {}), ...patch } } };
  }
  emit();
}

// The list reads again; a recording's page reads its lines again too.
function changed(recordingId?: string) {
  notifyLibraryChanged();
  if (recordingId) window.dispatchEvent(new CustomEvent("captio-recording-changed", { detail: { id: recordingId } }));
  emit();
}

// ─── Recordings ───────────────────────────────────────────────────────────────

export type RecordingPatch = {
  title?: string; emoji?: string; folderId?: string | null; speakerNames?: Record<string, string>; segments?: TranscriptSegment[];
};

// One change to a recording, wherever it lives. Throws on a failed write.
export async function changeRecording(rec: Recording, patch: RecordingPatch): Promise<void> {
  const local = getLocal(rec.id);
  if (local) {
    const body = local.body;
    patchLocal(rec.id, {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.emoji !== undefined ? { emoji: patch.emoji } : {}),
      ...(patch.folderId !== undefined ? { folderId: patch.folderId } : {}),
      ...(body && (patch.speakerNames || patch.segments) ? {
        body: { ...body, ...(patch.speakerNames ? { speakerNames: patch.speakerNames } : {}), ...(patch.segments ? { segments: patch.segments } : {}) },
      } : {}),
    });
    changed(patch.speakerNames || patch.segments ? rec.id : undefined);
    return;
  }
  if (isPreview()) {
    const { speakerNames, segments, ...rest } = patch;
    void speakerNames; void segments;
    patchOverlayRecording(rec.id, rest);
    return;
  }
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.emoji !== undefined) row.emoji = patch.emoji;
  if (patch.folderId !== undefined) row.folder_id = patch.folderId;
  if (patch.speakerNames !== undefined) row.speaker_names = JSON.stringify(patch.speakerNames);
  if (patch.segments !== undefined) {
    row.segments = JSON.stringify(patch.segments);
    row.transcript = patch.segments.map(s => s.text).join(" ").trim();
  }
  const { error } = await getSupabase().from("recordings").update(row).eq("id", rec.id);
  if (error) throw error;
  changed(patch.speakerNames || patch.segments ? rec.id : undefined);
}

export async function moveRecording(rec: Recording, folderId: string | null, from: "home" | "detail"): Promise<void> {
  await changeRecording(rec, { folderId });
  capture("recording_moved", { to: folderId ? "folder" : "none", from, folders: context.library?.folders.length ?? 0 });
}

// The Welcome demo deleted from All transcripts stays in its Welcome folder;
// deleted inside the folder, it goes for good. Everything else: soft delete,
// as the app's sync does (deleted_at).
export async function deleteRecording(rec: Recording, scope: "all" | "folder"): Promise<void> {
  const local = getLocal(rec.id);
  if (rec.id === WELCOME_ID && local?.folderId && scope === "all") {
    patchLocal(rec.id, { hiddenFromAll: true });
    capture("welcome_demo_hidden");
    changed();
    return;
  }
  if (local) {
    // A file on its way (or one that failed) leaves the upload queue too.
    if (local.status) deleteUpload(rec.id);
    else removeLocal(rec.id);
  } else if (isPreview()) {
    patchOverlayRecording(rec.id, { deleted: true });
  } else {
    const { error } = await getSupabase().from("recordings").update({ deleted_at: new Date().toISOString() }).eq("id", rec.id);
    if (error) throw error;
  }
  // The session audio kept for its missed part isn't needed any more.
  dropLiveRest(rec.id);
  capture("recording_deleted");
  changed();
}

// ─── Folders ──────────────────────────────────────────────────────────────────

export type FolderFields = { name: string; color: string; icon: string };

const isCustomColor = (c: string) => !FOLDER_COLORS.includes(c.toUpperCase()) && !FOLDER_COLORS.includes(c);

export async function createFolder(fields: FolderFields, source: "home" | "move_sheet"): Promise<Folder> {
  const name = fields.name.trim().slice(0, FOLDER_NAME_MAX);
  const folders = context.library?.folders ?? [];
  const position = folders.reduce((m, f) => Math.max(m, f.position ?? 0), -1) + 1;
  const folder: Folder = { id: generateId(), ownerId: context.me, name, icon: fields.icon, color: fields.color, position };
  if (isPreview()) {
    overlay = { ...overlay, added: [...overlay.added, folder] };
    emit();
  } else {
    const { error } = await getSupabase().from("folders").insert({
      id: folder.id, owner_id: context.me, name, icon: folder.icon, color: folder.color, position, created_at: Date.now(),
    });
    if (error) throw error;
    changed();
  }
  capture("folder_created", { source, folders: folders.length + 1, icon: folder.icon || "none", custom_color: isCustomColor(folder.color) });
  return folder;
}

export async function updateFolder(folder: Folder, fields: FolderFields): Promise<void> {
  const name = fields.name.trim().slice(0, FOLDER_NAME_MAX);
  if (!name) return;
  if (isWelcomeFolder(folder)) {
    store.set(WELCOME_KEY, { name, color: fields.color, icon: fields.icon });
    emit();
  } else if (isPreview()) {
    patchOverlayFolder(folder.id, { name, color: fields.color, icon: fields.icon });
  } else {
    const { error } = await getSupabase().from("folders").update({ name, color: fields.color, icon: fields.icon }).eq("id", folder.id);
    if (error) throw error;
    changed();
  }
  capture("folder_edited");
}

// Its recordings go back to All transcripts (the server's trigger does it),
// never deleted.
export async function deleteFolder(folder: Folder): Promise<void> {
  const moved = (context.library?.recordings ?? []).filter(r => r.folderId === folder.id).length;
  if (isWelcomeFolder(folder)) {
    // The demo inside it goes back to All transcripts.
    if (getLocal(WELCOME_ID)) patchLocal(WELCOME_ID, { folderId: null, hiddenFromAll: false });
    changed();
  } else if (isPreview()) {
    patchOverlayFolder(folder.id, { deleted: true });
  } else {
    const { error } = await getSupabase().from("folders").update({ deleted_at: new Date().toISOString() }).eq("id", folder.id);
    if (error) throw error;
    changed();
  }
  capture("folder_deleted", { recordings: moved });
}

// The grid's order after a drag: kept here, and the positions of our own
// folders on the server (the phone reads them).
export async function reorderFolders(ids: string[]): Promise<void> {
  store.set(ORDER_KEY, ids);
  emit();
  capture("folders_reordered", { folders: ids.length });
  if (isPreview()) return;
  const own = (context.library?.folders ?? []).filter(f => ids.includes(f.id) && !isWelcomeFolder(f) && ownsFolder(f, context.me));
  const results = await Promise.all(own.map(f => getSupabase().from("folders").update({ position: ids.indexOf(f.id) }).eq("id", f.id)));
  const failed = results.find(r => r.error);
  if (failed?.error) {
    recordError("folders_reorder", failed.error);
    return;
  }
  notifyLibraryChanged();
}

// ─── Sharing (app: lib/folderSharing.ts) ──────────────────────────────────────

export const inviteLink = (code: string) => `https://captioai.app/f/${code}`;
export const normalizeCode = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

export type InviteResult = { ok: true; code: string; folderId: string } | { ok: false };

// Sharing the Welcome folder makes it a normal folder on the account under a
// new id (its fixed id would collide between accounts); the demo stays here.
async function promoteWelcome(folder: Folder): Promise<Folder> {
  const promoted = await createFolder({ name: folder.name, color: folder.color, icon: folder.icon }, "home");
  if (getLocal(WELCOME_ID)) patchLocal(WELCOME_ID, { folderId: promoted.id });
  capture("welcome_folder_shared");
  return promoted;
}

export async function createInvite(original: Folder, from: "folder" | "people"): Promise<InviteResult> {
  try {
    const folder = isWelcomeFolder(original) ? await promoteWelcome(original) : original;
    if (isPreview()) {
      capture("folder_invite_created", { from });
      return { ok: true, code: "PREVIEW1", folderId: folder.id };
    }
    const { data, error } = await getSupabase().rpc("create_folder_invite", { p_folder: folder.id });
    if (error || !data?.ok) {
      recordError("folder_invite", error?.message ?? data?.error ?? "no data");
      return { ok: false };
    }
    capture("folder_invite_created", { from });
    return { ok: true, code: String(data.code), folderId: folder.id };
  } catch (e) {
    recordError("folder_invite", e);
    return { ok: false };
  }
}

export type JoinResult =
  | { ok: true; folderId: string; already: boolean; name: string }
  | { ok: false; error: "invalid_code" | "folder_full" | "failed" };

export async function joinFolder(raw: string, from: "code" | "link"): Promise<JoinResult> {
  const code = normalizeCode(raw);
  capture("folder_join_started", { from });
  if (isPreview()) return { ok: false, error: "invalid_code" };
  const sb = getSupabase();
  const { data, error } = await sb.rpc("join_folder", { p_code: code, p_device: null });
  if (error || !data) {
    recordError("folder_join", error?.message ?? "no data");
    return { ok: false, error: "failed" };
  }
  if (!data.ok) {
    const reason = data.error === "invalid_code" || data.error === "folder_full" ? data.error : "failed";
    capture("folder_join_failed", { from, reason });
    return { ok: false, error: reason };
  }
  capture("folder_joined", { from, already: !!data.already, referral: !!data.referral });
  const folderId = String(data.folder_id);
  const { data: row } = await sb.from("folders").select("name").eq("id", folderId).maybeSingle();
  notifyLibraryChanged();
  return { ok: true, folderId, already: !!data.already, name: (row as { name?: string } | null)?.name ?? "" };
}

export async function leaveFolder(folder: Folder): Promise<boolean> {
  const members = membersOf(context.library, folder.id);
  if (isPreview()) {
    patchOverlayFolder(folder.id, { deleted: true });
    capture("folder_left", { members });
    return true;
  }
  const { data, error } = await getSupabase().rpc("leave_folder", { p_folder: folder.id });
  if (error || !data?.ok) {
    recordError("folder_leave", error?.message ?? data?.error ?? "no data");
    return false;
  }
  capture("folder_left", { members });
  changed();
  return true;
}

export async function removeMember(folder: Folder, userId: string): Promise<boolean> {
  const members = membersOf(context.library, folder.id);
  if (isPreview()) {
    capture("folder_member_removed", { members });
    return true;
  }
  const { data, error } = await getSupabase().rpc("remove_folder_member", { p_folder: folder.id, p_user: userId });
  if (error || !data?.ok) {
    recordError("folder_remove_member", error?.message ?? data?.error ?? "no data");
    return false;
  }
  capture("folder_member_removed", { members });
  changed();
  return true;
}
