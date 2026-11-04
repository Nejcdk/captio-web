"use client";

import { useEffect, useRef, useState } from "react";
import "./folders.css";
import { capture, getSupabase, isPreview } from "./client";
import { loadRecordingBody, type Recording, type RecordingBody, type TranscriptSegment } from "./data";
import { FolderArt } from "./FolderArt";
import { SPEAKER_COLORS, speakerTag } from "./format";
import { CheckIcon, ShareIcon, TrashIcon } from "./Icons";
import { FolderLineIcon, FolderOffIcon, PencilIcon, PlusLineIcon, SmileIcon, TextLinesIcon, UserPlusIcon } from "./editIcons";
import { getLocal } from "./local";
import { PREVIEW_BODIES } from "./preview";
import { Button, CloseButton, confirmCard, showCard, showErrorAlert } from "./ui";
import { changeRecording, deleteRecording, editContext, isSharedFolder, isWelcomeFolder, membersOf, moveRecording } from "./folders";
import { personName } from "./format";
import { openExport } from "./ExportSheet";
import { openFolderEditor } from "./FolderEditor";
import { OptionTile, SheetCard } from "./sheet";

// The app's edit sheet (app repo: EditSheetScreen.tsx) as a card: no title,
// just ✕, then one option per tile: Export, Rename, Change emoji, Move to
// folder (with the folder it's in), Edit transcription, Add speaker names,
// Delete. A friend's recording in a shared folder is theirs: only Export, and
// the line saying whose it is.

type Mode = "main" | "rename" | "emoji" | "folder" | "speakers";
export type EditScope = "all" | "folder";

// Opened from a row's ⋯ (or a right-click / long press), the recording's ⋯,
// or "Choose another folder" after a save ({ mode: "folder" }: straight to the
// Move to folder list). scope "folder": opened inside a folder (the Welcome
// demo deleted there goes for good).
export function openEditSheet(recording: Recording, from: "row" | "detail", opts: { mode?: "folder"; scope?: EditScope } = {}): void {
  showCard(close => <EditSheet rec={recording} from={from} scope={opts.scope ?? "all"} startMode={opts.mode} close={close} />);
}

const EMOJI_SECTIONS: { label: string; emojis: string[] }[] = [
  { label: "CONVERSATION", emojis: ["🎙️", "💬", "🗣️", "🎧", "📞", "👂", "🦻", "📢", "🔊", "🎤", "📻", "🎥"] },
  { label: "WORK & SCHOOL", emojis: ["📚", "🎓", "🏫", "📝", "💼", "💻", "📊", "📈", "🧪", "⚖️", "🗂️", "🧑‍🏫"] },
  { label: "HEALTH", emojis: ["🧑‍⚕️", "🏥", "💊", "🩺", "🧠", "❤️‍🩹"] },
  { label: "DAILY LIFE", emojis: ["🏠", "👨‍👩‍👧", "🍽️", "☕", "🛒", "🎂", "🐕", "🌱", "🚗", "✈️", "🌍", "⛰️"] },
  { label: "FUN", emojis: ["🎉", "😂", "🎵", "🎮", "⚽", "🎬", "🎨", "📸", "🎭", "🎳", "🎪", "🎯"] },
  { label: "SYMBOLS", emojis: ["⭐", "🔥", "💡", "✅", "❤️", "⚡", "📌", "🔔", "❓", "❗", "💯", "✨"] },
];

async function bodyOf(rec: Recording): Promise<RecordingBody> {
  const local = getLocal(rec.id)?.body;
  if (local) return local;
  if (isPreview()) return PREVIEW_BODIES[rec.id] ?? PREVIEW_BODIES.p4;
  return loadRecordingBody(getSupabase(), rec.id);
}

