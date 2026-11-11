"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./export.css";
import { capture, getSupabase, isPreview, isGuest, needsAccount } from "./client";
import type { Recording, RecordingBody } from "./data";
import type { SpeakerTag } from "./format";
import { plusForSale, usePlus } from "./plus";
import { openPaywall } from "./paywallStore";
import { showFreeUsedUp } from "./limitCard";
import { Button, ModalCard, showCard, showErrorAlert } from "./ui";
import { CheckIcon, ChevronLeftIcon, CopyIcon, MailIcon, ShareIcon } from "./Icons";
import { actionBlocks, actionContent, makeActionForExport } from "./ActionsTab";
import type { ActionKind } from "./actionPrompts";
import { locale, t } from "./i18n";
import { FREE_SUMMARY_EXPORT_LIMIT, getFreeSummaryExportsUsed, incrementFreeSummaryExportsUsed } from "./usage";
import {
  actionLabel, chatPrompt, chatUrl, emailSubject, emailText, exportBody, gmailUrl, hasExportable, mailtoUrl, outlookUrl,
  pdfHtml, printPdf, shareLink, type ExportSource, type ExportTarget, type ExportWhat,
} from "./exportRecording";

// The Export sheet (app repo: src/screens/ExportSheetScreen.tsx), opened by
// the big Export button on a recording: two halves, CAPTIONS and the action
// it was opened from (SUMMARY when opened from the captions), each with the
// same five ways out, every way with its own colour. From an action's page,
// only that action. A result that doesn't exist yet is made first (kept on
// the Actions tab). Each way ends in the browser's own step: the share sheet
// or the clipboard (with a visible Copied), Save as PDF, the mail app, the
// chat app; the sheet closes once something went out.

