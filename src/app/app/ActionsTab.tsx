"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import "./actions.css";
import { ApiError, api, capture, getSupabase, isPreview } from "./client";
import { updateRecording, type Recording, type RecordingBody, type SummaryBlock, type TranscriptSegment } from "./data";
import type { SpeakerTag } from "./format";
import { getExtras, getLocal, patchLocal, setExtras } from "./local";
import { openPaywall } from "./paywallStore";
import { usePlus } from "./plus";
import { ensureAiConsent, showErrorAlert } from "./ui";
import { ExportButton, openExport } from "./ExportSheet";
import { FREE_SUMMARY_LIMIT, getFreeSummariesUsed, incrementFreeSummariesUsed } from "./usage";
import {
  ACTION_KINDS, ACTION_LABEL, RETRYABLE, actionErrorBody, tooShort,
  type ActionErrorCode, type ActionKind,
} from "./actionPrompts";

// The Actions tab (app repo: components/ActionGrid.tsx, ActionResult.tsx,
// lib/actions.ts, DetailScreen's runAction): six tiles, each making one thing
// from the recording with Gemini. A tile opens its result straight away, made
// first if it doesn't exist yet; Re-generate makes it again. The summary is
// synced to the account (recordings.summary); the other five stay in this
// browser, like the app keeps them on the phone. Every result counts against
// the free plan's summaries (FREE_SUMMARY_LIMIT), then Plus; not enough
// context isn't charged.

// ─── Icons: Phosphor duotone (MIT), the app's six ─────────────────────────────

type IconProps = { color: string; size: number };
const duo = (soft: string, line: string) => function DuoIcon({ color, size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" aria-hidden>
      <path d={soft} fill={color} opacity={0.2} />
      <path d={line} fill={color} />
    </svg>
  );
};

const SparklesIcon = duo(
  "M194.82,151.43l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0l-20.3-55.09-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3A7.92,7.92,0,0,1,194.82,151.43Z",
  "M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z",
);
const KeyPointsIcon = duo(
  "M208,104a79.86,79.86,0,0,1-30.59,62.92A24.29,24.29,0,0,0,168,186v6a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-6a24.11,24.11,0,0,0-9.3-19A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24A80,80,0,0,1,208,104Z",
  "M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z",
);
const NotebookIcon = duo(
  "M80,40V216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8Z",
  "M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z",
);
const ChecklistIcon = duo(
  "M216,48V208a8,8,0,0,1-8,8H64L40,192V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z",
  "M224,48V208a16,16,0,0,1-16,16H136a8,8,0,0,1,0-16h72V48H48v96a8,8,0,0,1-16,0V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM125.66,154.34a8,8,0,0,0-11.32,0L64,204.69,45.66,186.34a8,8,0,0,0-11.32,11.32l24,24a8,8,0,0,0,11.32,0l56-56A8,8,0,0,0,125.66,154.34Z",
);
const MessagesIcon = duo(
  "M231.66,213.73a8,8,0,0,1-9.93,9.93L194,215.5A72.05,72.05,0,0,1,92.06,175.89h0c1.31.07,2.62.11,3.94.11a72,72,0,0,0,67.93-95.88h0A72,72,0,0,1,223.5,186Z",
  "M232.07,186.76a80,80,0,0,0-62.5-114.17A80,80,0,1,0,23.93,138.76l-7.27,24.71a16,16,0,0,0,19.87,19.87l24.71-7.27a80.39,80.39,0,0,0,25.18,7.35,80,80,0,0,0,108.34,40.65l24.71,7.27a16,16,0,0,0,19.87-19.86ZM62,159.5a8.28,8.28,0,0,0-2.26.32L32,168l8.17-27.76a8,8,0,0,0-.63-6,64,64,0,1,1,26.26,26.26A8,8,0,0,0,62,159.5Zm153.79,28.73L224,216l-27.76-8.17a8,8,0,0,0-6,.63,64.05,64.05,0,0,1-85.87-24.88A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.75,92.48A8,8,0,0,0,215.82,188.23Z",
);
const SendIcon = duo(
  "M223.69,42.18l-58.22,192a8,8,0,0,1-14.92,1.25L108,148,20.58,105.45a8,8,0,0,1,1.25-14.92l192-58.22A8,8,0,0,1,223.69,42.18Z",
  "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z",
);