export function EditSheet({ rec, from, scope, startMode, close }: {
  rec: Recording; from: "row" | "detail"; scope: EditScope; startMode?: "folder"; close: () => void;
}) {
  const { library, me } = editContext();
  const [mode, setMode] = useState<Mode>(startMode ?? "main");
  const [title, setTitle] = useState(rec.title ?? "");
  const [body, setBody] = useState<RecordingBody | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const fromApp = from === "detail" ? "detail" : "home";
  const folders = library?.folders ?? [];
  const current = rec.folderId ? folders.find(f => f.id === rec.folderId) : undefined;
  // A friend's recording in a shared folder: theirs to change.
  const theirs = !!rec.userId && rec.userId !== me && !rec.local;
  const owner = theirs ? personName(library?.people ?? [], rec.folderId, rec.userId) ?? "Someone" : "";
  const ready = !rec.status;

  // What the speakers and Export need: the recording's lines.
  useEffect(() => {
    let live = true;
    bodyOf(rec).then(b => { if (live) { setBody(b); setNames(b.speakerNames ?? {}); } })
      .catch(() => { /* the tiles that need it say so when tapped */ });
    return () => { live = false; };
  }, [rec]);

  const speakers = body ? [...new Set(body.segments.map(s => s.speaker).filter(Boolean))].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) : [];
  const hasText = !!body?.segments.some(s => s.text.trim());

  const run = async (where: string, work: () => Promise<void>, title = "Something went wrong") => {
    setBusy(true);
    try {
      await work();
      close();
    } catch (e) {
      setBusy(false);
      showErrorAlert({ where, error: e, title, body: "Check your connection and try again." });
    }
  };

  const submitRename = () => {
    const next = title.trim();
    if (!next) return;
    // Renames say the generated title missed.
    if (next !== rec.title) capture("recording_renamed");
    void run("recording_rename", () => changeRecording(rec, { title: next }));
  };

  const moveTo = async (folderId: string | null) => {
    if (folderId === (current?.id ?? null)) { close(); return; }
    const target = folderId ? folders.find(f => f.id === folderId) : undefined;
    // Into a shared folder: other people will see it — say so first.
    if (target && isSharedFolder(library, target.id)) {
      const others = membersOf(library, target.id) - 1;
      const ok = await confirmCard({
        title: `Share with ${others} ${others === 1 ? "person" : "people"}?`,
        body: `Everyone in ${target.name} will see this recording.`,
        confirm: "Move",
      });
      if (!ok) return;
    }
    void run("recording_move", () => moveRecording(rec, folderId, fromApp));
  };

  const remove = async () => {
    const ok = await confirmCard({ title: "Delete recording?", body: "This cannot be undone.", confirm: "Delete", destructive: true });
    if (!ok) return;
    void run("recording_delete", () => deleteRecording(rec, scope));
  };

  const openTheExport = () => {
    if (!body) return;
    const tags = body.segments.map((seg, i) => speakerTag(seg, i, body, rec, me, library?.people ?? []));
    close();
    setTimeout(() => openExport({ rec, body, tags, from: "edit_sheet" }), 0);
  };

  const editTranscript = () => {
    if (!body) return;
    close();
    setTimeout(() => showCard(done => <TranscriptEditor rec={rec} body={body} close={done} />), 0);
  };

  if (mode === "rename") {
    return (
      <SheetCard onClose={close}>
        <div className="es-top">
          <span className="es-title">Rename</span>
          <button type="button" className="es-icon-btn" onClick={submitRename} disabled={!title.trim() || busy} aria-label="Save">
            <CheckIcon size={24} color="var(--brand)" />
          </button>
        </div>
        <input
          className="es-input"
          value={title}
          autoFocus
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submitRename(); }}
          placeholder="Enter title…"
          aria-label="Title"
        />
      </SheetCard>
    );
  }

  if (mode === "emoji") {
    return (
      <SheetCard onClose={close}>
        <div className="es-top">
          <span className="es-title">Change Emoji</span>
          <CloseButton onPress={close} />
        </div>
        <div className="es-emoji-scroll">
          {EMOJI_SECTIONS.map(section => (
            <div key={section.label}>
              <div className="es-section">{section.label}</div>
              <div className="es-emoji-grid">
                {section.emojis.map(e => (
                  <button
                    key={e} type="button" className={`es-emoji${e === rec.emoji ? " active" : ""}`}
                    onClick={() => void run("recording_emoji", () => changeRecording(rec, { emoji: e }))}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetCard>
    );
  }

  if (mode === "folder") {
    // Welcome only shows the demo: never a place for a recording, unless
    // it's where this one already is.
    const choices = folders.filter(f => !isWelcomeFolder(f) || f.id === current?.id);
    return (
      <SheetCard onClose={close}>
        <div className="es-top">
          <span className="es-title">Move to folder</span>
          {startMode === "folder"
            ? <CloseButton onPress={close} />
            : <button type="button" className="es-back" onClick={() => setMode("main")}>Back</button>}
        </div>
        <div className="es-options es-scroll">
          {choices.map(f => {
            const selected = f.id === current?.id;
            return (
              <OptionTile
                key={f.id}
                icon={<FolderArt color={f.color} icon={f.icon} width={30} />}
                label={f.name}
                color={selected ? "var(--brand)" : undefined}
                selected={selected}
                trailing={selected ? <CheckIcon size={20} color="var(--brand)" /> : undefined}
                onPress={() => void moveTo(f.id)}
                disabled={busy}
              />
            );
          })}
          <OptionTile
            icon={<PlusLineIcon size={22} color="var(--brand)" />}
            label="New folder"
            color="var(--brand)"
            onPress={() => { close(); setTimeout(() => openFolderEditor({ source: "move_sheet", moveRecording: rec }), 0); }}
          />
          {!!current && (
            <OptionTile icon={<FolderOffIcon size={22} color="var(--ink-meta)" />} label="Remove from folder" onPress={() => void moveTo(null)} disabled={busy} />
          )}
        </div>
      </SheetCard>
    );
  }

  if (mode === "speakers") {
    return (
      <SheetCard onClose={close}>
        <div className="es-top">
          <span className="es-title">Speaker names</span>
          <button type="button" className="es-back" onClick={() => setMode("main")}>Back</button>
        </div>
        <div className="es-speakers">
          {speakers.map(spk => {
            const color = SPEAKER_COLORS[(parseInt(spk, 10) - 1) % SPEAKER_COLORS.length] ?? "var(--brand)";
            return (
              <label key={spk} className="es-speaker">
                <span className="es-speaker-badge" style={{ background: `${color}22`, color }}>{spk}</span>
                <input
                  value={names[spk] ?? ""}
                  onChange={e => setNames(prev => ({ ...prev, [spk]: e.target.value }))}
                  placeholder={`Speaker ${spk}`}
                  aria-label={`Speaker ${spk}`}
                  autoComplete="off"
                />
              </label>
            );
          })}
        </div>
        <Button
          label="Save"
          size="compact"
          loading={busy}
          onPress={() => void run("speaker_names", () => changeRecording(rec, { speakerNames: names }))}
        />
      </SheetCard>
    );
  }

  return (
    <SheetCard onClose={close}>
      <div className="es-top end"><CloseButton onPress={close} /></div>
      <div className="es-options">
        {hasText && ready && (
          <OptionTile icon={<ShareIcon size={22} color="var(--brand)" />} label="Export" onPress={openTheExport} />
        )}
        {theirs ? (
          <p className="es-readonly">Only {owner} can change this recording.</p>
        ) : (
          <>
            {ready && <OptionTile icon={<PencilIcon size={22} color="var(--brand)" />} label="Rename" onPress={() => setMode("rename")} />}
            {ready && <OptionTile icon={<SmileIcon size={22} color="#F9A825" />} label="Change Emoji" onPress={() => setMode("emoji")} />}
            {ready && (
              <OptionTile
                icon={<FolderLineIcon size={22} color="#8430CE" />}
                label="Move to folder"
                onPress={() => setMode("folder")}
                trailing={current ? <span className="es-trailing">{current.name}</span> : undefined}
              />
            )}
            {ready && hasText && <OptionTile icon={<TextLinesIcon size={22} color="#1E8E3E" />} label="Edit transcription" onPress={editTranscript} />}
            {ready && speakers.length > 0 && (
              <OptionTile icon={<UserPlusIcon size={22} color="#E37400" />} label="Add speaker names" onPress={() => setMode("speakers")} />
            )}
            <OptionTile icon={<TrashIcon size={22} color="var(--destructive)" />} label="Delete" color="var(--destructive)" onPress={() => void remove()} disabled={busy} />
          </>
        )}
      </div>
    </SheetCard>
  );
}

// Edit transcription (app: Home's transcript editor), full window: Cancel,
// the title, Save; each line under its speaker's tag, editable in place.
function TranscriptEditor({ rec, body, close }: { rec: Recording; body: RecordingBody; close: () => void }) {
  const [segments, setSegments] = useState<TranscriptSegment[]>(body.segments);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await changeRecording(rec, { segments });
      close();
    } catch (e) {
      setBusy(false);
      showErrorAlert({ where: "transcript_edit", error: e, title: "Something went wrong", body: "Check your connection and try again." });
    }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  return (
    <div className="es-transcript" role="dialog" aria-modal="true" aria-label="Edit transcription">
      <div className="es-transcript-head">
        <button type="button" className="es-transcript-cancel" onClick={close}>Cancel</button>
        <span className="es-transcript-title">Edit transcription</span>
        <button type="button" className="es-transcript-save" onClick={() => void save()} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      </div>
      <div className="es-transcript-scroll">
        <div className="es-transcript-col">
          {segments.map((seg, i) => {
            const n = parseInt(seg.speaker, 10);
            const color = n > 0 ? SPEAKER_COLORS[(n - 1) % SPEAKER_COLORS.length] : "var(--brand)";
            const label = seg.speaker ? (body.speakerNames[seg.speaker]?.trim() || `Speaker ${seg.speaker}`) : "";
            return (
              <div key={i} className="es-transcript-seg">
                {label && <span className="es-tag" style={{ background: `${color}22`, color }}>{label}</span>}
                <AutoTextarea value={seg.text} onChange={text => setSegments(prev => prev.map((s, j) => (j === i ? { ...s, text } : s)))} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} className="es-transcript-input" value={value} rows={1} spellCheck={false} onChange={e => onChange(e.target.value)} />;
}
