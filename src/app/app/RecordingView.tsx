import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import "./recording.css";
import { capture, recordError, recordErrorOnce } from "./client";
import { loadRecordingBody, updateRecording, type Library, type Recording, type RecordingBody } from "./data";
import { PREVIEW_BODIES } from "./preview";
import { FolderArt } from "./FolderArt";
import { captionsText, formatDateTime, formatDuration, languageFlag, personName, speakerTag, tagInk, tint, type SpeakerTag } from "./format";
import { CopyCheckIcon, CopyIcon } from "./Icons";
import { getLocal, patchLocal, useLocalRecordings } from "./local";
import { ActionsTab, actionBlocks, actionContent, actionText } from "./ActionsTab";
import { ACTION_KINDS, type ActionKind } from "./actionPrompts";
import { RecordingNotes } from "./RecordingNotes";
import { Banner, showErrorAlert } from "./ui";
import { ExportButton, openExport } from "./ExportSheet";
import { openEditSheet } from "./editSheet";
import { TranscriptVote } from "./TranscriptVote";
import { WordText, applyWordFix, askWordFix, firstShaky, useWordFixHint, type WordTarget } from "./WordFix";
import { DemoCaptions, PlayerCard, useDemoPlayer } from "./Player";
import { SHAKY_CONFIDENCE } from "./transcript";
import { updateSettings, useSettings } from "./settings";
import { t, isRtl } from "./i18n";

// The recording on the right, like the app's Detail: emoji, title, date and
// length (the folder chip opens the folder), then 📝 Captions | ✨ Actions.
// Copy (top right) copies the captions, or the result open on the Actions
// tab; ⋯ opens the edit sheet. Under the captions: "Everything good?" and
// Export. Shaky words carry their wave and any word can be fixed (WordFix).
// The Welcome demo plays with its words appearing as they're spoken (Player).
// A recording that lives only in this browser (local.ts: the Welcome demo, a
// file being transcribed) brings its own body.

type Tab = "captions" | "actions";
type BodyState = { status: "loading" } | { status: "error" } | { status: "ready"; body: RecordingBody };

// Opened recordings stay in memory, so going back and forth is instant.
const bodies = new Map<string, RecordingBody>();
let lastTab: Tab = "captions";

