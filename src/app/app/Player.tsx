"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { capture, getSupabase, recordErrorOnce } from "./client";
import type { RecordingBody } from "./data";
import { languageFlag, tagInk, tint, type SpeakerTag } from "./format";
import { IslandButton } from "./ui";

// The Welcome demo on a recording's page (app repo: DetailScreen's player
// card and its simulated live captioning): the words appear at the moment
// they're spoken, the last ~1.1 s grey before they turn black, like real
// captions; the floating player card plays the hosts' audio (bundled English,
// other languages from the same public bucket as the app). Where it left off
// survives going away and back; `demo_watch_time` on leaving.

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const FINAL_LAG = 1100;
const ENGLISH_TITLE = "Welcome to Captio AI 👋";
let resumeAt = 0;

function audioUrl(title: string): string {
  const lang = navigator.language.toLowerCase().split("-")[0];
  if (lang === "en" || lang === "or" || title === ENGLISH_TITLE) return "/web-app/welcome/en.m4a";
  try {
    return getSupabase().storage.from("welcome").getPublicUrl(`v5/${lang}.m4a`).data.publicUrl;
  } catch {
    return "/web-app/welcome/en.m4a";
  }
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function useDemoPlayer(title: string, durationSeconds: number) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [position, setPosition] = useState(resumeAt);
  const [duration, setDuration] = useState(durationSeconds * 1000);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speed, setSpeed] = useState(1);
  const watchMs = useRef(0);
  const playStart = useRef<number | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const a = new Audio(audioUrl(title));
    a.preload = "auto";
    audio.current = a;
    a.currentTime = resumeAt / 1000;
    a.onloadedmetadata = () => { if (Number.isFinite(a.duration)) setDuration(a.duration * 1000); };
    a.onplay = () => { setPlaying(true); playStart.current = Date.now(); };
    a.onpause = () => {
      setPlaying(false);
      if (playStart.current != null) { watchMs.current += Date.now() - playStart.current; playStart.current = null; }
    };
    a.onended = () => { setFinished(true); finishedRef.current = true; };
    // Safari's media errors have an empty message: the code says which one.
    a.onerror = () => recordErrorOnce("welcome_playback", a.error?.message || `code ${a.error?.code}`, { code: a.error?.code });
    let raf = 0;
    const tick = () => { setPosition(a.currentTime * 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      resumeAt = finishedRef.current ? 0 : a.currentTime * 1000;
      if (playStart.current != null) watchMs.current += Date.now() - playStart.current;
      // Emptying the source fires the error handler ("Empty src attribute"):
      // leaving the page isn't a playback error.
      a.onerror = null;
      a.onplay = a.onpause = a.onended = a.onloadedmetadata = null;
      a.pause();
      a.removeAttribute("src");
      a.load();
      capture("demo_watch_time", { seconds: Math.round(watchMs.current / 1000), completed: finishedRef.current });
    };
  }, [title]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (finishedRef.current && a.ended) { a.currentTime = 0; setFinished(false); finishedRef.current = false; }
      a.play().catch(e => {
        // Interrupted by a pause or by leaving the page: not a failure.
        if ((e as DOMException)?.name !== "AbortError") recordErrorOnce("welcome_playback", e, { name: (e as DOMException)?.name });
      });
    } else a.pause();
  };
  const seek = (ms: number) => {
    const a = audio.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(duration, ms)) / 1000;
    setFinished(false);
    finishedRef.current = false;
  };
  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audio.current) audio.current.playbackRate = next;
  };
  return { position, duration, playing, finished, speed, toggle, seek, cycleSpeed, src: () => audio.current?.src ?? "" };
}

export type DemoPlayer = ReturnType<typeof useDemoPlayer>;