const ACTION_LOOK: Record<ActionKind, { Icon: (p: IconProps) => ReactNode; color: string }> = {
  summary: { Icon: SparklesIcon, color: "#1C49F5" },
  key_points: { Icon: KeyPointsIcon, color: "#E37400" },
  notes: { Icon: NotebookIcon, color: "#1E8E3E" },
  todos: { Icon: ChecklistIcon, color: "#8430CE" },
  qa: { Icon: MessagesIcon, color: "#007B83" },
  follow_up: { Icon: SendIcon, color: "#C2185B" },
};

// ─── What's made, and what's being made ───────────────────────────────────────
// Module-level, so a result still being made when another recording is opened
// is saved anyway and shows its spinner when you come back.

const summaries = new Map<string, SummaryBlock[]>();
const making = new Map<string, ActionKind[]>();
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

function useActionsVersion() {
  return useSyncExternalStore(subscribe, () => version, () => 0);
}

export function isMaking(id: string, kind: ActionKind) {
  return making.get(id)?.includes(kind) ?? false;
}

function setMaking(id: string, kind: ActionKind, on: boolean) {
  const now = making.get(id) ?? [];
  making.set(id, on ? [...now.filter(k => k !== kind), kind] : now.filter(k => k !== kind));
  emit();
}

// Everything stored for an action, insufficient_context included.
export function actionBlocks(rec: Recording, body: RecordingBody, kind: ActionKind): SummaryBlock[] {
  if (kind === "summary") {
    return summaries.get(rec.id)
      ?? (isPreview() && !rec.local ? getExtras<SummaryBlock[] | null>(rec.id, "summary", null) : null)
      ?? body.summary;
  }
  const blocks = getExtras<Partial<Record<ActionKind, SummaryBlock[]>>>(rec.id, "actions", {})[kind];
  return Array.isArray(blocks) ? blocks : [];
}

// Something worth showing or copying.
export function actionContent(rec: Recording, body: RecordingBody, kind: ActionKind): SummaryBlock[] {
  const blocks = actionBlocks(rec, body, kind);
  return blocks.length && blocks[0].type !== "insufficient_context" ? blocks : [];
}

// Keeps an action's result on the recording: the summary on the account (or
// with the local recording), the others in this browser. Throws if the
// account's write fails.
async function saveActionBlocks(rec: Recording, kind: ActionKind, blocks: SummaryBlock[]) {
  if (kind === "summary") {
    if (rec.local) {
      const local = getLocal(rec.id);
      if (local?.body) patchLocal(rec.id, { body: { ...local.body, summary: blocks } });
    } else if (isPreview()) {
      setExtras(rec.id, "summary", blocks);
    } else {
      await updateRecording(getSupabase(), rec.id, { summary: blocks });
    }
    summaries.set(rec.id, blocks);
  } else {
    const all = getExtras<Partial<Record<ActionKind, SummaryBlock[]>>>(rec.id, "actions", {});
    setExtras(rec.id, "actions", { ...all, [kind]: blocks });
  }
  emit();
}

// The transcript with who said what ("Ana: …"), when the recording knows its
// speakers; else the plain text.
function transcriptForModel(segments: TranscriptSegment[], tags: SpeakerTag[]): { text: string; speakers: string[] } {
  if (!segments.some(s => s.speaker) && !tags.some(t => t.label)) {
    return { text: segments.map(s => s.text.trim()).filter(Boolean).join(" "), speakers: [] };
  }
  const turns: { speaker: string; text: string }[] = [];
  segments.forEach((s, i) => {
    const text = s.text.trim();
    if (!text) return;
    const speaker = tags[i]?.label ?? "";
    const last = turns[turns.length - 1];
    if (last && last.speaker === speaker) last.text += ` ${text}`;
    else turns.push({ speaker, text });
  });
  const speakers = [...new Set(turns.map(t => t.speaker).filter(Boolean))];
  return { text: turns.map(t => (t.speaker ? `${t.speaker}: ${t.text}` : t.text)).join("\n"), speakers };
}

class ActionFailure extends Error {
  constructor(readonly code: ActionErrorCode | "unknown") {
    super(code);
  }
}