export function RecordingView({ recording, library, me, preview, supabase, emptyLibrary, onBack }: {
  recording: Recording | null;
  library: Library | null;
  me: string;
  preview: boolean;
  supabase: () => SupabaseClient;
  emptyLibrary: boolean;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>(lastTab);
  const [action, setAction] = useState<ActionKind | null>(null);
  const [state, setState] = useState<BodyState>(() => {
    const cached = recording && !recording.local && bodies.get(recording.id);
    return cached ? { status: "ready", body: cached } : { status: "loading" };
  });
  const [copied, setCopied] = useState(false);
  const locals = useLocalRecordings();
  const local = recording?.local ? locals.find(r => r.id === recording.id) : undefined;

  useEffect(() => {
    if (!recording || recording.local || state.status === "ready") return;
    let live = true;
    const get = preview
      ? Promise.resolve(PREVIEW_BODIES[recording.id] ?? PREVIEW_BODIES.p4)
      : loadRecordingBody(supabase(), recording.id);
    get.then(body => {
      bodies.set(recording.id, body);
      if (live) setState({ status: "ready", body });
    }).catch(e => {
      recordError("load_recording", e);
      if (live) setState({ status: "error" });
    });
    return () => { live = false; };
  }, [recording, preview, supabase, state.status]);

  // Edited elsewhere (edit sheet, word fix in another tab, the rest of a
  // session transcribed): read its lines again.
  useEffect(() => {
    if (!recording) return;
    const onChange = (e: Event) => {
      if ((e as CustomEvent<{ id?: string }>).detail?.id !== recording.id) return;
      bodies.delete(recording.id);
      if (!recording.local) setState({ status: "loading" });
    };
    window.addEventListener("captio-recording-changed", onChange);
    return () => window.removeEventListener("captio-recording-changed", onChange);
  }, [recording]);

  const people = useMemo(() => library?.people ?? [], [library]);
  const status = local?.status ?? recording?.status;
  const localBody = local?.body;
  const body = useMemo<RecordingBody | null>(() => {
    if (!recording?.local) return state.status === "ready" ? state.body : null;
    if (status === "transcribing") return null;
    return localBody ?? { segments: [], speakerNames: {}, labels: null, people: {}, summary: [] };
  }, [recording?.local, status, localBody, state]);
  const tags = useMemo(
    () => (body && recording ? body.segments.map((seg, i) => speakerTag(seg, i, body, recording, me, people)) : []),
    [body, recording, me, people],
  );
  const { contextWords } = useSettings();
  const isDemo = !!recording?.id.startsWith("welcome-v");
  // A friend's recording (shared folder) is theirs to correct; the demo isn't text to fix.
  const fixable = !!recording && !isDemo && recording.userId === me && status !== "transcribing";
  const hint = useWordFixHint(recording?.id ?? "", fixable);
  const hintSeen = useRef(false);
  const onHintSeen = useCallback(() => { hintSeen.current = true; hint.seen(); }, [hint]);
  const hintTarget = useMemo(() => (fixable && hint.visible && body ? firstShaky(body.segments) : null), [fixable, hint.visible, body]);

  if (!recording) {
    return (
      <main className="pane">
        {emptyLibrary && (
          <div className="empty">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/web-app/owl-start.png" alt="" />
            <h2>{t("widgets.noRecordingsTitle")}</h2>
            <p>{t("web.recording.emptyBody")}</p>
          </div>
        )}
      </main>
    );
  }

  const folder = recording.folderId ? library?.folders.find(f => f.id === recording.folderId) : null;
  const by = recording.userId !== me ? personName(people, recording.folderId, recording.userId) : null;

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    lastTab = next;
    setTab(next);
    if (next === "actions" && body) {
      const made = ACTION_KINDS.filter(k => actionBlocks(recording, body, k).length > 0);
      capture("actions_tab_opened", { made: made.length, made_kinds: made.join(","), recording_kind: kindOf(body), duration_seconds: recording.durationSeconds });
    }
  };

  // Long-press or double-click a word: what was actually said? Every
  // whole-word match is replaced, and the right word can go to Words & names.
  const fixWord = async (w: WordTarget) => {
    if (!body) return;
    const shaky = w.c != null && w.c < SHAKY_CONFIDENCE;
    capture("word_fix_opened", { confidence: w.c, shaky, hint_shown: hintSeen.current });
    hint.learned();
    const answer = await askWordFix(w.text);
    if (!answer) return;
    const { segments, occurrences } = applyWordFix(body.segments, w.text, answer.corrected);
    if (!occurrences) return;
    const next = { ...body, segments };
    try {
      if (recording.local) {
        if (getLocal(recording.id)) patchLocal(recording.id, { body: next });
      } else if (!preview) {
        await updateRecording(supabase(), recording.id, { segments });
      }
    } catch (e) {
      showErrorAlert({ where: "word_fix_save", error: e, title: t("actions.failed"), body: t("common.genericError") });
      return;
    }
    if (!recording.local) {
      bodies.set(recording.id, next);
      setState({ status: "ready", body: next });
    }
    if (answer.addToVocabulary && !contextWords.some(x => x.toLowerCase() === answer.corrected.toLowerCase())) {
      updateSettings({ contextWords: [...contextWords, answer.corrected] });
    }
    capture("word_corrected", { confidence: w.c, shaky, occurrences, added_to_vocabulary: answer.addToVocabulary, kind: kindOf(body) });
  };

  const copyText = (): string => {
    if (!body) return "";
    if (tab === "captions") return captionsText(body, tags);
    return action ? actionText(actionContent(recording, body, action)) : "";
  };

  const copy = async () => {
    const text = copyText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      capture("recording_copied", { what: tab === "captions" ? "transcript" : action });
    } catch (e) {
      // The browser refused the clipboard.
      recordErrorOnce("recording_copy", e);
    }
  };

  const transcribing = status === "transcribing";
  const failed = status === "failed";
  const failure = local?.failure ?? recording.failure;
  const unsupported = !!failure?.startsWith("unsupported");

  return (
    <main className="pane">
      <div className="pane-bar">
        <button type="button" className="icon-btn back-btn" onClick={onBack} aria-label={t("common.back")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 6l-6 6l6 6" /></svg>
        </button>
        <button type="button" className="icon-btn" onClick={copy} disabled={!copyText()} aria-label={t("web.recording.copy")} title={t("web.recording.copy")}>
          {copied ? <CopyCheckIcon size={20} color="var(--brand)" /> : <CopyIcon size={20} />}
        </button>
        {!transcribing && (
          <button type="button" className="icon-btn" onClick={() => openEditSheet(recording, "detail")} aria-label={t("common.moreOptions")} title={t("common.moreOptions")}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><circle cx="5" cy="12" r="1.8" fill="currentColor" /><circle cx="12" cy="12" r="1.8" fill="currentColor" /><circle cx="19" cy="12" r="1.8" fill="currentColor" /></svg>
          </button>
        )}
      </div>
      <div className="pane-scroll">
        <article className="column">
          <div className="rec-emoji">{transcribing ? "🎙️" : recording.emoji}</div>
          <h1 className="rec-title" dir="auto">{transcribing ? t("recording.transcribing") : recording.title || t("recording.untitled")}</h1>
          <div className="rec-meta">
            <span>{formatDateTime(recording.createdAt)}</span>
            {recording.durationSeconds > 0 && <span>{formatDuration(recording.durationSeconds)}</span>}
            {folder && (
              <button
                type="button"
                className="chip rv-folder-chip"
                onClick={() => {
                  capture("detail_folder_tapped");
                  window.dispatchEvent(new CustomEvent("captio-open-folder", { detail: { id: folder.id } }));
                }}
              >
                <FolderArt color={folder.color} icon={folder.icon} width={18} filled />{folder.name}
              </button>
            )}
            {by && <span>{t("folders.addedBy", { name: by })}</span>}
          </div>
          <div className="segmented" role="tablist">
            <span className="pill" style={{ transform: tab === "actions" ? `translateX(${isRtl() ? -100 : 100}%)` : undefined }} />
            <button type="button" role="tab" aria-selected={tab === "captions"} onClick={() => switchTab("captions")}><span>📝</span>{t("detail.tabCaptions")}</button>
            <button type="button" role="tab" aria-selected={tab === "actions"} onClick={() => switchTab("actions")}><span>✨</span>{t("detail.tabActions")}</button>
          </div>
          {failed && (
            <Banner
              tone="error"
              text={unsupported
                ? t("web.recording.unsupported")
                : t("web.recording.failed")}
              style={{ marginBottom: 20 }}
            />
          )}
          {transcribing && <TranscribingState actions={tab === "actions"} />}
          {!recording.local && state.status === "loading" && <div className="loading-bar" style={{ maxWidth: 240 }} />}
          {!recording.local && state.status === "error" && (
            <div className="banner" role="alert" style={{ margin: 0 }}>
              <span>{t("web.recording.loadFailed")}</span>
              <button type="button" onClick={() => setState({ status: "loading" })}>{t("common.tryAgain")}</button>
            </div>
          )}
          {body && !failed && tab === "captions" && (
            isDemo ? (
              <DemoView body={body} tags={tags} title={recording.title} durationSeconds={recording.durationSeconds} />
            ) : (
              <>
                <Captions
                  body={body}
                  tags={tags}
                  onWord={fixable ? fixWord : undefined}
                  hint={hintTarget ? { ...hintTarget, onSeen: onHintSeen, onDismiss: hint.dismiss } : null}
                />
                <RecordingNotes recording={recording} />
                {!transcribing && body.segments.some(seg => seg.text.trim()) && (
                  <>
                    <TranscriptVote recordingId={recording.id} kind={kindOf(body)} durationSeconds={recording.durationSeconds} />
                    {/* The big way out of a recording (app: under the player). */}
                    <ExportButton onPress={() => openExport({ rec: recording, body, tags, from: "captions" })} />
                  </>
                )}
              </>
            )
          )}
          {body && !failed && tab === "actions" && (
            <ActionsTab recording={recording} body={body} tags={tags} action={action} onAction={setAction} />
          )}
        </article>
      </div>
    </main>
  );
}

