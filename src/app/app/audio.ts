import { recordErrorOnce } from "./client";

// The microphone, as the speech service wants it: 16 kHz, mono, 16-bit PCM,
// in 100 ms chunks (the app's recorder gives the same). Browsers record at
// 44.1 or 48 kHz, so an AudioWorklet averages down to 16 kHz.

export const SAMPLE_RATE = 16000;
const CHUNK_SAMPLES = 1600; // 100 ms

const WORKLET = `
class CaptioPcm extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = sampleRate / ${SAMPLE_RATE};
    this.pos = 0;
    this.acc = 0;
    this.accN = 0;
    this.out = new Int16Array(${CHUNK_SAMPLES});
    this.n = 0;
    this.peak = 0;
  }
  process(inputs) {
    const ch = inputs[0];
    if (!ch || !ch.length) return true;
    const a = ch[0], b = ch[1];
    for (let i = 0; i < a.length; i++) {
      // Mono: a receiver with one mic per side must not lose the second person.
      const v = b ? (a[i] + b[i]) / 2 : a[i];
      this.acc += v; this.accN++;
      this.pos += 1;
      if (this.pos >= this.ratio) {
        this.pos -= this.ratio;
        const s = Math.max(-1, Math.min(1, this.acc / this.accN));
        this.acc = 0; this.accN = 0;
        const abs = Math.abs(s);
        if (abs > this.peak) this.peak = abs;
        this.out[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
        if (this.n === ${CHUNK_SAMPLES}) {
          this.port.postMessage({ pcm: this.out.buffer, peak: this.peak }, [this.out.buffer]);
          this.out = new Int16Array(${CHUNK_SAMPLES});
          this.n = 0;
          this.peak = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('captio-pcm', CaptioPcm);
`;

export type Capture = {
  stop: () => void;
  deviceId: string;
  label: string;
};

export class MicError extends Error {
  constructor(public kind: "denied" | "unavailable" | "unsupported", message: string) {
    super(message);
  }
}

// Opens the microphone (`deviceId` "" = the computer's default) and calls
// onChunk with each 100 ms of PCM. The browser asks for permission the first
// time.
export async function startCapture(deviceId: string, onChunk: (pcm: ArrayBuffer, peak: number) => void): Promise<Capture> {
  if (process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("fakemic")) return fakeCapture(onChunk);
  if (!navigator.mediaDevices?.getUserMedia || typeof AudioWorkletNode === "undefined") {
    throw new MicError("unsupported", "This browser can't record audio");
  }
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
        channelCount: { ideal: 1 },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (e) {
    const name = (e as DOMException)?.name;
    if (name === "NotAllowedError" || name === "SecurityError") throw new MicError("denied", String((e as Error).message));
    // The picked microphone is gone: the default one.
    if (deviceId && (name === "OverconstrainedError" || name === "NotFoundError")) return startCapture("", onChunk);
    throw new MicError("unavailable", `${name}: ${(e as Error)?.message ?? e}`);
  }
  const ctx = new AudioContext();
  const url = URL.createObjectURL(new Blob([WORKLET], { type: "application/javascript" }));
  try {
    await ctx.audioWorklet.addModule(url);
  } finally {
    URL.revokeObjectURL(url);
  }
  const source = ctx.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(ctx, "captio-pcm");
  node.port.onmessage = ({ data }) => onChunk(data.pcm as ArrayBuffer, data.peak as number);
  source.connect(node);
  // Not to the speakers: a muted gain keeps the graph pulling audio.
  const mute = ctx.createGain();
  mute.gain.value = 0;
  node.connect(mute).connect(ctx.destination);
  if (ctx.state === "suspended") await ctx.resume().catch(() => {});
  const track = stream.getAudioTracks()[0];
  const settings = track?.getSettings?.() ?? {};
  return {
    deviceId: (settings.deviceId as string) ?? deviceId,
    label: track?.label ?? "",
    stop: () => {
      node.port.onmessage = null;
      stream.getTracks().forEach(t => t.stop());
      ctx.close().catch(() => {});
    },
  };
}

export type Mic = { id: string; label: string; builtIn: boolean };

// The computer's microphones (names only once the browser was allowed one).
// The computer's own microphone, by its name (browsers say nothing else).
export function labelIsBuiltIn(label: string): boolean {
  return /built-?in|internal|macbook|integrated/i.test(label);
}

export async function listMics(): Promise<Mic[]> {
  try {
    const all = await navigator.mediaDevices.enumerateDevices();
    return all
      .filter(d => d.kind === "audioinput" && d.deviceId && d.deviceId !== "default" && d.deviceId !== "communications")
      .map(d => ({ id: d.deviceId, label: d.label, builtIn: labelIsBuiltIn(d.label) }));
  } catch (e) {
    recordErrorOnce("mic_list", e);
    return [];
  }
}

// Dev only (/app?preview=1&fakemic=1): the welcome recording plays into the
// same pipeline instead of a microphone, so the captions sheet can be checked
// where there's no microphone (the browser pane).
async function fakeCapture(onChunk: (pcm: ArrayBuffer, peak: number) => void): Promise<Capture> {
  const ctx = new AudioContext();
  const url = URL.createObjectURL(new Blob([WORKLET], { type: "application/javascript" }));
  await ctx.audioWorklet.addModule(url);
  URL.revokeObjectURL(url);
  const buffer = await ctx.decodeAudioData(await (await fetch("/web-app/welcome/en.m4a")).arrayBuffer());
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const node = new AudioWorkletNode(ctx, "captio-pcm");
  node.port.onmessage = ({ data }) => onChunk(data.pcm as ArrayBuffer, data.peak as number);
  const mute = ctx.createGain();
  mute.gain.value = 0;
  src.connect(node).connect(mute).connect(ctx.destination);
  src.start();
  if (ctx.state === "suspended") await ctx.resume().catch(() => {});
  return { deviceId: "", label: "Welcome recording (dev)", stop: () => { src.stop(); ctx.close().catch(() => {}); } };
}