// The words as they're spoken; everything once it has been heard to the end.
export function DemoCaptions({ body, tags, player }: { body: RecordingBody; tags: SpeakerTag[]; player: DemoPlayer }) {
  const reveal = player.finished ? Number.MAX_SAFE_INTEGER : player.position;
  const lastRef = useRef<HTMLDivElement>(null);
  const blocks = body.segments.map((seg, i) => {
    const words = seg.words ?? [];
    const shown = words.filter(w => w.s <= reveal);
    if (!shown.length) return null;
    const finalCount = shown.filter(w => w.e + FINAL_LAG <= reveal).length;
    const black = shown.slice(0, finalCount).map(w => w.t).join("").trimStart();
    const grey = shown.slice(finalCount).map(w => w.t).join("");
    const tag = tags[i];
    const color = tag.color ?? "#6F7280";
    const flag = languageFlag(seg.language);
    const showTags = !!tag.label && tag.key !== tags[i - 1]?.key;
    return (
      <Fragment key={i}>
        {showTags && (
          <div className="seg-tags">
            <span className="tag" style={{ color: tagInk(color), background: tint(color, 0.13) }}>{tag.label}</span>
            {flag && <span className="flag" aria-hidden>{flag}</span>}
          </div>
        )}
        <p className="seg-text" dir="auto">
          {black}
          {grey && <span style={{ color: "rgba(0,0,0,0.3)" }}>{black ? grey : grey.trimStart()}</span>}
        </p>
      </Fragment>
    );
  }).filter(Boolean);
  const count = blocks.length;
  // Follows the newest words while it plays.
  useEffect(() => {
    if (player.playing) lastRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [count, player.playing]);
  if (!count) return <p className="seg-text" style={{ color: "rgba(0,0,0,0.3)" }}>Live captions will appear here...</p>;
  return <div>{blocks}<div ref={lastRef} /></div>;
}

// The floating player card: time, the track, speed, 5 s back, play, 5 s on,
// save the audio.
export function PlayerCard({ player }: { player: DemoPlayer }) {
  const { position, duration, playing, speed } = player;
  const pct = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;
  return (
    <div className="rv-player">
      <div className="rv-track-row">
        <span className="rv-time">{fmt(position)}</span>
        <input
          type="range"
          className="rv-track"
          min={0}
          max={Math.max(1, Math.round(duration))}
          value={Math.round(position)}
          onChange={e => player.seek(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, var(--brand) ${pct}%, #E5E5EA ${pct}%)` }}
          aria-label="Position"
        />
        <span className="rv-time">{fmt(duration)}</span>
      </div>
      <div className="rv-controls">
        <button type="button" className="rv-speed" onClick={player.cycleSpeed} aria-label="Playback speed">{speed}×</button>
        <button type="button" className="rv-skip" onClick={() => player.seek(position - 5000)} aria-label="Back 5 seconds">
          <SkipIcon back />
        </button>
        <IslandButton size="play" label={playing ? "Pause" : "Play"} onPress={player.toggle}>
          {playing ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1.2" fill="#fff" /><rect x="14" y="5" width="4" height="14" rx="1.2" fill="#fff" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path fill="#fff" d="M7 4.5v15l12.5-7.5z" /></svg>
          )}
        </IslandButton>
        <button type="button" className="rv-skip" onClick={() => player.seek(position + 5000)} aria-label="Forward 5 seconds">
          <SkipIcon />
        </button>
        <a className="rv-speed" href={player.src()} download="Welcome to Captio AI.m4a" aria-label="Save the audio" onClick={() => capture("audio_shared", { from: "welcome" })}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2v-4" /><path d="m17 8 -5 -5 -5 5" /><path d="m12 3 0 12" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function SkipIcon({ back }: { back?: boolean }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
      <path fill="#1C1C1E" d={back ? "M12 5V2L8 6l4 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" : "M12 5V2l4 4-4 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"} />
      <text x="12" y="16.2" textAnchor="middle" fontSize="6.4" fontWeight="700" fill="#1C1C1E" fontFamily="system-ui">5</text>
    </svg>
  );
}
