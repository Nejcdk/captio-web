"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { capture, generateId, getSupabase, initClient, isPreview, recordError, recordErrorOnce, setPreview, store, api } from "./client";
import { insertRecording, loadLibrary, type Library, type Recording, type TranscriptSegment } from "./data";
import { PREVIEW_LIBRARY, PREVIEW_USER } from "./preview";
import { SignIn, type Provider } from "./SignIn";
import { HomeColumn, type HomeTab } from "./HomeColumn";
import { RecordingView } from "./RecordingView";
import { SettingsView, type SettingsPage } from "./SettingsView";
import { SettingsIcon } from "./Icons";
import { CardHost, confirmCard, ensureAiConsent, ModalCard, Button, showCard, showErrorAlert } from "./ui";
import { Paywall } from "./Paywall";
import { usePaywall, openPaywall } from "./paywallStore";
import { useLocalRecordings, putLocal } from "./local";
import { onLibraryChanged, notifyLibraryChanged } from "./events";
import { refreshPlus, usePlus, isPlusNow } from "./plus";
import { freeSecondsLeft } from "./usage";
import posthog from "posthog-js";
import { showDailyLimit } from "./limitCard";
import { Dock } from "./Dock";
import { CaptionsSheet, type TranslateNames } from "./CaptionsSheet";
import { LiveSession, takeLiveDraft, type LiveMode, type LiveResult } from "./live";
import { MicError } from "./audio";
import { preferredMicId } from "./mics";
import { addRestToRecording, setLiveRest, type LiveRest } from "./liveRest";
import { removeSessionAudio, sweepSessionAudio } from "./sessionAudio";
import { afterSave } from "./postSave";
import { markInviteDue } from "./invite";
import { InviteChip } from "./InviteChip";
import { InvitePage } from "./InvitePage";
import { LANGUAGES, useSettings } from "./settings";
import { confidenceStats, contextText, recordingShapeStats, translationTranscript } from "./transcript";
import { WELCOME_FOLDER, isStarterRecording, seedWelcome } from "./welcome";
import { openFailedUpload, openUpload, resumeUploads } from "./upload";

// Captio AI on the computer, laid out like the iPad app: Home's blue band
// with the wordmark and the gear, the white card under it, and in the card
// the phone's Home on the left (All transcripts | Folders, the dock with the
// record button) with the recording open beside it. Settings takes the whole
// card, as a pushed page does on the phone. Live captions and translation
// fill the window. Where you are lives in the address (?tab=folders&f=…,
// &r=<recording>, ?view=settings&page=…), so a reload keeps it.

const ENTRY_FROM = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("from") : null;

export type Account = { userId: string; name: string; email: string; preview?: boolean };
export { capture };

function accountOf(user: User): Account {
  const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
  return { userId: user.id, name: (meta.full_name || meta.name || "").trim(), email: user.email ?? "" };
}

type LibraryState = { status: "loading" } | { status: "error" } | { status: "ready"; library: Library };

// Back to the app after this long away, the list is read again (new
// recordings from the phone show up without a reload).
const REFRESH_AFTER_MS = 30_000;

