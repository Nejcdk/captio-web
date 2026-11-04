"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { capture, errorCode, store } from "./client";
import { XIcon } from "./Icons";

// The app's shared building blocks (app repo: src/components/ui/, DESIGN.md
// §5) for the web: Button (primary, gold, secondary), QuietButton, Banner,
// PlusCard, IslandButton, DockButton, CloseButton, ModalCard, and the
// pop-ups the app shows with Alert/ModalCard: showCard, confirmCard,
// ensureAiConsent, showErrorAlert. Styles in app.css (".ui-…").

// ─── Buttons ──────────────────────────────────────────────────────────────────

export function Button({ label, onPress, variant = "primary", size = "large", disabled, loading, icon, style }: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "gold" | "secondary";
  size?: "large" | "compact";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`ui-btn ${variant} ${size}`}
      onClick={onPress}
      disabled={disabled || loading}
      style={style}
    >
      {variant === "gold" && <span className="ui-sheen" aria-hidden />}
      {variant === "gold" && !icon && <StarGlyph />}
      {icon}
      <span>{loading ? "Please wait…" : label}</span>
    </button>
  );
}

function StarGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#000" d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function QuietButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <button type="button" className="ui-quiet" onClick={onPress}>{label}</button>;
}

export function CloseButton({ onPress, label = "Close", style }: { onPress: () => void; label?: string; style?: CSSProperties }) {
  return (
    <button type="button" className="ui-close" onClick={onPress} aria-label={label} style={style}>
      <XIcon size={22} color="#1C2A5E" />
    </button>
  );
}

// The signature control: a white frame with a 2.5 outline around a filled
// square (record 106/84, stop 92/72). `attract` = the red pulse in the gap.
const ISLAND = {
  record: { outer: 106, outerRadius: 24, border: 2.5, inner: 84, innerRadius: 12 },
  stop: { outer: 92, outerRadius: 22, border: 2.5, inner: 72, innerRadius: 12 },
  play: { outer: 72, outerRadius: 20, border: 2.5, inner: 56, innerRadius: 14 },
} as const;

export function IslandButton({ size = "record", color = "#1C49F5", onPress, attract, sheen, label, children, disabled }: {
  size?: keyof typeof ISLAND; color?: string; onPress: () => void; attract?: boolean; sheen?: boolean;
  label: string; children: ReactNode; disabled?: boolean;
}) {
  const d = ISLAND[size];
  return (
    <button
      type="button"
      className="ui-island"
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
      style={{ width: d.outer, height: d.outer, borderRadius: d.outerRadius, borderWidth: d.border }}
    >
      {attract && <span className="ui-island-attract" style={{ borderRadius: d.outerRadius - d.border, borderWidth: (d.outer - 2 * d.border - d.inner) / 2 }} aria-hidden />}
      <span className="ui-island-square" style={{ width: d.inner, height: d.inner, borderRadius: d.innerRadius, background: color }}>
        {sheen && <span className="ui-sheen slow" aria-hidden />}
        {children}
      </span>
    </button>
  );
}

// The outlined square beside an island: dock (64, Home) or control (54).
export function DockButton({ size = "dock", onPress, label, children, disabled, active }: {
  size?: "dock" | "control"; onPress: () => void; label: string; children: ReactNode; disabled?: boolean; active?: boolean;
}) {
  return (
    <button type="button" className={`ui-dock ${size}${active ? " active" : ""}`} onClick={onPress} aria-label={label} title={label} disabled={disabled}>
      {children}
    </button>
  );
}

// ─── Notices ──────────────────────────────────────────────────────────────────

export function Banner({ tone, text, action, style }: {
  tone: "warn" | "error" | "info"; text: string; action?: { label: string; onPress: () => void }; style?: CSSProperties;
}) {
  return (
    <div className={`ui-banner ${tone}`} role={tone === "error" ? "alert" : "status"} style={style}>
      <span>{text}</span>
      {action && <button type="button" onClick={action.onPress}>{action.label}</button>}
    </div>
  );
}

// What the free credits stopped + Plus: white card, 2pt outline, a gold Get
// Plus (a plain primary for someone with Plus).
export function PlusCard({ title, body, cta = "Get Plus", onPress, upgrade = true, style }: {
  title?: string; body: string; cta?: string; onPress?: () => void; upgrade?: boolean; style?: CSSProperties;
}) {
  return (
    <div className="ui-plus-card" style={style}>
      {title && <div className="title">{title}</div>}
      <p>{body}</p>
      {onPress && <Button label={cta} onPress={onPress} variant={upgrade ? "gold" : "primary"} size="compact" />}
    </div>
  );
}

// ─── Cards over the dimmed screen (the app's ModalCard) ───────────────────────

export function ModalCard({ owl, art, title, body, children, onClose, wide }: {
  owl?: string; art?: ReactNode; title?: string; body?: ReactNode; children?: ReactNode; onClose?: () => void; wide?: boolean;
}) {
  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="ui-scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`ui-card${wide ? " wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {owl && <img className="ui-card-owl" src={`/web-app/${owl}.png`} alt="" />}
        {art && <div className="ui-card-art">{art}</div>}
        {title && <h2 className="ui-card-title">{title}</h2>}
        {body && <div className="ui-card-body">{body}</div>}
        {children}
      </div>
    </div>
  );
}