async function requestOnce(kind: ActionKind, payload: Record<string, unknown>): Promise<SummaryBlock[]> {
  if (typeof navigator !== "undefined" && !navigator.onLine) throw new ActionFailure("offline");
  try {
    const { blocks } = await api<{ blocks: SummaryBlock[] }>("/api/app/action", { kind, ...payload });
    if (!Array.isArray(blocks) || !blocks.length) throw new ActionFailure("empty");
    return blocks;
  } catch (e) {
    if (e instanceof ActionFailure) throw e;
    if (e instanceof ApiError) {
      const code = e.message as ActionErrorCode;
      throw new ActionFailure(RETRYABLE.includes(code) || ["blocked", "request", "no_key"].includes(code) ? code : e.status === 504 ? "timeout" : "server");
    }
    // fetch itself failed: no connection.
    throw new ActionFailure("offline");
  }
}

// One automatic retry when another try could help, like the app.
async function generateAction(kind: ActionKind, rec: Recording, body: RecordingBody, tags: SpeakerTag[]): Promise<SummaryBlock[]> {
  const { text, speakers } = transcriptForModel(body.segments, tags);
  if (tooShort(text)) return [{ type: "insufficient_context" }];
  const payload = { title: rec.title, createdAt: rec.createdAt, durationSeconds: rec.durationSeconds, speakers, transcript: text };
  try {
    return await requestOnce(kind, payload);
  } catch (e) {
    const code = e instanceof ActionFailure ? e.code : "unknown";
    if (!RETRYABLE.includes(code as ActionErrorCode) || code === "offline") throw e;
    await new Promise(r => setTimeout(r, code === "rate_limited" ? 4000 : 1500));
    return requestOnce(kind, payload);
  }
}

// Makes an action (or makes it again) and keeps it on the recording.
async function makeAction(
  rec: Recording, body: RecordingBody, tags: SpeakerTag[], kind: ActionKind, isPlus: boolean,
  onAction: (kind: ActionKind | null) => void, from = "actions_tab",
): Promise<void> {
  if (isMaking(rec.id, kind)) return;
  const regenerate = actionBlocks(rec, body, kind).length > 0;
  const about = { kind, regenerate, from, duration_seconds: rec.durationSeconds };
  // Free plan: the summaries' allowance, shared by every action, then Plus.
  if (!isPlus && getFreeSummariesUsed() >= FREE_SUMMARY_LIMIT) {
    capture("action_gated", about);
    if (!regenerate) onAction(null);
    openPaywall("summary_gate");
    return;
  }
  // The transcript goes to the AI provider: asked once, like the app.
  if (!(await ensureAiConsent())) {
    capture("action_blocked", { action: "action", reason: "consent_declined" });
    if (!regenerate) onAction(null);
    return;
  }
  const startedAt = Date.now();
  const seconds = () => Math.round((Date.now() - startedAt) / 100) / 10;
  setMaking(rec.id, kind, true);
  try {
    const blocks = await generateAction(kind, rec, body, tags);
    await saveActionBlocks(rec, kind, blocks);
    const insufficient = blocks[0]?.type === "insufficient_context";
    // Not enough to work with isn't charged.
    if (!isPlus && !insufficient) incrementFreeSummariesUsed();
    capture("action_generated", { ...about, is_plus: isPlus, seconds: seconds(), blocks: blocks.length, insufficient });
    if (kind === "summary") {
      // A summary can "succeed" and still be useless (app: summaryStats).
      const transcript = body.segments.map(seg => seg.text).join(" ");
      capture("summary_generated", {
        is_plus: isPlus, ...(from === "export" ? { from } : {}),
        insufficient, truncated: transcript.length > 160000, chars: transcript.length, blocks: blocks.length,
      });
    }
  } catch (e) {
    // A failed request is never saved: the tile stays ready to try again.
    const code = e instanceof ActionFailure ? e.code : "unknown";
    capture("action_failed", { ...about, code, seconds: seconds(), online: navigator.onLine });
    showErrorAlert({
      where: `${kind}_generate`,
      error: e,
      title: "Could not make this",
      body: actionErrorBody(code),
      retry: () => { onAction(kind); makeAction(rec, body, tags, kind, isPlus, onAction); },
    });
    if (!regenerate) onAction(null);
  } finally {
    setMaking(rec.id, kind, false);
  }
}

// Export (ExportSheet): an action that doesn't exist yet is made first, the
// same way as tapping it here (free limit, consent, kept on the recording).
// Resolves to its content, empty when it couldn't be made or had too little.
export async function makeActionForExport(
  rec: Recording, body: RecordingBody, tags: SpeakerTag[], kind: ActionKind, isPlus: boolean,
): Promise<SummaryBlock[]> {
  await makeAction(rec, body, tags, kind, isPlus, () => {}, "export");
  return actionContent(rec, body, kind);
}

