import { recordErrorOnce, store } from "./client";

// A live session's audio, kept in this browser (IndexedDB, 10-second blocks
// of 16 kHz mono PCM, so hours fit): the part of a session the live captions
// never covered (the free credits ran out, the connection was down too long)
// can still be transcribed from it on save or later ("Show the rest"), as the
// app does from its recording file. An index in localStorage says which
// sessions are kept and since when; anything older than 30 days goes.

const DB = "captio-session-audio";
const BLOCK_CHUNKS = 100; // 100 × 100 ms = 10 s
const CHUNK_BYTES = 3200; // 100 ms of 16 kHz 16-bit mono
const INDEX_KEY = "captio_session_audio";
const MAX_AGE_MS = 30 * 24 * 3600_000;

type IndexEntry = { createdAt: number; blocks: number };

// Sessions still recording: their audio is never removed underneath them.
const active = new Set<string>();

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("blocks");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest | void): Promise<T | undefined> {
  const db = await open();
  return new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction("blocks", mode);
    const req = fn(tx.objectStore("blocks"));
    tx.oncomplete = () => resolve(req ? (req.result as T) : undefined);
    tx.onerror = () => reject(tx.error);
  });
}

function index(): Record<string, IndexEntry> {
  return store.get<Record<string, IndexEntry>>(INDEX_KEY, {});
}

function setIndex(id: string, entry: IndexEntry | null) {
  const all = index();
  if (entry) all[id] = entry;
  else delete all[id];
  store.set(INDEX_KEY, all);
}

export class SessionAudio {
  readonly id: string;
  private pending: ArrayBuffer[] = [];
  private block = 0;
  private writes: Promise<unknown> = Promise.resolve();
  // False once the browser refused to keep it (private window, no space).
  ok = typeof indexedDB !== "undefined";

  constructor(id: string) {
    this.id = id;
    active.add(id);
    setIndex(id, { createdAt: Date.now(), blocks: 0 });
  }

  // The session ended: its audio may go once nothing needs it.
  release() {
    active.delete(this.id);
  }

  // One 100 ms chunk, in recording order.
  append(pcm: ArrayBuffer) {
    if (!this.ok) return;
    this.pending.push(pcm);
    if (this.pending.length >= BLOCK_CHUNKS) this.writeBlock();
  }

  private writeBlock() {
    if (!this.pending.length) return;
    const parts = this.pending;
    this.pending = [];
    const bytes = new Uint8Array(parts.reduce((n, p) => n + p.byteLength, 0));
    let at = 0;
    for (const p of parts) { bytes.set(new Uint8Array(p), at); at += p.byteLength; }
    const n = this.block++;
    const key = `${this.id}:${n}`;
    this.writes = this.writes
      .then(() => run("readwrite", s => s.put(bytes.buffer, key)))
      .then(() => setIndex(this.id, { createdAt: index()[this.id]?.createdAt ?? Date.now(), blocks: n + 1 }))
      .catch(e => {
        this.ok = false;
        recordErrorOnce("session_audio_store", e);
      });
  }

  // Everything written (the last, partial block too).
  async flush(): Promise<boolean> {
    this.writeBlock();
    await this.writes;
    return this.ok;
  }
}

// Seconds [from, to) of a kept session as 16 kHz mono WAV, or null.
export async function sessionWav(id: string, from: number, to: number): Promise<Blob | null> {
  const blocks = index()[id]?.blocks ?? 0;
  if (!blocks || to <= from) return null;
  const firstChunk = Math.max(0, Math.floor(from * 10));
  const lastChunk = Math.ceil(to * 10);
  const firstBlock = Math.floor(firstChunk / BLOCK_CHUNKS);
  const lastBlock = Math.min(blocks - 1, Math.floor((lastChunk - 1) / BLOCK_CHUNKS));
  const parts: Uint8Array[] = [];
  try {
    for (let b = firstBlock; b <= lastBlock; b++) {
      const buf = await run<ArrayBuffer>("readonly", s => s.get(`${id}:${b}`));
      if (!buf) continue;
      const start = b === firstBlock ? (firstChunk - b * BLOCK_CHUNKS) * CHUNK_BYTES : 0;
      const end = b === lastBlock ? Math.min(buf.byteLength, (lastChunk - b * BLOCK_CHUNKS) * CHUNK_BYTES) : buf.byteLength;
      if (end > start) parts.push(new Uint8Array(buf, start, end - start));
    }
  } catch (e) {
    recordErrorOnce("session_audio_read", e);
    return null;
  }
  const size = parts.reduce((n, p) => n + p.byteLength, 0);
  if (!size) return null;
  const header = new DataView(new ArrayBuffer(44));
  const text = (o: number, s: string) => { for (let i = 0; i < s.length; i++) header.setUint8(o + i, s.charCodeAt(i)); };
  text(0, "RIFF");
  header.setUint32(4, 36 + size, true);
  text(8, "WAVE");
  text(12, "fmt ");
  header.setUint32(16, 16, true);
  header.setUint16(20, 1, true);
  header.setUint16(22, 1, true);
  header.setUint32(24, 16000, true);
  header.setUint32(28, 32000, true);
  header.setUint16(32, 2, true);
  header.setUint16(34, 16, true);
  text(36, "data");
  header.setUint32(40, size, true);
  return new Blob([header.buffer, ...parts.map(p => p.slice().buffer as ArrayBuffer)], { type: "audio/wav" });
}

export function hasSessionAudio(id: string): boolean {
  return (index()[id]?.blocks ?? 0) > 0;
}

// Still needed by a recording's missing part (an hourly session's parts share
// one audio)? Then it stays.
function stillNeeded(id: string): boolean {
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith("captio_rec_")) continue;
      if (store.get<{ liveRest?: { audioId?: string } | null }>(key, {}).liveRest?.audioId === id) return true;
    }
  } catch {
    // Can't tell: keep it (the 30-day sweep removes it).
    return true;
  }
  return false;
}

export async function removeSessionAudio(id: string) {
  if (active.has(id) || stillNeeded(id)) return;
  const blocks = index()[id]?.blocks ?? 0;
  setIndex(id, null);
  try {
    await run("readwrite", s => { for (let b = 0; b < Math.max(blocks, 1) + 1; b++) s.delete(`${id}:${b}`); });
  } catch {
    // Nothing kept, nothing to remove.
  }
}

// Sessions kept longer than 30 days go (on load).
export function sweepSessionAudio() {
  const now = Date.now();
  for (const [id, entry] of Object.entries(index())) {
    if (now - entry.createdAt > MAX_AGE_MS) {
      active.delete(id);
      void removeSessionAudio(id);
    }
  }
}