// Labels are keys, read while drawing (t() never runs at import time).
const WAYS: { way: ExportTarget; label: string; color: string; icon: (c: string) => ReactNode }[] = [
  { way: "text", label: "export.text", color: "#1C49F5", icon: c => <Tabler color={c} paths={["M4 6h16", "M4 12h16", "M4 18h10"]} /> },
  { way: "link", label: "export.link", color: "#007B83", icon: c => <Tabler color={c} paths={["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]} /> },
  { way: "pdf", label: "export.pdf", color: "#D93025", icon: c => <Tabler color={c} paths={["M9 2h6s1 0 1 1v2s0 1 -1 1H9S8 6 8 5V3s0 -1 1 -1", "M10.4 12.6a2 2 0 0 1 3 3L8 21l-4 1 1 -4Z", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-5.5", "M4 13.5V6a2 2 0 0 1 2 -2h2"]} /> },
  { way: "email", label: "export.email", color: "#E37400", icon: c => <MailIcon size={22} color={c} /> },
  { way: "chat", label: "export.chat", color: "#8430CE", icon: c => <Tabler color={c} paths={["M12 8V4H8", "M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2z", "M2 14h2", "M20 14h2", "M15 13v2", "M9 13v2"]} /> },
];

function Tabler({ color, paths }: { color: string; paths: string[] }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map(d => <path key={d} d={d} />)}
    </svg>
  );
}

// The app's one exception button (DESIGN.md §5): 64 high, radius 18, the
// blue glow. Pinned to the bottom of the recording while it scrolls.
export function ExportButton({ onPress }: { onPress: () => void }) {
  return (
    <div className="exp-dock">
      <button type="button" className="exp-btn" onClick={onPress}>
        <ShareIcon size={24} color="#FFFFFF" />
        <span>{t("export.button")}</span>
      </button>
    </div>
  );
}

type OpenOptions = { rec: Recording; body: RecordingBody; tags: SpeakerTag[]; action?: ActionKind | null; from?: string };

export function openExport({ rec, body, tags, action = null, from }: OpenOptions) {
  showCard(close => (
    <ExportSheet rec={rec} body={body} tags={tags} action={action} from={from ?? (action ? "action" : "captions")} onClose={close} />
  ));
}

type View =
  | { kind: "main" }
  | { kind: "link"; what: ExportWhat; url: string; copied: boolean }
  | { kind: "email"; what: ExportWhat; subject: string; body: string }
  | { kind: "chat"; what: ExportWhat; prompt: string; copied: boolean };

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// The signed-in name, to sign the email ("Best regards, <name>").
async function userName(): Promise<string> {
  if (isPreview()) return "";
  const { data } = await getSupabase().auth.getSession();
  const meta = (data.session?.user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  return (meta.full_name || meta.name || "").trim();
}

function ExportSheet({ rec, body, tags, action, from, onClose }: {
  rec: Recording; body: RecordingBody; tags: SpeakerTag[]; action: ActionKind | null; from: string; onClose: () => void;
}) {
  const { isPlus } = usePlus();
  // The second half (or the only one): the action on screen, else the summary.
  const second: ActionKind = action ?? "summary";
  const src: ExportSource = { rec, body, tags, content: kind => actionContent(rec, body, kind) };
  const [busy, setBusy] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [view, setView] = useState<View>({ kind: "main" });
  const sent = useRef(false);

  // Opened, and whether anything went out before it closed.
  useEffect(() => {
    capture("export_sheet_opened", { from, what: action ? action : "captions+summary", recording_kind: "unknown" });
    return () => capture("export_sheet_closed", { from, exported: sent.current });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Each way and half counts once per sheet against the free plan's summary
  // exports (a link copied, then shared, is one export).
  const counted = useRef(new Set<string>());
  const exported = (as: ExportTarget, what: ExportWhat, completed: boolean, extra: Record<string, unknown> = {}) => {
    capture("recording_exported", { as, what, kind: "unknown", completed, from, ...extra });
    if (!completed) return;
    sent.current = true;
    const k = `${as}:${what}`;
    if (what !== "captions" && !isPlus && !counted.current.has(k)) {
      counted.current.add(k);
      incrementFreeSummaryExportsUsed();
    }
  };

  const fail = (as: ExportTarget, what: ExportWhat, e: unknown) => {
    capture("export_failed", { as, what, kind: "unknown", from });
    showErrorAlert({ where: `export_${as}`, error: e, title: t("export.failedTitle") });
  };

  // "Copied" on the tile for a moment, then the sheet goes.
  const flashThenClose = (key: string) => {
    setDone(key);
    setTimeout(onClose, 1100);
  };

  const send = async (what: ExportWhat, way: ExportTarget) => {
    if (busy) return;
    // Free plan: a few summary exports to try, then Plus (checked before a
    // summary would be made for it).
    if (what !== "captions" && !isPlus && getFreeSummaryExportsUsed() >= FREE_SUMMARY_EXPORT_LIMIT) {
      capture("summary_export_gated", { as: way, what });
      onClose();
      if (!plusForSale()) showFreeUsedUp(t("web.export.freeExportsUsed"), "summary_export_gate");
      else openPaywall("summary_export_gate");
      return;
    }
    // A link is saved to the account.
    if (way === "link" && isGuest()) {
      onClose();
      needsAccount("export_link");
      return;
    }
    if (way === "link" && isPreview()) {
      capture("action_blocked", { action: "export_link", reason: "signed_out" });
      showErrorAlert({ where: "export_link", title: t("export.failedTitle"), body: t("web.export.signInForLink") });
      return;
    }
    const key = `${what}:${way}`;
    setBusy(key);
    // Not made yet: made first, the same way as on the Actions tab.
    if (what !== "captions" && !hasExportable(src, what)) {
      setSummarizing(true);
      const made = await makeActionForExport(rec, body, tags, what, isPlus);
      setSummarizing(false);
      if (!made.length) {
        setBusy(null);
        if (actionBlocks(rec, body, what)[0]?.type === "insufficient_context") {
          showCard(close => (
            <ModalCard title={t("detail.notEnoughContext")} body={t("detail.notEnoughContextBody")} onClose={close}>
              <Button label={t("common.close")} size="compact" onPress={close} />
            </ModalCard>
          ));
        }
        return;
      }
    }
    try {
      if (way === "text") {
        const text = exportBody(src, what);
        if (navigator.share) {
          try {
            await navigator.share({ text });
            setBusy(null);
            exported("text", what, true, { via: "share" });
            onClose();
          } catch (e) {
            setBusy(null);
            if ((e as DOMException)?.name === "AbortError") { exported("text", what, false, { via: "share" }); return; }
            // The share sheet isn't allowed here: the clipboard.
            const ok = await copyText(text);
            exported("text", what, ok, { via: "copy" });
            if (ok) flashThenClose(key);
          }
          return;
        }
        const ok = await copyText(text);
        setBusy(null);
        if (!ok) throw new Error("clipboard refused");
        exported("text", what, true, { via: "copy" });
        flashThenClose(key);
      } else if (way === "link") {
        const url = await shareLink(src, what);
        const copied = await copyText(url);
        setBusy(null);
        exported("link", what, copied, { via: "copy" });
        setView({ kind: "link", what, url, copied });
      } else if (way === "pdf") {
        await printPdf(pdfHtml(src, what, window.location.origin));
        setBusy(null);
        // The browser can't say whether it was saved: a shown dialog counts.
        exported("pdf", what, true);
        onClose();
      } else if (way === "email") {
        const subject = emailSubject(rec, what);
        const text = emailText(src, what, await userName());
        setBusy(null);
        setView({ kind: "email", what, subject, body: text });
      } else {
        const prompt = chatPrompt(src, what);
        const copied = await copyText(prompt);
        setBusy(null);
        if (copied) exported("chat", what, true, { via: "copy" });
        setView({ kind: "chat", what, prompt, copied });
      }
    } catch (e) {
      setBusy(null);
      fail(way, what, e);
    }
  };

  const back = <button type="button" className="exp-back" onClick={() => setView({ kind: "main" })}><ChevronLeftIcon size={16} />{t("common.back")}</button>;

  if (view.kind === "link") {
    return (
      <ModalCard onClose={onClose} wide>
        <div className="exp-sub">
          <div className="exp-sub-head">{back}<span className="exp-sub-title">{view.copied ? t("web.export.linkCopied") : t("web.export.yourLink")}</span></div>
          <p className="exp-sub-body">{t("web.export.linkBody")}</p>
          <button
            type="button"
            className="exp-address"
            onClick={async () => {
              const ok = await copyText(view.url);
              if (ok) { if (!view.copied) exported("link", view.what, true, { via: "copy" }); setView({ ...view, copied: true }); }
            }}
          >
            <span>{view.url.replace(/^https:\/\//, "")}</span>
            {view.copied ? <CheckIcon size={20} color="#007B83" /> : <CopyIcon size={20} color="#007B83" />}
          </button>
          <div className="exp-sub-actions">
            {typeof navigator !== "undefined" && "share" in navigator && (
              <Button
                label={t("web.export.share")}
                variant="secondary"
                size="compact"
                onPress={async () => {
                  try { await navigator.share({ url: view.url, title: `${rec.emoji} ${rec.title}` }); exported("link", view.what, true, { via: "share" }); onClose(); } catch { /* closed */ }
                }}
              />
            )}
            <Button label={t("web.export.openLink")} size="compact" onPress={() => { window.open(view.url, "_blank", "noopener"); onClose(); }} />
          </div>
        </div>
      </ModalCard>
    );
  }

  if (view.kind === "email") {
    const go = async (via: "mail_app" | "gmail" | "outlook") => {
      // The whole email on the clipboard too, in case a mail app cuts it short.
      await copyText(view.body);
      exported("email", view.what, true, { via });
      if (via === "mail_app") window.location.assign(mailtoUrl(view.subject, view.body));
      else window.open(via === "gmail" ? gmailUrl(view.subject, view.body) : outlookUrl(view.subject, view.body), "_blank", "noopener");
      onClose();
    };
    return (
      <ModalCard onClose={onClose} wide>
        <div className="exp-sub">
          <div className="exp-sub-head">{back}<span className="exp-sub-title">{t("web.export.sendByEmail")}</span></div>
          <p className="exp-sub-body">{view.subject}</p>
          <div className="exp-options">
            <button type="button" className="exp-tile" onClick={() => go("mail_app")}>
              <MailIcon size={22} color="#E37400" /><span>{t("web.export.mailApp")}</span>
            </button>
            <button type="button" className="exp-tile" onClick={() => go("gmail")}>
              <GmailMark /><span>Gmail</span>
            </button>
            <button type="button" className="exp-tile" onClick={() => go("outlook")}>
              <OutlookMark /><span>Outlook</span>
            </button>
          </div>
          <p className="exp-note">{t("web.export.emailCopiedNote")}</p>
        </div>
      </ModalCard>
    );
  }

  if (view.kind === "chat") {
    const openIn = (app: "chatgpt" | "claude") => {
      const { url, prefilled } = chatUrl(app, view.prompt);
      if (!view.copied) copyText(view.prompt);
      exported("chat", view.what, true, { via: app, prefilled });
      window.open(url, "_blank", "noopener");
      onClose();
    };
    return (
      <ModalCard onClose={onClose} wide>
        <div className="exp-sub">
          <div className="exp-sub-head">{back}<span className="exp-sub-title">{view.copied ? t("web.export.promptCopied") : t("web.export.askChat")}</span></div>
          <p className="exp-sub-body">
            {view.prompt.length > 6000
              ? t("web.export.chatPaste")
              : t("web.export.chatReady")}
          </p>
          <div className="exp-options">
            <button type="button" className="exp-tile" onClick={() => openIn("chatgpt")}>
              <ChatGPTMark /><span>{t("web.export.openInChatGPT")}</span>
            </button>
            <button type="button" className="exp-tile" onClick={() => openIn("claude")}>
              <ClaudeMark /><span>{t("web.export.openInClaude")}</span>
            </button>
            <button
              type="button"
              className="exp-tile"
              onClick={async () => {
                const ok = await copyText(view.prompt);
                if (ok) { setView({ ...view, copied: true }); if (!view.copied) exported("chat", view.what, true, { via: "copy" }); }
              }}
            >
              {view.copied ? <CheckIcon size={22} color="#8430CE" /> : <CopyIcon size={22} color="#8430CE" />}
              <span>{view.copied ? t("export.copied") : t("web.export.copyPrompt")}</span>
            </button>
          </div>
        </div>
      </ModalCard>
    );
  }

  return (
    <ModalCard onClose={onClose} wide>
      <div className="exp-sheet">
        <div className="exp-top">
          <button type="button" className="ui-close" onClick={onClose} aria-label={t("common.close")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C2A5E" strokeWidth={2} strokeLinecap="round" aria-hidden><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
        <div className={`exp-halves${action ? " single" : ""}`}>
          {!action && <Half what="captions" title={t("detail.tabCaptions")} busy={busy} done={done} summarizing={summarizing} onSend={send} />}
          {!action && <div className="exp-split" />}
          <Half what={second} title={actionLabel(second)} busy={busy} done={done} summarizing={summarizing} onSend={send} />
        </div>
      </div>
    </ModalCard>
  );
}

// One half of the sheet: its title and the five ways.
function Half({ what, title, busy, done, summarizing, onSend }: {
  what: ExportWhat; title: string; busy: string | null; done: string | null; summarizing: boolean;
  onSend: (what: ExportWhat, way: ExportTarget) => void;
}) {
  return (
    <div className="exp-half">
      <div className="exp-half-title">{title.toLocaleUpperCase(locale())}</div>
      {/* Making the action: a bar under the title, in the gap above the buttons. */}
      {what !== "captions" && summarizing && <div className="loading-bar exp-bar" />}
      {WAYS.map(({ way, label, color, icon }) => {
        const key = `${what}:${way}`;
        const working = busy === key;
        const isDone = done === key;
        return (
          <button key={way} type="button" className="exp-tile" disabled={!!busy && !working} onClick={() => onSend(what, way)}>
            {working
              ? <span className="exp-spinner" style={{ borderTopColor: color }} aria-label={t("web.actions.working")} />
              : isDone ? <CheckIcon size={22} color={color} /> : icon(color)}
            <span>{isDone ? t("export.copied") : t(label)}</span>
          </button>
        );
      })}
    </div>
  );
}

// Other apps' own marks, in their own colours, only to say where it goes
// (DESIGN.md §6).
function GmailMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M2 6.5v11A1.5 1.5 0 0 0 3.5 19H6V10l-4-3.5Z" />
      <path fill="#34A853" d="M18 19h2.5a1.5 1.5 0 0 0 1.5-1.5v-11L18 10Z" />
      <path fill="#FBBC04" d="M18 5.5V10l4-3.5V6a1.5 1.5 0 0 0-2.4-1.2Z" />
      <path fill="#EA4335" d="M6 10V5.5l6 4.5 6-4.5V10l-6 4.5Z" />
      <path fill="#C5221F" d="M2 6v.5L6 10V5.5L4.4 4.8A1.5 1.5 0 0 0 2 6Z" />
    </svg>
  );
}

function OutlookMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <rect x="9" y="5" width="13" height="14" rx="2" fill="#28A8EA" />
      <rect x="2" y="7" width="11" height="10" rx="2" fill="#0078D4" />
      <ellipse cx="7.5" cy="12" rx="2.6" ry="3" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
    </svg>
  );
}

function ChatGPTMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="#0D0D0D" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ClaudeMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="#D97757" d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  );
}
