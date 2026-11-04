"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import "./captions.css";
import { capture, recordError, store } from "./client";
import { listMics, type Mic } from "./audio";
import type { LiveSession, Line } from "./live";
import { LANGUAGES, updateSettings, useSettings } from "./settings";
import { SPEAKER_COLORS, languageFlag, tagInk, tint } from "./format";
import { CheckIcon, SearchIcon, TrashIcon, XIcon } from "./Icons";
import { Banner, CloseButton, DockButton, IslandButton, ModalCard, PlusCard, showCard } from "./ui";
import { openPaywall } from "./paywallStore";
import { answerMic, dismissMic, kindLabel, kindOf, micName, micToAskAbout } from "./mics";
import { contextText } from "./transcript";

// The captions sheet (app repo: HomeScreen's sheet, CaptionSettingsPanel,
// MicSuggestion): full window, the reading theme the user picked, red dot and
// timer top left, the settings button top right, the microphone in use in the
// middle when there's a choice, the words big, and at the bottom delete,
// pause/resume and save. Translation shows two panes (side by side on a wide
// window) and the language bar.

export const CAPTION_PRESETS = [
  { id: "classic", text: "#FFFFFF", bg: "#000000", dark: true },
  { id: "visibility", text: "#FFE600", bg: "#000000", dark: true },
  { id: "glare", text: "#000000", bg: "#FFFFFF", dark: false },
  { id: "cinema", text: "#FFFFFF", bg: "#141414", dark: true },
  { id: "night", text: "#00E5CC", bg: "#0A1628", dark: true },
] as const;
type PresetId = (typeof CAPTION_PRESETS)[number]["id"];
type Weight = "regular" | "bold" | "heavy";
type CaptionStyle = { size: number; preset: PresetId; weight: Weight };
const WEIGHTS: Record<Weight, number> = { regular: 400, bold: 600, heavy: 700 };
const STYLE_KEY = "captio_caption_style";
const MIN_FONT = 16;
const MAX_FONT = 48;
// The microphone question goes by itself after this (app: ASK_MS).
const ASK_MS = 20_000;

export type TranslateNames = { target: string; source: string | null };

function langByName(name: string | null) {
  return name ? LANGUAGES.find(l => l.name === name) : undefined;
}
function langByCode(code: string | null) {
  return code ? LANGUAGES.find(l => l.code === code.split("-")[0]) : undefined;
}

function useStyle(): [CaptionStyle, (s: CaptionStyle) => void] {
  const [style, setStyle] = useState<CaptionStyle>(() => ({
    size: window.innerWidth >= 900 ? 28 : 20, preset: "glare", weight: "regular",
    ...store.get<Partial<CaptionStyle>>(STYLE_KEY, {}),
  }));
  return [style, s => { setStyle(s); store.set(STYLE_KEY, s); }];
}

type Ask = { mic: Mic; when: "start" | "connected"; at: number };