// While a file is still being transcribed (app: DetailScreen TranscribingState).
function TranscribingState({ actions }: { actions: boolean }) {
  return (
    <div className="act-transcribing">
      <div className="loading-bar" />
      <b>{t("recording.transcribing")}</b>
      <p>{actions ? t("detail.summaryAfterTranscribing") : t("detail.transcribingBody")}</p>
    </div>
  );
}

// How the recording was made, as far as its lines tell (the kind itself isn't
// synced): pairs of what was said and its translation, or unknown.
function kindOf(body: RecordingBody): string {
  return body.segments.some(s => !!s.original) ? "translation" : "unknown";
}

// The Welcome demo: its words as they're spoken, and the player card.
function DemoView({ body, tags, title, durationSeconds }: { body: RecordingBody; tags: SpeakerTag[]; title: string; durationSeconds: number }) {
  const player = useDemoPlayer(title, durationSeconds);
  return (
    <>
      <DemoCaptions body={body} tags={tags} player={player} />
      <PlayerCard player={player} />
    </>
  );
}

function Captions({ body, tags, onWord, hint }: {
  body: RecordingBody;
  tags: SpeakerTag[];
  onWord?: (w: WordTarget) => void;
  hint: { seg: number; word: number; onSeen: () => void; onDismiss: () => void } | null;
}) {
  if (!body.segments.length) {
    return <Empty title={t("web.recording.noCaptionsTitle")} text={t("web.recording.noCaptionsBody")} />;
  }
  return (
    <div>
      {body.segments.map((seg, i) => {
        const tag = tags[i];
        const prev = body.segments[i - 1];
        const flag = languageFlag(seg.language);
        // A tag row where the speaker or the language changes, as in the app.
        const showTags = (!!tag.label && tag.key !== tags[i - 1]?.key) || (!!flag && seg.language !== prev?.language);
        const color = tag.color ?? "#6F7280";
        return (
          <Fragment key={i}>
            {showTags && (
              <div className="seg-tags">
                {tag.label && (
                  <span className="tag" style={{ color: tagInk(color), background: tint(color, 0.13) }}>
                    {tag.emoji && <span>{tag.emoji}</span>}
                    {tag.label}
                  </span>
                )}
                {flag && <span className="flag" aria-hidden>{flag}</span>}
              </div>
            )}
            <p className="seg-text" dir="auto">
              <WordText
                text={seg.text}
                words={seg.original ? undefined : seg.words}
                onWord={onWord}
                hint={hint && hint.seg === i ? { wordIndex: hint.word, onSeen: hint.onSeen, onDismiss: hint.onDismiss } : null}
              />
            </p>
            {seg.original?.text && (
              <p className="seg-original" dir="auto"><WordText text={seg.original.text} words={seg.original.words} onWord={onWord} /></p>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty" style={{ padding: "40px 0", alignItems: "flex-start", textAlign: "left" }}>
      <h2>{title}</h2>
      <p style={{ maxWidth: 440 }}>{text}</p>
    </div>
  );
}
