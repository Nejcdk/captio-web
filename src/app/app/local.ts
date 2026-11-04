import { useSyncExternalStore } from "react";
import { store } from "./client";
import type { Recording, RecordingBody } from "./data";

// Recordings that live only in this browser, shown in the lists next to the
// account's: the Welcome demo (never synced, like on the phone), files still
// being transcribed (and ones that failed, with Try again), and whatever is
// saved in the dev preview. Kept in localStorage, except rows in flight.

export type LocalRecording = Recording & { local: true; body?: RecordingBody; hiddenFromAll?: boolean };

const KEY = "captio_local_recordings";
let list: LocalRecording[] | null = null;
const listeners = new Set<() => void>();

function read(): LocalRecording[] {
  if (!list) list = store.get<LocalRecording[]>(KEY, []);
  return list;
}

function write(next: LocalRecording[]) {
  list = next;
  // In-flight uploads aren't kept: a reload starts them over from the queue.
  store.set(KEY, next.filter(r => r.status !== "transcribing"));
  listeners.forEach(l => l());
}

export function getLocal(id: string): LocalRecording | undefined {
  return read().find(r => r.id === id);
}

export function putLocal(rec: Omit<LocalRecording, "local">) {
  const next = read().filter(r => r.id !== rec.id);
  write([{ ...rec, local: true }, ...next]);
}

export function patchLocal(id: string, patch: Partial<LocalRecording>) {
  write(read().map(r => (r.id === id ? { ...r, ...patch } : r)));
}

export function removeLocal(id: string) {
  write(read().filter(r => r.id !== id));
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: LocalRecording[] = [];

export function useLocalRecordings(): LocalRecording[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

// Per-recording extras the app keeps on the phone only (app: recordings.actions,
// transcribedUntil): the Actions tab's other results and similar.
export function getExtras<T>(id: string, key: string, fallback: T): T {
  return store.get<Record<string, T>>(`captio_rec_${id}`, {})[key] ?? fallback;
}

export function setExtras(id: string, key: string, value: unknown) {
  const all = store.get<Record<string, unknown>>(`captio_rec_${id}`, {});
  store.set(`captio_rec_${id}`, { ...all, [key]: value });
}