export function CaptionsSheet({ session, translate, onTranslate, onSave, onDelete, isPlus }: {
  session: LiveSession;
  translate: TranslateNames;
  onTranslate: (t: TranslateNames) => void;
  onSave: () => void;
  onDelete: () => void;
  isPlus: boolean;
}) {
  const snap = useSyncExternalStore(session.subscribe, () => session.snap, () => session.snap);
  const [style, setStyle] = useStyle();
  const preset = CAPTION_PRESETS.find(p => p.id === style.preset) ?? CAPTION_PRESETS[2];
  const mics = useMics();
  const [ask, setAsk] = useState<Ask | null>(null);
  const paused = snap.phase === "paused";
  const saving = snap.phase === "saving";
  const mode = snap.mode;

  // Which microphone should captions use? Asked about a microphone nobody
  // answered for: at the start (once the browser names them) and when one
  // connects mid-session (app: MicSuggestion).
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!mics.length || !mics.some(m => m.label)) return;
    const first = !seen.current;
    const known = seen.current ?? new Set<string>();
    const added = first ? mics : mics.filter(m => !known.has(m.id));
    seen.current = new Set(mics.map(m => m.id));
    const next = micToAskAbout(added);
    if (!next || ask) return;
    const when = first ? "start" : "connected";
    capture("mic_suggestion_shown", { kind: kindOf(next), when, in_use: next.id === session.snap.micId, mode });
    setAsk({ mic: next, when, at: Date.now() });
  }, [mics, ask, mode, session]);

  // Let go by: 'later' (asked again next session, never after the second time).
  useEffect(() => {
    if (!ask) return;
    const t = setTimeout(() => {
      capture("mic_suggestion_answered", { answer: "timeout", kind: kindOf(ask.mic), mode });
      dismissMic(ask.mic);
      setAsk(null);
    }, ASK_MS);
    return () => clearTimeout(t);
  }, [ask, mode]);

  // Out of credits, the paywall over the sheet; bought = captions come back.
  useEffect(() => { if (isPlus) session.plusChanged(); }, [isPlus, session]);

  // Leaving the page mid-session: the browser asks first (the draft is kept anyway).
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  const pickMic = async (mic: Mic, from: "suggestion" | "picker") => {
    let ok = true;
    try {
      await session.switchMic(mic.id);
    } catch (e) {
      ok = false;
      recordError("mic_select", e, { kind: kindOf(mic), from });
    }
    capture("mic_selected", { kind: kindOf(mic), from, ok, mode });
  };

  const answerAsk = (mic: Mic) => {
    if (!ask) return;
    capture("mic_suggestion_answered", {
      answer: mic.builtIn ? "phone" : "external", kind: kindOf(ask.mic), mode, seconds: Math.round((Date.now() - ask.at) / 1000),
    });
    // The microphone asked about: use it, or keep the built-in one.
    answerMic(ask.mic, mic.id === ask.mic.id);
    setAsk(null);
    if (mic.id !== session.snap.micId) void pickMic(mic, "suggestion");
  };

  const closeAsk = () => {
    if (!ask) return;
    capture("mic_suggestion_answered", { answer: "closed", kind: kindOf(ask.mic), mode });
    dismissMic(ask.mic);
    setAsk(null);
  };

  const openMicPicker = () => {
    capture("mic_picker_opened", { mics: mics.length });
    showCard(close => (
      <ModalCard title="Which microphone should captions use?" onClose={close}>
        <MicOptions mics={mics} currentId={snap.micId} onPick={m => { close(); void pickMic(m, "picker"); }} />
      </ModalCard>
    ));
  };

  const openSettings = () => showCard(close => (
    <CaptionSettingsCard style={style} onStyle={setStyle} session={session} onClose={close} />
  ));

  const pickLanguage = (which: "source" | "target") => {
    showCard(close => (
      <LanguageCard
        title={which === "source" ? "Spoken language" : "Translate into"}
        allowAuto={which === "source"}
        current={which === "source" ? translate.source : translate.target}
        onPick={name => {
          close();
          const next = which === "source" ? { ...translate, source: name } : { ...translate, target: name ?? translate.target };
          capture("translate_language_changed", { target: next.target, source: next.source ?? "auto" });
          onTranslate(next);
        }}
        onClose={close}
      />
    ));
  };

  const fontFamily = { fontSize: style.size, fontWeight: WEIGHTS[style.weight], lineHeight: 1.38 };
  const muted = preset.dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const target = langByName(translate.target);
  const source = langByName(translate.source) ?? (translate.source ? undefined : langByCode(snap.detected));
  const twoWay = !!translate.source;
  const isTranslation = snap.mode === "translation";
  const recording = snap.phase !== "starting" || snap.seconds > 0;
  const mm = String(Math.floor(snap.seconds / 60)).padStart(2, "0");
  const ss = String(snap.seconds % 60).padStart(2, "0");
  const hh = snap.seconds >= 3600 ? `${Math.floor(snap.seconds / 3600)}:` : "";

  return (
    <div
      className="cs"
      style={{ background: preset.bg, color: preset.text, ["--cs-grey" as string]: preset.dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.3)", ["--cs-pill" as string]: preset.dark ? "rgba(255,255,255,0.1)" : "#F2F2F7" }}
      data-dark={preset.dark}
    >
      <header className="cs-head">
        <div className="cs-title">
          {recording && <span className={`cs-dot${snap.phase === "lost" ? " lost" : ""}${paused ? " paused" : ""}`} aria-hidden />}
          <span className={recording ? "cs-timer" : "cs-label"}>
            {recording ? `${hh}${hh ? mm.padStart(2, "0") : mm}:${ss}` : isTranslation ? "TRANSLATION" : "LIVE CAPTIONS"}
          </span>
        </div>
        {mics.length > 1 && (
          <button type="button" className="cs-mic-chip" onClick={openMicPicker} aria-label={`Microphone: ${snap.micLabel || "Default"}. Change microphone`}>
            {shortMic(snap.micLabel)}
          </button>
        )}
        <button type="button" className="cs-icon" onClick={openSettings} aria-label="Caption settings" title="Caption settings">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 6h8" /><path d="M16 6h4" /><path d="M14 4v4" /><path d="M4 12h2" /><path d="M10 12h10" /><path d="M8 10v4" /><path d="M4 18h12" /><path d="M20 18h0" /><path d="M18 16v4" />
          </svg>
        </button>
      </header>

      <div className="cs-notices">
        {snap.lastMinute && <Banner tone="warn" text="1 minute of free captions left today" />}
        {snap.phase === "lost" && !snap.reconnectFailed && (
          <Banner tone="error" text="Captions paused while we reconnect. Recording continues, and you'll get the full transcript when you save." />
        )}
        {snap.reconnectFailed && snap.phase === "lost" && (
          <Banner tone="error" text="Live captions can't reconnect. Your recording is safe and keeps going. Save it when you're done." />
        )}
        {snap.silent && !paused && <Banner tone="warn" text="We can't hear you yet. Check that your microphone is on and not muted." />}
      </div>

      {isTranslation ? (
        <div className="cs-panes">
          <Pane
            label={twoWay ? (source?.name ?? "").toUpperCase() : "CAPTIONS"}
            lines={snap.top}
            placeholder={twoWay ? `${source?.name} will appear here...` : "Speech will appear here..."}
            dark={preset.dark} text={preset.text} font={fontFamily} muted={muted}
          />
          <div className="cs-divider" style={{ background: preset.dark ? "rgba(255,255,255,0.12)" : "#E5E5EA" }} />
          <Pane
            label={twoWay ? (target?.name ?? "").toUpperCase() : `${(target?.name ?? "").toUpperCase()} TRANSLATION`}
            lines={snap.bottom}
            placeholder={twoWay ? `${target?.name} will appear here...` : `${target?.name} translation will appear here...`}
            dark={preset.dark} text={preset.text} font={fontFamily} muted={muted}
          />
        </div>
      ) : (
        <div className="cs-panes single">
          <Pane lines={snap.lines} placeholder="Live captions will appear here..." dark={preset.dark} text={preset.text} font={fontFamily} muted={muted} />
        </div>
      )}

      <div className="cs-bottom">
        {snap.creditsOut === "out" && (
          <PlusCard
            title="Captions paused, still recording"
            body="You've used today's free credits. Get Plus to see the rest of this conversation."
            cta="Get Plus"
            onPress={() => { capture("captions_paused_upgrade_tapped"); capture("plus_button_tapped", { where: "captions_paused", style: "gold" }); openPaywall("captions_cut"); }}
            style={{ marginBottom: 12 }}
          />
        )}
        {snap.creditsOut === "unlocked" && (
          <PlusCard title="Plus is on" body="Captions are back." style={{ marginBottom: 12 }} />
        )}
        {ask && !snap.creditsOut && (
          <div className="ui-plus-card cs-mic-card">
            <div className="cs-mic-card-head">
              <div>
                <div className="title">{micName(ask.mic.label)} is connected</div>
                <div className="cs-meta">Which microphone should captions use?</div>
              </div>
              <CloseButton onPress={closeAsk} />
            </div>
            <MicOptions
              mics={[ask.mic, ...mics.filter(m => m.id !== ask.mic.id && !m.builtIn), ...mics.filter(m => m.id !== ask.mic.id && m.builtIn)]}
              currentId={snap.micId}
              onPick={answerAsk}
            />
          </div>
        )}
        {isTranslation && (
          <div className="cs-langbar">
            <button type="button" className="cs-lang" onClick={() => pickLanguage("source")}>
              {source && <span>{source.flag}</span>}
              <span style={{ color: translate.source ? preset.text : muted }}>{source?.name ?? "Auto-detect"}</span>
            </button>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 4l-3 3l3 3" /><path d="M4 7h16" /><path d="M17 14l3 3l-3 3" /><path d="M20 17h-16" />
            </svg>
            <button type="button" className="cs-lang" onClick={() => pickLanguage("target")}>
              <span>{target?.flag}</span>
              <span style={{ color: preset.text }}>{target?.name}</span>
            </button>
          </div>
        )}
        <div className="cs-controls">
          <DockButton size="control" label="Delete" onPress={onDelete} disabled={saving}>
            <TrashIcon size={28} color="var(--brand)" />
          </DockButton>
          <IslandButton
            size="stop"
            color="#E03426"
            label={paused ? "Resume" : "Pause"}
            disabled={saving}
            onPress={() => (paused ? session.resume() : session.pause())}
          >
            {paused ? (
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden><path fill="#fff" d="M7 4.5v15l12.5-7.5z" /></svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1.2" fill="#fff" /><rect x="14" y="5" width="4" height="14" rx="1.2" fill="#fff" /></svg>
            )}
          </IslandButton>
          <DockButton size="control" label="Save" onPress={onSave} disabled={saving}>
            {saving ? <span className="cs-spinner" aria-hidden /> : <CheckIcon size={30} color="#28A745" />}
          </DockButton>
        </div>
      </div>
    </div>
  );
}

