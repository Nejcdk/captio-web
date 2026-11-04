"use client";

import { useEffect, useState } from "react";
import "./mic.css";
import { capture, recordErrorOnce } from "./client";
import { listMics, type Mic } from "./audio";
import { answerMic, forgetMic, kindOf, micEmoji, micName, rememberedMics, setSuggestionsOn, suggestionsOn, type RememberedMic } from "./mics";
import { updateSettings, useSettings } from "./settings";
import { CheckIcon, ChevronLeftIcon } from "./Icons";

// Settings → Captions → Pick a microphone (app repo: MicrophoneScreen): a
// Suggest microphones switch, the microphones connected now (a tap = captions
// use it), and the ones answered for, with Forget (asked again next time).
// A browser names its microphones only once it was allowed one: Allow
// microphone asks once.
export function MicrophonePage({ onBack }: { onBack: () => void }) {
  const { microphoneId } = useSettings();
  const [mics, setMics] = useState<Mic[] | null>(null);
  const [suggest, setSuggest] = useState(suggestionsOn);
  const [remembered, setRemembered] = useState<RememberedMic[]>(rememberedMics);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let live = true;
    const load = () => listMics().then(m => { if (live) setMics(m); });
    void load().then(() => capture("mic_settings_opened"));
    navigator.mediaDevices?.addEventListener("devicechange", load);
    return () => { live = false; navigator.mediaDevices?.removeEventListener("devicechange", load); };
  }, []);

  const named = !!mics?.some(m => m.label);
  const builtIn = mics?.find(m => m.builtIn);
  const inUse = mics?.some(m => m.id === microphoneId) ? microphoneId : (builtIn?.id ?? "");

  const allow = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setBlocked(false);
      setMics(await listMics());
    } catch (e) {
      setBlocked(true);
      capture("action_blocked", { action: "mic_settings", reason: "mic_denied" });
      recordErrorOnce("mic_settings_permission", e);
    }
  };

  const pick = (m: Mic) => {
    updateSettings({ microphoneId: m.builtIn ? "" : m.id });
    if (m.builtIn) for (const other of mics ?? []) { if (!other.builtIn && other.label) answerMic(other, false); }
    else answerMic(m, true);
    setRemembered(rememberedMics());
    capture("mic_selected", { kind: kindOf(m), from: "settings", ok: true });
  };

  const forget = (m: RememberedMic) => {
    forgetMic(m.id);
    if (microphoneId === m.id) updateSettings({ microphoneId: "" });
    setRemembered(rememberedMics());
    capture("mic_forgotten", { kind: m.kind, answer: m.answer });
  };

  const toggle = () => {
    const on = !suggest;
    setSuggestionsOn(on);
    setSuggest(on);
    capture("mic_suggest_toggled", { on });
  };

  return (
    <main className="settings">
      <div className="inner page">
        <button type="button" className="back-link" onClick={onBack}><ChevronLeftIcon size={16} />Settings</button>
        <h1 className="page-title">Pick a microphone</h1>
        <p className="page-lede">Which microphone captions listen to.</p>
        <div className="page-body">
          <div className="group">
            <div className="group-row">
              <span className="label">Suggest microphones</span>
              <button type="button" role="switch" aria-checked={suggest} aria-label="Suggest microphones" className="switch" onClick={toggle}>
                <span />
              </button>
            </div>
          </div>

          <div className="group-label">CONNECTED NOW</div>
          {named ? (
            <div className="group">
              {mics!.map(m => (
                <button key={m.id} type="button" className="group-row" onClick={() => pick(m)} aria-pressed={m.id === inUse}>
                  <span className="icon" style={{ fontSize: 20 }}>{micEmoji(kindOf(m))}</span>
                  <span className="label">{micName(m.label)}</span>
                  {m.id === inUse && <span style={{ color: "var(--brand)", display: "flex" }}><CheckIcon size={20} /></span>}
                </button>
              ))}
            </div>
          ) : mics && (
            <div className="info-card" style={{ marginTop: 0 }}>
              <p>{blocked
                ? "Your browser has blocked the microphone for captioai.app. Allow it in the browser's site settings, then come back."
                : "Allow the microphone once, and your browser shows every microphone here by name."}</p>
              {!blocked && <button type="button" className="primary-btn compact" onClick={allow}>Allow microphone</button>}
            </div>
          )}
          {named && mics!.every(m => m.builtIn) && (
            <p className="mic-note">Connect AirPods, a headset or another microphone to choose it here.</p>
          )}

          {remembered.length > 0 && (
            <>
              <div className="group-label">REMEMBERED</div>
              <div className="group">
                {remembered.map(m => (
                  <div key={m.id} className="group-row">
                    <span className="icon" style={{ fontSize: 20 }}>{micEmoji(m.kind)}</span>
                    <span className="label">
                      {m.name || "Microphone"}
                      <small>{m.answer === "use" ? "Captions use it whenever it's connected" : "Captions keep the built-in microphone while it's connected"}</small>
                    </span>
                    <button type="button" className="mic-forget" onClick={() => forget(m)}>Forget</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