export default function DesktopApp({ supabaseUrl, anonKey, allowPreview }: {
  supabaseUrl: string; anonKey: string; allowPreview: boolean;
}) {
  const [account, setAccount] = useState<Account | null | "loading">("loading");
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    const sb = initClient(supabaseUrl, anonKey);
    const params = new URLSearchParams(window.location.search);
    if (allowPreview && params.has("preview")) {
      setPreview(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the address is only known in the browser
      setAccount({ userId: PREVIEW_USER, name: "Nejc Dovžan Kukić", email: "nejc@example.com", preview: true });
      return;
    }
    const returning = params.has("code");
    if (params.get("error_description") || params.get("error")) {
      recordError("sign_in", params.get("error_description") ?? params.get("error"));
      setSignInError("Signing in didn't work. Please try again.");
    }
    // Supabase says SIGNED_IN again whenever the tab comes back into view:
    // the sign-in is counted once, on the way back from Apple or Google.
    let counted = false;
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      setAccount(session?.user ? accountOf(session.user) : null);
      // Back from Apple or Google (not a session restored from storage).
      if (event === "SIGNED_IN" && returning && !counted && session?.user) {
        counted = true;
        capture("sign_in", { provider: (session.user.app_metadata as { provider?: string })?.provider });
      }
    });
    sb.auth.getSession().then(({ data }) => {
      setAccount(data.session?.user ? accountOf(data.session.user) : null);
      // Back from Apple or Google: the code in the address has done its job.
      if (params.has("code") || params.has("error")) window.history.replaceState(null, "", "/app");
    });
    return () => sub.subscription.unsubscribe();
  }, [allowPreview, supabaseUrl, anonKey]);

  useEffect(() => {
    // `from`: the website button that brought them (header, menu, download_card,
    // the app's Settings), read before the address is tidied up.
    if (account !== "loading") capture("web_app_viewed", { signed_in: !!account, from: ENTRY_FROM });
  }, [account === "loading", !!account]); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = async (provider: Provider) => {
    capture("web_app_signin_tapped", { provider });
    setSignInError(null);
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/app` },
    });
    if (error) {
      recordError("sign_in", error, { provider });
      setSignInError("Signing in didn't work. Please try again.");
    }
  };

  // The app asks first; then this browser forgets the account's local things
  // (the app clears its local recordings the same way).
  const signOut = async () => {
    if (!(await confirmCard({ title: "Sign out?", body: "You can sign back in anytime.", confirm: "Sign Out", destructive: true }))) return;
    capture("signed_out", { is_plus: isPlusNow() });
    if (account && account !== "loading" && account.preview) {
      window.location.href = "/app";
      return;
    }
    await getSupabase().auth.signOut({ scope: "local" }).catch(e => recordError("sign_out", e));
    clearAccountData();
    setAccount(null);
  };

  // The language and time zone of the lifecycle emails (app: AuthContext);
  // version and platform stay what the phone sent.
  const userId = account && account !== "loading" && !account.preview ? account.userId : null;
  useEffect(() => {
    if (!userId) return;
    getSupabase().rpc("set_email_profile", {
      p_language: navigator.language.toLowerCase().split("-")[0],
      p_time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
    }).then(({ error }) => { if (error) recordErrorOnce("email_profile", error); });
  }, [userId]);

  // Uncaught errors and unhandled promise rejections (a button that "does
  // nothing") go to analytics, as the app sends them.
  useEffect(() => {
    const onError = (e: ErrorEvent) => { try { posthog.captureException(e.error ?? e.message, { page: "web_app" }); } catch { /* analytics only */ } };
    const onRejection = (e: PromiseRejectionEvent) => { try { posthog.captureException(e.reason, { page: "web_app" }); } catch { /* analytics only */ } };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => { window.removeEventListener("error", onError); window.removeEventListener("unhandledrejection", onRejection); };
  }, []);

  if (account === "loading") return <div className="capp" />;
  if (!account) return <div className="capp"><SignIn onSignIn={signIn} error={signInError} /></div>;
  return <Shell account={account} onSignOut={signOut} supabaseUrl={supabaseUrl} />;
}

// What this browser keeps for the signed-in account (app: sign-out wipes the
// local recordings).
function clearAccountData() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key === "captio_local_recordings" || key.startsWith("captio_rec_") || key === "captio_live_draft" || key === "captio_plus" || key === "captio_upload_jobs") localStorage.removeItem(key);
    }
  } catch {
    // Storage blocked: nothing kept anyway.
  }
  try { indexedDB.deleteDatabase("captio-uploads"); } catch { /* no uploads kept */ }
}

type Route = { tab: HomeTab; folderId: string | null; recordingId: string | null; settings: SettingsPage | null };

function readLocation(): Route {
  const p = new URLSearchParams(window.location.search);
  const folderId = p.get("f");
  return {
    tab: p.get("tab") === "folders" || folderId ? "folders" : "all",
    folderId,
    recordingId: p.get("r"),
    settings: p.get("view") === "settings" ? ((p.get("page") as SettingsPage) || "main") : null,
  };
}

type Live = { session: LiveSession; mode: LiveMode; folderId: string | null };

// Recording into a shared folder: saved every hour, carrying on in a new
// recording (app: rollover, HOURLY_SAVE_SECONDS). Dev: /app?hourly=<seconds>.
function hourlySeconds(): number {
  if (process.env.NODE_ENV === "development") {
    const n = Number(new URLSearchParams(window.location.search).get("hourly"));
    if (n > 0) return n;
  }
  return 3600;
}

const TRANSLATE_KEY = "captio_translate_languages";
const STARTED_KEY = "captio_started_from_home";

function Shell({ account, onSignOut, supabaseUrl }: { account: Account; onSignOut: () => void; supabaseUrl: string }) {
  // Shell only renders in the browser (after the session is known), so the
  // address can be read straight away.
  const [state, setState] = useState<LibraryState>(() => (account.preview ? { status: "ready", library: PREVIEW_LIBRARY } : { status: "loading" }));
  const [route, setRoute] = useState<Route>(readLocation);
  const [query, setQuery] = useState("");
  // Narrow windows show one side at a time.
  const [pane, setPane] = useState<"list" | "recording">("list");
  const [online, setOnline] = useState(() => navigator.onLine);
  const [live, setLive] = useState<Live | null>(null);
  const [translate, setTranslate] = useState<TranslateNames>(() => {
    const t = store.get<TranslateNames>(TRANSLATE_KEY, { target: "English", source: null });
    // An older choice with the same language on both sides: one way.
    return t.source && t.source === t.target ? { ...t, source: null } : t;
  });
  const [startedHere, setStartedHere] = useState(() => store.get<boolean>(STARTED_KEY, false));
  const local = useLocalRecordings();
  const settings = useSettings();
  const plus = usePlus();
  const paywall = usePaywall();
  const loadedAt = useRef(0);

  const load = useCallback(async () => {
    loadedAt.current = Date.now();
    if (account.preview) return;
    try {
      const library = await loadLibrary(getSupabase());
      setState({ status: "ready", library });
    } catch (e) {
      recordError("load_library", e);
      setState(s => (s.status === "ready" ? s : { status: "error" }));
    }
  }, [account.preview]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets state only after its fetch
    load();
    refreshPlus();
    seedWelcome(account.userId, supabaseUrl);
    resumeUploads();
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - loadedAt.current > REFRESH_AFTER_MS) {
        load();
        refreshPlus();
      }
    };
    const onNet = () => setOnline(navigator.onLine);
    const onOpenRecording = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id) setRoute(r => ({ ...r, recordingId: id, settings: null }));
    };
    // A recording's folder chip (or anything else) opens a folder.
    const onOpenFolder = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id) {
        setQuery("");
        setRoute(r => ({ ...r, tab: "folders", folderId: id, settings: null }));
        setPane("list");
      }
    };
    sweepSessionAudio();
    const offChanged = onLibraryChanged(load);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onNet);
    window.addEventListener("offline", onNet);
    window.addEventListener("captio-open-recording", onOpenRecording);
    window.addEventListener("captio-open-folder", onOpenFolder);
    window.addEventListener("captio-recording-changed", load);
    return () => {
      offChanged();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onNet);
      window.removeEventListener("offline", onNet);
      window.removeEventListener("captio-open-recording", onOpenRecording);
      window.removeEventListener("captio-open-folder", onOpenFolder);
      window.removeEventListener("captio-recording-changed", load);
    };
  }, [load, account.userId, supabaseUrl]);

  // The account's recordings and folders, plus what lives only here (the
  // Welcome demo and its folder, files being transcribed), newest first.
  const server = state.status === "ready" ? state.library : null;
  const library: Library | null = useMemo(() => {
    if (!server) return null;
    const ids = new Set(server.recordings.map(r => r.id));
    const mine = local.filter(r => !ids.has(r.id));
    return {
      recordings: [...mine, ...server.recordings].sort((a, b) => b.createdAt - a.createdAt),
      folders: mine.some(r => r.folderId === WELCOME_FOLDER.id) ? [WELCOME_FOLDER, ...server.folders] : server.folders,
      people: server.people,
    };
  }, [server, local]);

  const folder = route.tab === "folders" && route.folderId ? library?.folders.find(f => f.id === route.folderId) ?? null : null;

  // What the left column lists: everything, or the open folder; then the search.
  const recordings = useMemo(() => {
    const all = (library?.recordings ?? []).filter(r => !(r as { hiddenFromAll?: boolean }).hiddenFromAll || route.tab === "folders");
    const inView = route.tab === "all" ? all : folder ? all.filter(r => r.folderId === folder.id) : [];
    const q = query.trim().toLowerCase();
    return q ? inView.filter(r => r.title.toLowerCase().includes(q)) : inView;
  }, [library, route.tab, folder, query]);

  // Something is always open on the right: the chosen recording, else the
  // first one in the list (the newest one while the folders show).
  const selected = (route.recordingId ? library?.recordings.find(r => r.id === route.recordingId) : undefined)
    ?? recordings[0] ?? library?.recordings[0] ?? null;

  useEffect(() => {
    if (!library) return;
    const p = new URLSearchParams(window.location.search);
    const parts: string[] = p.has("preview") ? ["preview=1"] : [];
    // Dev flags stay in the address.
    for (const flag of ["plus", "fakemic"]) if (p.get(flag) === "1") parts.push(`${flag}=1`);
    if (route.settings) {
      parts.push("view=settings");
      if (route.settings !== "main") parts.push(`page=${route.settings}`);
    } else {
      if (route.tab === "folders") parts.push(folder ? `f=${encodeURIComponent(folder.id)}` : "tab=folders");
      if (selected) parts.push(`r=${encodeURIComponent(selected.id)}`);
    }
    window.history.replaceState(window.history.state, "", parts.length ? `/app?${parts.join("&")}` : "/app");
  }, [library, route, folder, selected]);

  const go = (patch: Partial<Route>) => setRoute(r => ({ ...r, ...patch }));
  const setTab = (tab: HomeTab) => {
    if (tab === route.tab) return;
    capture("home_tab_switched", { tab, how: "tap", folders: library?.folders.length ?? 0 });
    setQuery("");
    go({ tab, folderId: null });
  };
  const openFolder = (id: string | null) => {
    if (id) capture("folder_opened", { recordings: (library?.recordings ?? []).filter(r => r.folderId === id).length });
    setQuery("");
    go({ folderId: id, recordingId: null });
  };

  // On a phone-sized screen a recording opens as its own page, like on the
  // phone, and the browser's back (or the swipe) returns to the list.
  const narrow = () => window.matchMedia("(max-width: 760px)").matches;
  const open = (id: string) => {
    const rec = library?.recordings.find(r => r.id === id);
    if (rec?.status === "failed") { openFailedUpload(id); return; }
    capture("recording_opened");
    if (id.startsWith("welcome-v")) capture("demo_opened");
    go({ recordingId: id });
    if (narrow() && pane === "list") window.history.pushState({ pane: "recording" }, "");
    setPane("recording");
  };
  const backToList = () => {
    if (window.history.state?.pane === "recording") window.history.back();
    else setPane("list");
  };
  useEffect(() => {
    const onPop = () => setPane("list");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ↑ / ↓ move through the list, like Mail or Notes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (live || route.settings || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, [contenteditable], .ui-scrim")) return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const i = recordings.findIndex(r => r.id === selected?.id);
      const next = recordings[e.key === "ArrowDown" ? Math.min(recordings.length - 1, i + 1) : Math.max(0, i - 1)];
      if (next) {
        e.preventDefault();
        setRoute(r => ({ ...r, recordingId: next.id }));
        document.querySelector(`[data-row="${CSS.escape(next.id)}"]`)?.scrollIntoView({ block: "nearest" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recordings, selected, route.settings, live]);

  // ─── Saving a recording ───────────────────────────────────────────────────

  const lastSavedText = useRef("");
  const saveRecording = useCallback(async (opts: {
    segments: TranscriptSegment[]; seconds: number; mode: LiveMode; folderId: string | null; targetCode?: string; createdAt: number;
    how?: string; extra?: Record<string, unknown>;
  }): Promise<string> => {
    const id = generateId();
    const text = opts.mode === "translation" ? translationTranscript(opts.segments, opts.targetCode) : opts.segments.map(s => s.text).join(" ");
    let title = "";
    let emoji = "🎙️";
    try {
      const t = await api<{ title: string; emoji: string }>("/api/app/title", { transcript: text });
      title = t.title;
      emoji = t.emoji || emoji;
    } catch (e) {
      // Falls back to the first words, as the app does; reported once.
      recordErrorOnce("title_generate", e);
    }
    if (!title) title = text.trim().split(/\s+/).slice(0, 6).join(" ") || "Untitled";
    const rec = { id, title, emoji, durationSeconds: opts.seconds, createdAt: opts.createdAt, folderId: opts.folderId, segments: opts.segments };
    if (isPreview()) {
      putLocal({ id, userId: account.userId, title, emoji, durationSeconds: opts.seconds, createdAt: opts.createdAt, folderId: opts.folderId,
        body: { segments: opts.segments, speakerNames: {}, labels: null, people: {}, summary: [] } });
    } else {
      await insertRecording(getSupabase(), account.userId, rec);
      notifyLibraryChanged();
    }
    capture("recording_saved", {
      kind: opts.mode, duration_seconds: opts.seconds, how: opts.how ?? "check",
      ...opts.extra, ...confidenceStats(opts.segments), ...recordingShapeStats(opts.segments, opts.seconds),
    });
    lastSavedText.current = text;
    return id;
  }, [account.userId]);

  // A session the tab closed on: saved now, like the app's session recovery.
  useEffect(() => {
    const lost = takeLiveDraft();
    if (!lost) return;
    const { draft } = lost;
    const minutesSince = Math.round((Date.now() - draft.startedAt - draft.seconds * 1000) / 60000);
    capture("capture_lost", { mode: draft.mode, seconds_open: draft.seconds, minutes_since: minutesSince, had_text: true, last_app_state: "closed" });
    saveRecording({ segments: lost.segments, seconds: draft.seconds, mode: draft.mode, folderId: draft.folderId ?? null, targetCode: draft.translate?.target, createdAt: draft.startedAt, how: "recovered" })
      .then(() => capture("capture_recovered", { result: "saved", mode: draft.mode, seconds: draft.seconds, audio_parts: 0, had_text: true, minutes_since: minutesSince }))
      .catch(e => {
        // Kept for the next visit: nothing is lost on a network error.
        store.set("captio_live_draft", draft);
        recordError("capture_recover", e);
      });
  }, [saveRecording]);

  // ─── Live captions and translation ────────────────────────────────────────

  const codeOf = (name: string | null) => (name ? LANGUAGES.find(l => l.name === name)?.code ?? null : null);

  const startLive = async (mode: LiveMode) => {
    if (live) return;
    if (!(await ensureAiConsent(mode === "translation" ? "translation" : "captions"))) {
      capture("action_blocked", { action: mode, reason: "consent_declined" });
      return;
    }
    if (!isPlusNow() && freeSecondsLeft() <= 0) {
      capture("action_blocked", { action: mode, reason: "daily_limit" });
      showDailyLimit("start", mode);
      return;
    }
    const folderId = route.tab === "folders" && folder && folder.id !== WELCOME_FOLDER.id ? folder.id : null;
    capture("captions_opened", { mode, in_folder: !!folderId, signed_in: true, is_plus: isPlusNow() });
    if (mode === "translation") capture("translation_session", { target: translate.target, source: translate.source ?? "auto" });
    const session = new LiveSession({
      mode,
      diarize: settings.separateSpeakers,
      languageHints: settings.settingsLangHints.map(codeOf).filter((c): c is string => !!c),
      context: contextText(settings.contextWords, settings.contextWindowText),
      translate: mode === "translation" ? { target: codeOf(translate.target) ?? "en", source: codeOf(translate.source) } : null,
      deviceId: await preferredMicId(settings.microphoneId),
      isPlus: isPlusNow,
      folderId,
      onCreditsOut: () => { void finishLiveRef.current({ limit: true }); },
    });
    setLive({ session, mode, folderId });
    if (!startedHere) { store.set(STARTED_KEY, true); setStartedHere(true); }
    try {
      await session.start();
    } catch (e) {
      session.discard();
      void removeSessionAudio(session.audioId);
      setLive(null);
      if (e instanceof MicError && e.kind === "denied") {
        capture("action_blocked", { action: mode, reason: "mic_denied" });
        showCard(close => (
          <ModalCard owl="owl-confused" title="Microphone access needed" body="Captio AI needs the microphone to create live captions. Allow it for captioai.app in your browser's site settings, then try again." onClose={close}>
            <Button label="Close" size="compact" onPress={close} />
          </ModalCard>
        ));
      } else if (e instanceof MicError && e.kind === "unsupported") {
        showErrorAlert({ where: "captions_start_unsupported", error: e, title: "Could not start recording", body: "This browser can't record audio. Use a recent Chrome, Edge, Safari or Firefox." });
      } else {
        showErrorAlert({ where: "captions_start", error: e, title: "Could not start recording", body: "The microphone may be in use. End any call or other recording app, then try again." });
      }
    }
  };

  const changeTranslate = (next: TranslateNames) => {
    setTranslate(next);
    store.set(TRANSLATE_KEY, next);
    live?.session.restart({ translate: { target: codeOf(next.target) ?? "en", source: codeOf(next.source) } });
  };

  // A saved part's afterlife: what the live captions never covered is added
  // from the kept audio (connection gaps now; the credits part with Plus, else
  // it waits on the recording for Unlock with Plus); its audio goes when
  // nothing needs it.
  const keepRest = (id: string, session: LiveSession, result: LiveResult) => {
    if (!result.audioId) return;
    if (!result.gaps.length) {
      // Nothing missing (an hourly part's audio stays while the session runs).
      void removeSessionAudio(result.audioId);
      return;
    }
    const o = session.options;
    const rest: LiveRest = {
      audioId: result.audioId, audioOffset: result.audioOffset, gaps: result.gaps, mode: o.mode, diarize: o.diarize,
      languageHints: o.languageHints, context: o.context, translate: o.translate, cutAt: result.creditsCutAt, seconds: result.seconds,
    };
    setLiveRest(id, rest);
    void addRestToRecording(id).catch(() => { /* recorded; the note offers it again */ });
  };

  // The follow-ups after a save, as on the phone.
  const afterLiveSave = (id: string, folderId: string | null, transcript: string, cut: boolean) => {
    const own = (library?.recordings ?? []).filter(r => !isStarterRecording(r.id)).length + 1;
    if (!cut) afterSave({ id, transcript, folderId, where: "live" });
    markInviteDue("saved_recording", own);
  };

  // `limit`: the free credits ran out (live.ts STOP_AT_CREDITS_LIMIT): saved,
  // then the out-of-credits card over it (app: limitStopRef).
  const finishLive = async (opts: { limit?: boolean } = {}) => {
    if (!live) return;
    if (finishing.current) return;
    finishing.current = true;
    try {
      await finishLiveNow(live, !!opts.limit);
    } finally {
      finishing.current = false;
    }
  };
  const finishing = useRef(false);
  const finishLiveRef = useRef(finishLive);
  finishLiveRef.current = finishLive;

  const finishLiveNow = async (current: Live, limit: boolean) => {
    const { session, mode, folderId } = current;
    let result: LiveResult;
    try {
      result = await session.stop();
    } catch (e) {
      showErrorAlert({ where: "live_stop", error: e });
      return;
    }
    if (!result.segments.length && !result.gaps.length) {
      // Nothing was said: nothing to keep, as on the phone.
      capture("caption_session_ended", session.stats("deleted"));
      session.clearDraft();
      void removeSessionAudio(session.audioId);
      setLive(null);
      if (limit) setTimeout(() => showDailyLimit("start", mode), 400);
      return;
    }
    const save = async () => {
      try {
        const id = await saveRecording({
          segments: result.segments, seconds: result.seconds, mode, folderId,
          targetCode: codeOf(translate.target) ?? undefined, createdAt: session.startedAt,
          how: limit ? "limit" : undefined,
          extra: result.creditsCutAt !== null
            ? { captions_paused_seconds: result.seconds - result.creditsCutAt, captions_unlocked: result.unlocked }
            : undefined,
        });
        capture("caption_session_ended", session.stats("saved"));
        session.clearDraft();
        keepRest(id, session, result);
        setLive(null);
        setRoute(r => ({ ...r, recordingId: id, settings: null, ...(folderId ? {} : { tab: "all" as HomeTab, folderId: null }) }));
        setPane("recording");
        const cut = result.creditsCutAt !== null && !isPlusNow();
        if (limit) {
          // Stopped by the free credits: the card over the saved recording,
          // no folder question or rating.
          setTimeout(() => showDailyLimit("saved", mode), 400);
          markInviteDue("saved_recording", (library?.recordings ?? []).filter(r => !isStarterRecording(r.id)).length + 1);
          return;
        }
        if (!isPlusNow()) {
          // Captions stopped at the free credits: the plans right away (unless
          // just seen over the sheet); used up otherwise: the card.
          if (cut) {
            if (!paywallSeenInSession.current) setTimeout(() => openPaywall("captions_cut"), 400);
          } else if (freeSecondsLeft() <= 0) setTimeout(() => showDailyLimit("saved", mode), 400);
        }
        afterLiveSave(id, folderId, lastSavedText.current, cut);
      } catch (e) {
        // Nothing lost: the finished lines are the next visit's to save too.
        session.keepDraft(result);
        showErrorAlert({ where: "live_save", error: e, title: "Recording not saved yet", body: "Check your connection and try again. Nothing is lost while this page stays open.", retry: save });
      }
    };
    await save();
  };

  const deleteLive = async () => {
    if (!live) return;
    const snap = live.session.snap;
    if (snap.hasText && !(await confirmCard({ title: "Delete recording?", body: "This cannot be undone.", confirm: "Delete", destructive: true }))) return;
    capture("caption_session_ended", live.session.stats("deleted"));
    live.session.discard();
    void removeSessionAudio(live.session.audioId);
    setLive(null);
  };

  // The hourly save into a shared folder: this hour becomes a recording and
  // the session carries on as the next one.
  const rollingOver = useRef(false);
  useEffect(() => {
    if (!live || !live.folderId) return;
    const members = new Set((library?.people ?? []).filter(p => p.folderId === live.folderId).map(p => p.userId)).size;
    if (members < 2) return;
    const hour = hourlySeconds();
    let partStart = 0;
    const off = live.session.subscribe(() => {
      const snap = live.session.snap;
      if (rollingOver.current || snap.phase === "saving" || snap.seconds - partStart < hour) return;
      rollingOver.current = true;
      partStart = snap.seconds;
      const { session, mode, folderId } = live;
      void session.rollover().then(async result => {
        if (!result.segments.length && !result.gaps.length) return;
        try {
          const id = await saveRecording({
            segments: result.segments, seconds: result.seconds, mode, folderId,
            targetCode: codeOf(translate.target) ?? undefined, createdAt: Date.now() - result.seconds * 1000, how: "hourly",
          });
          keepRest(id, session, result);
        } catch (e) {
          recordError("live_hourly_save", e);
        }
      }).finally(() => { rollingOver.current = false; });
    });
    return () => { off(); };
  }, [live, library?.people, saveRecording, translate.target]);

  // The paywall over the sheet counts as seen for this session.
  const paywallSeenInSession = useRef(false);
  useEffect(() => {
    if (live && paywall.open) paywallSeenInSession.current = true;
    if (!live) paywallSeenInSession.current = false;
  }, [live, paywall.open]);

  const startUpload = () => {
    const folderId = route.tab === "folders" && folder && folder.id !== WELCOME_FOLDER.id ? folder.id : null;
    openUpload({ folderId });
  };

  // The owl's start bubble: until a recording of their own was started here,
  // and whenever the list has nothing of theirs (app: StartHint).
  const ownRecordings = (library?.recordings ?? []).filter(r => !isStarterRecording(r.id) && r.status !== "transcribing");
  const showHint = !!library && route.tab === "all" && !query && ownRecordings.length === 0;
  // A phone-wide window: the chip shows just the 🎁 next to PLUS.
  const narrowBand = typeof window !== "undefined" && window.innerWidth < 360 && !plus.isPlus;

  return (
    <div className="capp" data-pane={pane}>
      {/* Home's band: the wordmark, and the gear on the right. */}
      <header className="band">
        <button type="button" className="logo" onClick={() => { go({ settings: null }); setPane("list"); }} aria-label="Captio AI">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/web-app/logo-text.png" alt="Captio AI" />
        </button>
        <span style={{ flex: 1 }} />
        <InviteChip still={showHint} compact={narrowBand} />
        {plus.known && !plus.isPlus && (
          <button type="button" className="plus-badge band-plus" onClick={() => openPaywall("home_pro_button")}>
            <span className="ui-sheen" aria-hidden />
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path fill="#000" d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01L12 2z" /></svg>
            <span>PLUS</span>
          </button>
        )}
        <button
          type="button" className="band-btn" aria-label="Settings" aria-pressed={!!route.settings}
          onClick={() => go({ settings: route.settings ? null : "main" })}
        >
          <SettingsIcon size={24} color="#FFFFFF" />
        </button>
      </header>
      <div className="card">
        {route.settings ? (
          <SettingsView
            account={account}
            page={route.settings}
            onPage={page => go({ settings: page })}
            onBack={() => go({ settings: null })}
            onSignOut={onSignOut}
            supabase={getSupabase}
          />
        ) : (
          <>
            <HomeColumn
              tab={route.tab}
              onTab={setTab}
              folder={folder}
              onFolder={openFolder}
              library={library}
              recordings={recordings}
              selectedId={selected?.id ?? null}
              query={query}
              onQuery={setQuery}
              onOpen={open}
              error={state.status === "error"}
              onRetry={load}
              me={account.userId}
              offline={!online}
              dock={
                <Dock
                  onRecord={() => startLive("captions")}
                  onTranslate={() => startLive("translation")}
                  onUpload={startUpload}
                  showHint={showHint}
                  isPlus={plus.isPlus}
                  attract={!startedHere}
                />
              }
            />
            <RecordingView
              key={selected?.id ?? "none"}
              recording={selected as Recording | null}
              library={library}
              me={account.userId}
              preview={!!account.preview}
              supabase={getSupabase}
              emptyLibrary={!!library && library.recordings.length === 0}
              onBack={backToList}
            />
          </>
        )}
      </div>
      {live && (
        <CaptionsSheet
          session={live.session}
          translate={translate}
          onTranslate={changeTranslate}
          onSave={() => { void finishLive(); }}
          onDelete={deleteLive}
          isPlus={plus.isPlus}
        />
      )}
      <Paywall />
      <InvitePage />
      <CardHost />
    </div>
  );
}