function shortMic(label: string): string {
  const name = micName(label);
  return name.length > 22 ? `${name.slice(0, 21)}…` : name;
}

function useMics(): Mic[] {
  const [mics, setMics] = useState<Mic[]>([]);
  useEffect(() => {
    let live = true;
    const load = () => listMics().then(m => { if (live) setMics(m); });
    load();
    navigator.mediaDevices?.addEventListener("devicechange", load);
    return () => { live = false; navigator.mediaDevices?.removeEventListener("devicechange", load); };
  }, []);
  return mics;
}

// Every connected microphone as a full-width option, the one in use outlined
// in blue with a small "In use" tag (app: MicSuggestion).
function MicOptions({ mics, currentId, onPick }: { mics: Mic[]; currentId: string; onPick: (m: Mic) => void }) {
  return (
    <div className="cs-mic-options">
      {mics.map(m => {
        const inUse = m.id === currentId;
        return (
          <button key={m.id} type="button" className={`cs-mic-option${inUse ? " in-use" : ""}`} onClick={() => onPick(m)}>
            {inUse && <span className="cs-in-use">In use</span>}
            <span className="name">{shortMic(m.label)}</span>
            <span className="kind">{kindLabel(kindOf(m))}</span>
          </button>
        );
      })}
    </div>
  );
}

