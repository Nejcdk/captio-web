"use client";

// A picked file made small before it's uploaded (Nejc 2026-11-11: uploads
// over 50 MB failed and retried for nothing; iPhone Safari couldn't take the
// sound out of a video, so whole videos went up). In order:
//   1. A video's sound comes straight out of an MP4/MOV as its AAC track
//      (mp4box, no decoding: works in every browser, Safari included, and
//      leaves the iPhone's spatial track behind).
//   2. Anything bigger than a direct upload is decoded to 16 kHz mono and
//      written as an MP3 (lamejs), at the highest of 48/40/32/24/16 kbps that
//      fits: an hour is 7 to 22 MB, so up to the speech service's 5 hours fits
//      under the 50 MB Storage limit.
//   3. Whatever can't be decoded (too big for this device's memory, a format
//      the browser can't read) goes as it is, and a file still over the limit
//      is stopped at once with a message, never retried.

export const DIRECT_MAX_BYTES = 4 * 1024 * 1024;
// Supabase's file size limit on the web-uploads bucket (free plan).
export const STORAGE_MAX_BYTES = 50 * 1024 * 1024;
// What an MP3 is sized to, a little under the limit.
export const STORAGE_TARGET_BYTES = 46 * 1024 * 1024;
// The speech service takes files of up to 300 minutes.
export const MAX_FILE_SECONDS = 300 * 60;

const RATE = 16000;
const KBPS = [48, 40, 32, 24, 16];
const MP4_EXTENSIONS = new Set(["mp4", "mov", "m4v", "m4a", "3gp"]);

export type Prepared = {
  blob: Blob;
  name: string;
  type: string;
  // How it was made smaller.
  how: "original" | "aac" | "mp3";
  seconds: number | null;
  kbps?: number;
  ms: number;
};

export class TooLongError extends Error {
  constructor(public seconds: number) {
    super(`file_too_long: ${Math.round(seconds / 60)} minutes`);
  }
}

const extOf = (name: string) => (name.includes(".") ? name.split(".").pop()!.toLowerCase() : "");
const baseName = (name: string) => (name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name) || "audio";

// A phone or tablet: decoding is held to what its memory takes.
function smallDevice(): boolean {
  try {
    return window.matchMedia("(pointer: coarse)").matches;
  } catch {
    return false;
  }
}

// The decoded sound (32-bit, up to two channels at 16 kHz) a device can hold.
const decodeBudget = () => (smallDevice() ? 500 : 1800) * 1024 * 1024;
// Without a known length, files up to this size are decoded.
const decodeFileMax = () => (smallDevice() ? 300 : 1024) * 1024 * 1024;