// One card at a time, from anywhere (the app's Alert.alert and ModalCards).
type Card = { id: number; render: (close: () => void) => ReactNode };
let cards: Card[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

function removeCard(id: number) {
  cards = cards.filter(c => c.id !== id);
  emit();
}

export function showCard(render: (close: () => void) => ReactNode): () => void {
  const id = nextId++;
  const close = () => removeCard(id);
  cards = [...cards, { id, render }];
  emit();
  return close;
}

export function isCardOpen() {
  return cards.length > 0;
}

export function CardHost() {
  const list = useSyncExternalStore(
    l => { listeners.add(l); return () => listeners.delete(l); },
    () => cards,
    () => cards,
  );
  const top = list[list.length - 1];
  if (!top) return null;
  return <>{top.render(() => removeCard(top.id))}</>;
}

// The app's confirm alert: a question, one line, Cancel and the verb.
export function confirmCard({ title, body, confirm, destructive }: {
  title: string; body?: string; confirm: string; destructive?: boolean;
}): Promise<boolean> {
  return new Promise(resolve => {
    showCard(close => (
      <ModalCard title={title} body={body} onClose={() => { close(); resolve(false); }}>
        <div className="ui-card-actions">
          <Button label="Cancel" variant="secondary" size="compact" onPress={() => { close(); resolve(false); }} />
          <Button
            label={confirm}
            size="compact"
            onPress={() => { close(); resolve(true); }}
            style={destructive ? { background: "var(--fill)", color: "var(--destructive)" } : undefined}
          />
        </div>
      </ModalCard>
    ));
  });
}

// ─── AI-processing consent (app: lib/consent.ts) ──────────────────────────────

const CONSENT_KEY = "captio_ai_processing_consent";

export function hasAiConsent(): boolean {
  return store.get<boolean>(CONSENT_KEY, false);
}

// Asked the first time anything would leave the computer for a third-party
// AI: live captions, translation, uploads, the Actions tab. Word for word the
// app's alert.
export function ensureAiConsent(where?: string): Promise<boolean> {
  if (hasAiConsent()) return Promise.resolve(true);
  return new Promise(resolve => {
    showCard(close => (
      <ModalCard
        title="Allow AI processing?"
        body="To make captions and translations, your audio is sent to a third-party speech-recognition provider (Soniox). To make titles, summaries and notes, the transcript text is sent to a third-party AI provider (Google Gemini). Your content is never used to train AI models."
        onClose={() => { close(); capture("ai_consent", { result: "declined", where }); resolve(false); }}
      >
        <Button
          label="Agree & Continue"
          size="compact"
          onPress={() => {
            store.set(CONSENT_KEY, true);
            capture("ai_consent", { result: "agreed", where });
            close();
            resolve(true);
          }}
        />
        <div className="ui-card-row">
          <QuietButton label="Not now" onPress={() => { close(); capture("ai_consent", { result: "declined", where }); resolve(false); }} />
          <a className="ui-quiet" href="/privacy" target="_blank" rel="noopener" onClick={() => capture("ai_consent", { result: "privacy_policy", where })}>Privacy Policy</a>
        </div>
      </ModalCard>
    ));
  });
}

// ─── User-facing errors (app: lib/errorReport.ts) ─────────────────────────────

// Records app_error with a 6-character code, shows the code, and offers
// Report problem (the user's words go out as error_report).
export function showErrorAlert({ where, error, title = "Something went wrong", body = "Sorry about that. Please try again in a moment.", retry }: {
  where: string; error?: unknown; title?: string; body?: string; retry?: () => void;
}) {
  const code = errorCode();
  capture("app_error", { where, error_code: code, message: String((error as Error)?.message ?? error ?? "").slice(0, 200) });
  const message = String((error as Error)?.message ?? error ?? "").slice(0, 200);
  showCard(close => <ErrorCard code={code} where={where} message={message} title={title} body={body} retry={retry} close={close} />);
}

function ErrorCard({ code, where, message, title, body, retry, close }: {
  code: string; where: string; message: string; title: string; body: string; retry?: () => void; close: () => void;
}) {
  const [reporting, setReporting] = useState(false);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <ModalCard title="Thanks for telling us" body="Your report went straight to the team. We'll look into it." onClose={close}>
        <Button label="Close" size="compact" onPress={close} />
      </ModalCard>
    );
  }
  if (reporting) {
    return (
      <ModalCard
        title="What happened?"
        body="Tell us what you were doing when it went wrong. We read every report and use it to fix things."
        onClose={close}
      >
        <textarea className="input" rows={4} autoFocus value={text} onChange={e => setText(e.target.value)} aria-label="What happened?" />
        <Button
          label="Send"
          size="compact"
          disabled={!text.trim()}
          style={{ marginTop: 12 }}
          onPress={() => { capture("error_report", { where, error_code: code, error_message: message, report: text.trim().slice(0, 1000) }); setSent(true); }}
        />
        <QuietButton label="Cancel" onPress={close} />
      </ModalCard>
    );
  }
  return (
    <ModalCard title={title} body={<>{body}<span className="ui-code">Error code: {code}</span></>} onClose={close}>
      {retry
        ? <Button label="Try again" size="compact" onPress={() => { close(); retry(); }} />
        : <Button label="Close" size="compact" onPress={close} />}
      <QuietButton label="Report problem" onPress={() => { capture("error_report_opened", { where, error_code: code }); setReporting(true); }} />
    </ModalCard>
  );
}