function Pane({ label, lines, placeholder, dark, text, font, muted }: {
  label?: string; lines: Line[]; placeholder: string; dark: boolean; text: string;
  font: { fontSize: number; fontWeight: number; lineHeight: number }; muted: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  // Follows the newest words unless the reader scrolled up.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [lines]);
  return (
    <div className="cs-pane">
      {label && <div className="cs-pane-label" style={{ color: muted }}>{label}</div>}
      <div
        className="cs-scroll"
        ref={ref}
        onScroll={e => { const el = e.currentTarget; stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120; }}
      >
        <div className="cs-text" style={font}>
          {!lines.length && <p style={{ color: muted }}>{placeholder}</p>}
          {lines.map((l, i) => {
            const prev = lines[i - 1];
            const sameTurn = prev && prev.speaker === l.speaker && (prev.language ?? "") === (l.language ?? "");
            const n = parseInt(l.speaker, 10);
            const color = n > 0 ? SPEAKER_COLORS[(n - 1) % SPEAKER_COLORS.length] : null;
            const flag = languageFlag(l.language);
            // Grey words of the same speaker run on in the same paragraph.
            if (l.grey && sameTurn && prev && !prev.grey) return null;
            const greyRunOn = !l.grey && lines[i + 1]?.grey && lines[i + 1].speaker === l.speaker && (lines[i + 1].language ?? "") === (l.language ?? "") ? lines[i + 1].text : "";
            const showTags = !sameTurn && (!!color || !!flag);
            return (
              <div key={i} className="cs-para">
                {showTags && (
                  <div className="cs-tags">
                    {color && (
                      <span className="cs-tag" style={{ background: tint(color, 0.13), color: dark ? color : tagInk(color) }}>Speaker {l.speaker}</span>
                    )}
                    {flag && <span className="cs-flag" style={{ background: dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.05)" }}>{flag}</span>}
                  </div>
                )}
                <p style={{ color: l.grey ? "var(--cs-grey)" : text }}>
                  {l.grey ? l.text.trimStart() : l.text}
                  {greyRunOn && <span style={{ color: "var(--cs-grey)" }}>{greyRunOn}</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// The sheet's settings (app: CaptionSettingsPanel): the text first (SIZE,
// COLOR, WEIGHT), then Separate Speakers, language hints and words & names.
// The speech service reads the last three when a stream starts, so the stream
// starts again on close when they changed.
function CaptionSettingsCard({ style, onStyle, session, onClose }: {
  style: CaptionStyle; onStyle: (s: CaptionStyle) => void; session: LiveSession; onClose: () => void;
}) {
  const [s, setS] = useState(style);
  const settings = useSettings();
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState("");
  const [word, setWord] = useState("");
  const before = useRef(JSON.stringify([settings.separateSpeakers, settings.settingsLangHints, settings.contextWords]));
  const mode = session.mode;
  const set = (patch: Partial<CaptionStyle>) => {
    const next = { ...s, ...patch };
    setS(next);
    onStyle(next);
    const [setting, value] = Object.entries(patch)[0] ?? [];
    if (setting) capture("caption_appearance_changed", { mode, setting: setting === "preset" ? "color" : setting, value: String(value) });
  };
  const close = () => {
    const now = JSON.stringify([settings.separateSpeakers, settings.settingsLangHints, settings.contextWords]);
    if (now !== before.current) {
      session.restart({
        diarize: settings.separateSpeakers,
        languageHints: settings.settingsLangHints.map(n => LANGUAGES.find(l => l.name === n)?.code).filter((c): c is string => !!c),
        context: contextText(settings.contextWords, settings.contextWindowText),
      });
    }
    onClose();
  };
  const addWords = () => {
    const words = word.split(/[,\n]/).map(w => w.trim()).filter(Boolean);
    if (!words.length) return;
    const seenWords = new Set(settings.contextWords.map(w => w.toLowerCase()));
    const fresh = words.filter(w => !seenWords.has(w.toLowerCase()) && (seenWords.add(w.toLowerCase()), true));
    updateSettings({ contextWords: [...settings.contextWords, ...fresh] });
    capture("settings_vocabulary_added", { count: fresh.length, from: "captions" });
    setWord("");
  };

  if (picking) {
    const list = LANGUAGES.filter(l => !settings.settingsLangHints.includes(l.name) && (!q.trim() || l.name.toLowerCase().includes(q.trim().toLowerCase())));
    return (
      <ModalCard title="Add a language" onClose={() => { setPicking(false); setQ(""); }} wide>
        <label className="search" style={{ margin: "12px 0" }}>
          <SearchIcon size={20} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search language" aria-label="Search language" />
        </label>
        <div className="cs-lang-list">
          {list.map(l => (
            <button key={l.name} type="button" className="cs-lang-row" onClick={() => {
              updateSettings({ settingsLangHints: [...settings.settingsLangHints, l.name] });
              capture("settings_language_added", { language: l.name, from: "captions" });
              setPicking(false);
              setQ("");
            }}>
              <span>{l.flag}</span><span>{l.name}</span>
            </button>
          ))}
        </div>
        <button type="button" className="ui-quiet" onClick={() => { setPicking(false); setQ(""); }}>Back</button>
      </ModalCard>
    );
  }

  return (
    <ModalCard title="Caption settings" onClose={close} wide>
      <div className="cs-style">
        <div className="field-label">SIZE</div>
        <div className="cs-size">
          <span style={{ fontSize: 14 }}>A</span>
          <input type="range" min={MIN_FONT} max={MAX_FONT} step={1} value={s.size} onChange={e => set({ size: Number(e.target.value) })} aria-label="Size" />
          <span style={{ fontSize: 24 }}>A</span>
        </div>
        <div className="field-label">COLOR</div>
        <div className="cs-presets">
          {CAPTION_PRESETS.map(p => (
            <button key={p.id} type="button" aria-label={p.id} aria-pressed={s.preset === p.id} className="cs-preset" style={{ background: p.bg, color: p.text }} onClick={() => set({ preset: p.id })}>
              Aa
            </button>
          ))}
        </div>
        <div className="field-label">WEIGHT</div>
        <div className="app-tabs" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {(["regular", "bold", "heavy"] as Weight[]).map(w => (
            <button key={w} type="button" aria-pressed={s.weight === w} onClick={() => set({ weight: w })} style={{ fontWeight: WEIGHTS[w] }}>
              {w === "regular" ? "Regular" : w === "bold" ? "Bold" : "Heavy"}
            </button>
          ))}
        </div>

        <div className="group cs-settings-group">
          <div className="group-row">
            <span className="label">Separate Speakers</span>
            <button
              type="button" role="switch" aria-checked={settings.separateSpeakers} aria-label="Separate Speakers" className="switch"
              onClick={() => { capture("settings_speakers_toggled", { on: !settings.separateSpeakers, from: "captions" }); updateSettings({ separateSpeakers: !settings.separateSpeakers }); }}
            >
              <span />
            </button>
          </div>
        </div>

        <div className="field-label">LANGUAGES</div>
        <div className="word-chips" style={{ marginTop: 0 }}>
          {settings.settingsLangHints.map(name => (
            <button key={name} type="button" className="word-chip" aria-label={`${name}, Delete`} onClick={() => {
              updateSettings({ settingsLangHints: settings.settingsLangHints.filter(l => l !== name) });
              capture("settings_language_removed", { language: name, from: "captions" });
            }}>
              {LANGUAGES.find(l => l.name === name)?.flag} {name}<XIcon size={12} color="var(--ink-meta)" />
            </button>
          ))}
          <button type="button" className="word-chip cs-add-chip" onClick={() => setPicking(true)}>+ Add a language</button>
        </div>

        <div className="field-label">WORDS &amp; NAMES</div>
        <div className="add-row">
          <input
            className="input"
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addWords(); }}
            placeholder="e.g. Alex, London, WhatsApp..."
            aria-label="Words and names"
          />
          <button type="button" className="add-btn" onClick={addWords} disabled={!word.trim()}>Add</button>
        </div>
        {settings.contextWords.length > 0 && (
          <div className="word-chips">
            {settings.contextWords.map(w => (
              <button key={w} type="button" className="word-chip" aria-label={`${w}, Delete`} onClick={() => {
                updateSettings({ contextWords: settings.contextWords.filter(x => x !== w) });
                capture("settings_vocabulary_removed", { from: "captions" });
              }}>
                {w}<XIcon size={12} color="var(--ink-meta)" />
              </button>
            ))}
          </div>
        )}
      </div>
      <button type="button" className="ui-quiet" onClick={close}>Done</button>
    </ModalCard>
  );
}

function LanguageCard({ title, allowAuto, current, onPick, onClose }: {
  title: string; allowAuto: boolean; current: string | null; onPick: (name: string | null) => void; onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const list = LANGUAGES.filter(l => !q.trim() || l.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <ModalCard title={title} onClose={onClose} wide>
      <label className="search" style={{ margin: "12px 0" }}>
        <SearchIcon size={20} />
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search language" aria-label="Search language" />
      </label>
      <div className="cs-lang-list">
        {allowAuto && !q && (
          <button type="button" className="cs-lang-row" aria-current={current === null} onClick={() => onPick(null)}>
            <span>🌐</span><span>Auto-detect</span>
          </button>
        )}
        {list.map(l => (
          <button key={l.name} type="button" className="cs-lang-row" aria-current={current === l.name} onClick={() => onPick(l.name)}>
            <span>{l.flag}</span><span>{l.name}</span>
          </button>
        ))}
      </div>
    </ModalCard>
  );
}