// The file's length from its metadata, without decoding it.
export function mediaSeconds(file: Blob, video: boolean): Promise<number | null> {
  return new Promise(resolve => {
    let el: HTMLMediaElement;
    try {
      el = document.createElement(video ? "video" : "audio");
    } catch {
      resolve(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const done = (v: number | null) => {
      clearTimeout(timer);
      el.removeAttribute("src");
      el.load();
      URL.revokeObjectURL(url);
      resolve(v);
    };
    const timer = setTimeout(() => done(null), 8000);
    el.preload = "metadata";
    el.muted = true;
    el.onloadedmetadata = () => done(Number.isFinite(el.duration) && el.duration > 0 ? el.duration : null);
    el.onerror = () => done(null);
    el.src = url;
  });
}

// ─── 1. The AAC track out of an MP4 / MOV ────────────────────────────────────

const AAC_RATES = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];

// Each AAC frame with its 7-byte ADTS header, so it plays (and is accepted)
// as a plain .aac file.
function adts(frames: Uint8Array[], objectType: number, rate: number, channels: number): Blob | null {
  const rateIndex = AAC_RATES.indexOf(rate);
  if (rateIndex < 0 || objectType < 1 || objectType > 4 || channels < 1 || channels > 7) return null;
  const profile = objectType - 1;
  const parts: BlobPart[] = [];
  for (const f of frames) {
    const len = f.length + 7;
    const h = new Uint8Array(7);
    h[0] = 0xff;
    h[1] = 0xf1;
    h[2] = (profile << 6) | (rateIndex << 2) | ((channels >> 2) & 1);
    h[3] = ((channels & 3) << 6) | ((len >> 11) & 3);
    h[4] = (len >> 3) & 0xff;
    h[5] = ((len & 7) << 5) | 0x1f;
    h[6] = 0xfc;
    parts.push(h, f as Uint8Array<ArrayBuffer>);
  }
  return new Blob(parts, { type: "audio/aac" });
}

export async function aacFromMp4(file: Blob): Promise<{ blob: Blob; seconds: number } | null> {
  const { createFile, MP4BoxBuffer } = await import("mp4box");
  const buffer = await file.arrayBuffer();
  return await new Promise(resolve => {
    const mp4 = createFile();
    const frames: Uint8Array[] = [];
    let expected = 0;
    let finish: (() => void) | null = null;
    mp4.onError = () => resolve(null);
    mp4.onReady = info => {
      const track = info.audioTracks.find(t => t.codec.startsWith("mp4a"));
      if (!track || !track.audio) { resolve(null); return; }
      const objectType = Number(track.codec.split(".")[2] ?? 2) || 2;
      expected = track.nb_samples;
      const seconds = track.duration / (track.timescale || 1);
      finish = () => resolve(frames.length ? (() => {
        const blob = adts(frames, objectType, track.audio!.sample_rate, track.audio!.channel_count);
        return blob ? { blob, seconds } : null;
      })() : null);
      mp4.setExtractionOptions(track.id, null, { nbSamples: 2000 });
      mp4.start();
    };
    mp4.onSamples = (_id, _user, samples) => {
      for (const s of samples) if (s.data) frames.push(s.data);
      if (frames.length >= expected && finish) finish();
    };
    try {
      mp4.appendBuffer(MP4BoxBuffer.fromArrayBuffer(buffer, 0), true);
      mp4.flush();
    } catch {
      resolve(null);
      return;
    }
    // Everything was in the one buffer: whatever came out is all there is.
    setTimeout(() => (finish ? finish() : resolve(null)), 0);
  });
}

// ─── 2. Decoded and written as a small MP3 ───────────────────────────────────

// 16 kHz mono, or null when this browser can't read it.
export async function decodeMono(file: Blob): Promise<Float32Array | null> {
  if (typeof OfflineAudioContext === "undefined") return null;
  const ctx = new OfflineAudioContext(1, RATE, RATE);
  const audio = await ctx.decodeAudioData(await file.arrayBuffer());
  if (!audio.length) return null;
  // Mixed down in the first channel's own memory: a long file is big enough.
  const out = audio.getChannelData(0);
  const others = Array.from({ length: audio.numberOfChannels - 1 }, (_, c) => audio.getChannelData(c + 1));
  if (others.length) {
    const n = others.length + 1;
    for (let i = 0; i < out.length; i++) {
      let v = out[i];
      for (const ch of others) v += ch[i];
      out[i] = v / n;
    }
  }
  return out;
}

export function kbpsFor(seconds: number, targetBytes: number): number {
  for (const k of KBPS) if (seconds * k * 125 * 1.02 <= targetBytes) return k;
  return KBPS[KBPS.length - 1];
}

const nextTick = () => new Promise<void>(r => setTimeout(r, 0));

export async function encodeMp3(pcm: Float32Array, kbps: number): Promise<Blob> {
  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const enc = new Mp3Encoder(1, RATE, kbps);
  const parts: BlobPart[] = [];
  const BLOCK = 1152 * 32;
  const block = new Int16Array(BLOCK);
  let slice = performance.now();
  for (let at = 0; at < pcm.length; at += BLOCK) {
    const n = Math.min(BLOCK, pcm.length - at);
    for (let i = 0; i < n; i++) {
      const s = Math.max(-1, Math.min(1, pcm[at + i]));
      block[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const out = enc.encodeBuffer(n === BLOCK ? block : block.subarray(0, n));
    if (out.length) parts.push(out.slice() as Uint8Array<ArrayBuffer>);
    // The page keeps responding while a long file is written.
    if (performance.now() - slice > 40) {
      await nextTick();
      slice = performance.now();
    }
  }
  const tail = enc.flush();
  if (tail.length) parts.push(tail.slice() as Uint8Array<ArrayBuffer>);
  return new Blob(parts, { type: "audio/mpeg" });
}

// A blob already known to be audio (the kept recording of a live session) as
// an MP3 that fits `targetBytes`, or null.
export async function shrinkAudio(blob: Blob, targetBytes: number): Promise<Blob | null> {
  try {
    const pcm = await decodeMono(blob);
    if (!pcm) return null;
    const mp3 = await encodeMp3(pcm, kbpsFor(pcm.length / RATE, targetBytes));
    return mp3.size < blob.size ? mp3 : null;
  } catch {
    return null;
  }
}

// ─── The whole thing ─────────────────────────────────────────────────────────

// `targetBytes`: what the upload can take (a direct upload for someone who
// isn't signed in, Storage otherwise). `onFail` hears why a step didn't work.
export async function prepareUpload(file: File, opts: {
  video: boolean; targetBytes: number; onFail?: (step: "aac" | "decode", e: unknown) => void;
}): Promise<Prepared> {
  const t0 = performance.now();
  const name = file.name || (opts.video ? "video" : "audio");
  const result = (blob: Blob, how: Prepared["how"], seconds: number | null, kbps?: number): Prepared => ({
    blob, how, seconds, kbps,
    name: how === "original" ? name : `${baseName(name)}.${how === "mp3" ? "mp3" : "aac"}`,
    type: how === "original" ? file.type || "application/octet-stream" : blob.type,
    ms: Math.round(performance.now() - t0),
  });

  // A small audio file goes as it is.
  if (!opts.video && file.size <= DIRECT_MAX_BYTES) return result(file, "original", null);

  let seconds = await mediaSeconds(file, opts.video);
  if (seconds && seconds > MAX_FILE_SECONDS) throw new TooLongError(seconds);

  let source: Blob = file;
  let how: Prepared["how"] = "original";
  if (opts.video && (MP4_EXTENSIONS.has(extOf(name)) || /mp4|quicktime|3gpp/.test(file.type))) {
    try {
      const aac = await aacFromMp4(file);
      if (aac) {
        source = aac.blob;
        how = "aac";
        seconds = seconds ?? (aac.seconds || null);
      }
    } catch (e) {
      opts.onFail?.("aac", e);
    }
  }
  if (seconds && seconds > MAX_FILE_SECONDS) throw new TooLongError(seconds);
  if (source.size <= Math.min(opts.targetBytes, DIRECT_MAX_BYTES)) return result(source, how, seconds);

  const fits = seconds ? seconds * RATE * 4 * 2 <= decodeBudget() : source.size <= decodeFileMax();
  if (fits) {
    try {
      const pcm = await decodeMono(source);
      if (pcm) {
        const secs = pcm.length / RATE;
        if (secs > MAX_FILE_SECONDS) throw new TooLongError(secs);
        const kbps = kbpsFor(secs, opts.targetBytes);
        const mp3 = await encodeMp3(pcm, kbps);
        if (mp3.size < source.size) return result(mp3, "mp3", secs, kbps);
        seconds = secs;
      }
    } catch (e) {
      if (e instanceof TooLongError) throw e;
      opts.onFail?.("decode", e);
    }
  }
  return result(source, how, seconds);
}