// ─── The tab ──────────────────────────────────────────────────────────────────

export function ActionsTab({ recording, body, tags, action, onAction }: {
  recording: Recording;
  body: RecordingBody;
  tags: SpeakerTag[];
  action: ActionKind | null;
  onAction: (kind: ActionKind | null) => void;
}) {
  useActionsVersion();
  const { isPlus } = usePlus();
  const rec = recording;

  const runAction = (kind: ActionKind) => makeAction(rec, body, tags, kind, isPlus, onAction);

  // A tile: its result straight away, made first if it doesn't exist yet.
  const openAction = (kind: ActionKind) => {
    const made = actionBlocks(rec, body, kind).length > 0;
    capture("action_opened", { kind, made, making: isMaking(rec.id, kind) });
    onAction(kind);
    if (!made) runAction(kind);
  };

  const toggleTodo = async (index: number) => {
    if (!action) return;
    const blocks = actionBlocks(rec, body, action).map(b => ({ ...b }));
    const block = blocks[index];
    if (!block || block.type !== "todo") return;
    block.done = !block.done;
    try {
      await saveActionBlocks(rec, action, blocks);
      capture("action_todo_toggled", { kind: action, done: block.done });
    } catch (e) {
      // The tick didn't stick: say so rather than show it ticked.
      showErrorAlert({ where: "action_todo_toggle", error: e, title: "Could not make this", body: "Something went wrong. Please check your connection and try again." });
    }
  };

  if (!action) {
    return (
      <div className="act-grid-wrap">
        <div className="act-grid">
          {ACTION_KINDS.map(kind => {
            const { Icon, color } = ACTION_LOOK[kind];
            return (
              <button key={kind} type="button" className="act-tile" style={{ borderColor: color }} onClick={() => openAction(kind)}>
                {/* Still being made (the user went back to the tiles): a small spinner. */}
                {isMaking(rec.id, kind) && <span className="act-spinner small" style={{ borderTopColor: color }} aria-label="Working" />}
                <Icon color={color} size={48} />
                <span className="act-tile-label">{ACTION_LABEL[kind]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const title = <ActionTitle kind={action} onBack={() => { capture("action_closed", { kind: action }); onAction(null); }} />;
  if (isMaking(rec.id, action)) {
    return (
      <div>
        {title}
        <div className="act-loading">
          <span className="act-spinner" aria-hidden />
          <span>Captio AI is working on it…</span>
        </div>
      </div>
    );
  }
  const blocks = actionBlocks(rec, body, action);
  if (!blocks.length) return title;
  const regen = (
    <button type="button" className="act-regen" onClick={() => runAction(action)}>
      <RefreshIcon />Re-generate
    </button>
  );
  if (blocks[0].type === "insufficient_context") {
    return (
      <div>
        {title}
        <div className="act-insufficient">
          <span className="emoji">🔍</span>
          <b>Not enough context</b>
          <p>The recording is too short or doesn&rsquo;t contain enough content to summarize.</p>
          {regen}
        </div>
      </div>
    );
  }
  return (
    <div>
      {title}
      <ActionResult blocks={blocks} onToggleTodo={toggleTodo} />
      {regen}
      {/* Under the result, only this action (app: Export from an action's page). */}
      <ExportButton onPress={() => openExport({ rec, body, tags, action, from: "action" })} />
    </div>
  );
}

function ActionTitle({ kind, onBack }: { kind: ActionKind; onBack: () => void }) {
  const { Icon, color } = ACTION_LOOK[kind];
  return (
    <button type="button" className="act-title" onClick={onBack}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 6l-6 6l6 6" />
      </svg>
      <Icon color={color} size={20} />
      <span>{ACTION_LABEL[kind]}</span>
    </button>
  );
}

function RefreshIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B0B0B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
  );
}

// ─── A result (app: components/ActionResult.tsx) ──────────────────────────────

const TONE_COLOR = { blue: "#1C49F5", green: "#1E8E3E", orange: "#E37400", red: "#D93025", purple: "#8430CE" } as const;
const TONE_EMOJI = { blue: "💡", green: "✅", orange: "⚠️", red: "🚨", purple: "📌" } as const;
const tintHex = (hex: string, alpha: number) => hex + Math.round(alpha * 255).toString(16).padStart(2, "0");

type Fact = Extract<SummaryBlock, { type: "fact" }>;

export function ActionResult({ blocks, onToggleTodo }: { blocks: SummaryBlock[]; onToggleTodo?: (index: number) => void }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    // Neighbouring facts share one card.
    if (block.type === "fact") {
      const facts: Fact[] = [];
      const first = i;
      while (i < blocks.length && blocks[i].type === "fact") facts.push(blocks[i++] as Fact);
      i--;
      out.push(
        <div key={first} className="act-facts" dir="auto">
          {facts.map((f, j) => (
            <div key={j} className="act-fact">
              <span>{f.label}</span>
              <b>{f.text}</b>
            </div>
          ))}
        </div>,
      );
      continue;
    }
    const index = i;
    out.push(<Block key={i} block={block} first={i === 0} onToggle={onToggleTodo ? () => onToggleTodo(index) : undefined} />);
  }
  return <div className="act-result">{out}</div>;
}

function Block({ block, first, onToggle }: { block: SummaryBlock; first: boolean; onToggle?: () => void }) {
  switch (block.type) {
    case "header":
      return (
        <h2 className={`act-header${first ? " first" : ""}`} dir="auto">
          {block.emoji && <span>{block.emoji}</span>}
          <span>{block.text}</span>
        </h2>
      );
    case "subheader":
      return <h3 className="act-subheader" dir="auto">{block.text}</h3>;
    case "paragraph":
      return <p className="act-paragraph" dir="auto">{block.text}</p>;
    case "bullet":
      return (
        <div className="act-row" dir="auto">
          <span className="act-dot" />
          <span className="act-body">{block.label && <b>{block.label}: </b>}{block.text}</span>
        </div>
      );
    case "numbered":
      return (
        <div className="act-row" dir="auto">
          <span className="act-num">{block.n}</span>
          <span className="act-body">{block.text}</span>
        </div>
      );
    case "todo":
      return (
        <button type="button" className="act-todo" dir="auto" onClick={onToggle} aria-pressed={block.done} disabled={!onToggle}>
          <span className={`act-box${block.done ? " done" : ""}`}>{block.done ? "✓" : ""}</span>
          <span className="act-todo-text">
            <span className={`act-body${block.done ? " done" : ""}`}>{block.text}</span>
            {(block.owner || block.due) && (
              <span className="act-chips">
                {block.owner && <span>👤 {block.owner}</span>}
                {block.due && <span>📅 {block.due}</span>}
              </span>
            )}
          </span>
        </button>
      );
    case "quote":
      return (
        <blockquote className="act-quote" dir="auto">
          <span>&ldquo;{block.text}&rdquo;</span>
          {block.speaker && <span className="who">— {block.speaker}</span>}
        </blockquote>
      );
    case "callout": {
      const color = TONE_COLOR[block.tone] ?? TONE_COLOR.blue;
      return (
        <div className="act-callout" dir="auto" style={{ background: tintHex(color, 0.07), borderColor: tintHex(color, 0.22) }}>
          <div className="act-callout-title">
            <span>{TONE_EMOJI[block.tone] ?? "💡"}</span>
            {block.title && <b style={{ color }}>{block.title}</b>}
          </div>
          <p>{block.text}</p>
        </div>
      );
    }
    case "qa":
      return (
        <div className="act-qa" dir="auto">
          <b>{block.question}</b>
          <p className={block.answered ? undefined : "open"}>{block.answered ? "" : "⏳ "}{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

// Plain text of a result, for Copy.
export function actionText(blocks: SummaryBlock[]): string {
  return blocks.map(b => {
    switch (b.type) {
      case "header": return `${b.emoji ? `${b.emoji} ` : ""}${b.text}`;
      case "bullet": return `- ${b.label ? `${b.label}: ` : ""}${b.text}`;
      case "numbered": return `${b.n}. ${b.text}`;
      case "todo": return `${b.done ? "[x]" : "[ ]"} ${b.text}${b.owner ? ` (${b.owner})` : ""}${b.due ? `, ${b.due}` : ""}`;
      case "quote": return `"${b.text}"${b.speaker ? ` (${b.speaker})` : ""}`;
      case "callout": return `${b.title ? `${b.title}: ` : ""}${b.text}`;
      case "fact": return `${b.label}: ${b.text}`;
      case "qa": return `${b.question}\n${b.text}`;
      case "insufficient_context": return "";
      default: return b.text;
    }
  }).filter(Boolean).join("\n\n");
}
