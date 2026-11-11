import { useEffect, useState, type ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import "./paywall.css";
import type { Account } from "./DesktopApp";
import { capture, needsAccount, recordError } from "./client";
import { manageSubscriptionUrl } from "./Paywall";
import { openPaywall } from "./paywallStore";
import { InviteSettingsNote } from "./InviteChip";
import { MicrophonePage } from "./MicrophonePage";
import { isPlusNow, plusForSale, usePlus } from "./plus";
import { promptInstall, useCanInstall } from "./install";
import { Button, confirmCard, showErrorAlert } from "./ui";
import { FREE_DAILY_CREDITS, creditsRemaining } from "./usage";
import { LANGUAGES, updateSettings, useSettings } from "./settings";
import {
  BugIcon, ChevronLeftIcon, ChevronRightIcon, CopyCheckIcon, CopyIcon, DiscordLogo, FileTextIcon, LanguagesIcon,
  DesktopIcon, LightbulbIcon, LogOutIcon, MailIcon, MicrophoneIcon, PhoneIcon, PuzzleIcon, SearchIcon, ShareIcon, ShieldIcon, StarIcon, TrashIcon,
  UsersIcon, XIcon,
} from "./Icons";

// Settings, as on the phone (app repo: src/screens/SettingsScreen.tsx and the
// pages it opens): the same sections, rows and words. What only a phone can
// do (Recognize voices and sounds, speaker direction, widgets, onboarding) is
// left out, as the app leaves it out on phones that can't. A row's page opens
// in place, with "‹ Settings" to go back.

export type SettingsPage = "main" | "language-hints" | "context" | "microphone" | "connectors" | "bug" | "feature";

const SUPPORT_EMAIL = "hello@captioai.app";
const DISCORD_URL = "https://discord.gg/qPmNS7kKNA";
const STORE_URL = "https://apps.apple.com/app/id6796617180";
const RATE_APP_URL = "https://apps.apple.com/app/id6796617180?action=write-review";
const CONNECTOR_URL = "https://captioai.app/mcp";

function Row({ icon, label, onClick, href, trailing, destructive, chevron = true, onOpen }: {
  icon: ReactNode; label: ReactNode; onClick?: () => void; href?: string; trailing?: ReactNode; destructive?: boolean; chevron?: boolean;
  onOpen?: () => void; // a link row: what to track when it's opened
}) {
  const inner = (
    <>
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
      {trailing}
      {chevron && (href || onClick) && !trailing && <span className="chev"><ChevronRightIcon size={15} /></span>}
    </>
  );
  const cls = `group-row${destructive ? " destructive" : ""}`;
  if (href) return <a className={cls} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener" onClick={onOpen}>{inner}</a>;
  if (onClick) return <button type="button" className={cls} onClick={onClick}>{inner}</button>;
  return <div className={cls}>{inner}</div>;
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="switch" onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export function SettingsView({ account, page, onPage, onBack, onSignOut, supabase }: {
  account: Account;
  page: SettingsPage;
  onPage: (p: SettingsPage) => void;
  onBack: () => void;
  onSignOut: () => void;
  supabase: () => SupabaseClient;
}) {
  const { isPlus } = usePlus();
  useEffect(() => {
    if (page === "main") capture("settings_opened", { is_plus: isPlus, signed_in: !account.guest });
    else if (page === "microphone") capture("mic_settings_opened");
    else if (page === "connectors") capture("connect_chats_viewed", { signed_in: true });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps
  if (page !== "main") {
    const back = () => onPage("main");
    switch (page) {
      case "language-hints": return <LanguageHints onBack={back} />;
      case "context": return <ContextWindow onBack={back} account={account} />;
      case "microphone": return <MicrophonePage onBack={back} />;
      case "connectors": return <Connectors onBack={back} />;
      case "bug": case "feature": return <Report key={page} kind={page} onBack={back} />;
    }
  }
  return <SettingsMain account={account} onPage={onPage} onBack={onBack} onSignOut={onSignOut} supabase={supabase} />;
}

function SettingsMain({ account, onPage, onBack, onSignOut, supabase }: {
  account: Account; onPage: (p: SettingsPage) => void; onBack: () => void; onSignOut: () => void; supabase: () => SupabaseClient;
}) {
  const { separateSpeakers } = useSettings();
  const { isPlus, known: plusKnown } = usePlus();
  const [shared, setShared] = useState(false);
  const canInstall = useCanInstall();
  const [deleting, setDeleting] = useState<"no" | "busy">("no");

  const shareApp = async () => {
    const text = `Captio AI: live captions, transcription and translation. ${STORE_URL}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1500);
      }
      capture("settings_app_shared");
    } catch (e) {
      // Closing the share sheet isn't an error.
      if ((e as DOMException)?.name !== "AbortError") recordError("app_share", e);
    }
  };

  const deleteAccount = async () => {
    if (!(await confirmCard({
      title: "Delete account?",
      body: "This permanently deletes your account, along with all your recordings and data. This cannot be undone.",
      confirm: "Delete",
      destructive: true,
    }))) return;
    setDeleting("busy");
    if (account.preview) { onSignOut(); return; }
    const { error } = await supabase().rpc("delete_user");
    if (error) {
      setDeleting("no");
      showErrorAlert({ where: "account_delete", error, title: "Could not delete account", body: "Something went wrong. Please check your connection and try again." });
      return;
    }
    capture("account_deleted", { is_plus: isPlus });
    onSignOut();
  };

  return (
    <main className="settings">
      <div className="inner">
        <div className="settings-head">
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back"><ChevronLeftIcon size={22} /></button>
          <h1>Settings</h1>
          {plusKnown && !isPlus && plusForSale() && (
            <button type="button" className="plus-badge" onClick={() => openPaywall("settings_pro_button")}>
              <span className="ui-sheen" aria-hidden />
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path fill="#000" d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01L12 2z" /></svg>
              <span>PLUS</span>
            </button>
          )}
        </div>

        <PlanCard isPlus={isPlus} />
        <InviteSettingsNote />

        <div className="group-label">CAPTIONS</div>
        <div className="group">
          <Row icon={<LanguagesIcon size={20} />} label="Language hints" onClick={() => onPage("language-hints")} />
          <Row icon={<FileTextIcon size={20} />} label="Context Window" onClick={() => onPage("context")} />
          <Row
            icon={<UsersIcon size={20} />}
            label="Separate Speakers"
            trailing={<Switch on={separateSpeakers} label="Separate Speakers" onChange={on => { capture("settings_speakers_toggled", { on }); updateSettings({ separateSpeakers: on }); }} />}
          />
          <Row icon={<MicrophoneIcon size={20} />} label="Pick a microphone" onClick={() => { capture("settings_microphone_tapped"); onPage("microphone"); }} />
        </div>

        <div className="group-label">ADD-ONS</div>
        <div className="group">
          <Row icon={<PuzzleIcon size={20} />} label="Connectors" onClick={() => { capture("settings_connect_chats_tapped", { signed_in: !account.guest }); if (account.guest) needsAccount("connectors"); else onPage("connectors"); }} />
        </div>

        {/* Captio AI's other products (the app shows this web app here; the
            Apple Watch app joins later). */}
        <div className="group-label">MORE FROM CAPTIO AI</div>
        <div className="group">
          {canInstall && (
            <Row icon={<DesktopIcon size={20} />} label="Install Captio AI on this computer" onClick={() => { void promptInstall(); }} />
          )}
          <Row icon={<PhoneIcon size={20} />} label="Captio AI for iPhone and iPad" href="https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=web_app_settings&mt=8" onOpen={() => capture("settings_product_tapped", { product: "ios" })} />
          <Row icon={<PhoneIcon size={20} />} label="Captio AI for Android" href="https://play.google.com/store/apps/details?id=com.captio.app" onOpen={() => capture("settings_product_tapped", { product: "android" })} />
        </div>

        <div className="group-label">SUPPORT</div>
        <div className="group">
          <Row icon={<MailIcon size={20} />} label="Contact Us" href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Support - ${account.name || "User"}`)}`} onOpen={() => capture("settings_contact_tapped")} />
        </div>

        <div className="group-label">FEEDBACK</div>
        <div className="group">
          <Row icon={<DiscordLogo size={20} />} label="Join our Discord" href={DISCORD_URL} onOpen={() => capture("settings_discord_tapped")} />
          <Row icon={<BugIcon size={20} />} label="Report a Bug" onClick={() => onPage("bug")} />
          <Row icon={<LightbulbIcon size={20} />} label="Request a Feature" onClick={() => onPage("feature")} />
        </div>

        <div className="group-label">APP</div>
        <div className="group">
          <Row icon={<StarIcon size={20} />} label="Rate App" href={RATE_APP_URL} onOpen={() => capture("settings_rate_app_tapped")} />
          <Row icon={<ShareIcon size={20} />} label={shared ? "Copied" : "Share App"} onClick={shareApp} />
        </div>

        <div className="group-label">ACCOUNT</div>
        {account.guest ? (
          <div className="group">
            <Row icon={<LogOutIcon size={20} style={{ transform: "scaleX(-1)" }} />} label="Sign In" onClick={() => { capture("settings_sign_in_tapped"); window.dispatchEvent(new CustomEvent("captio-sign-in", { detail: { source: "settings" } })); }} />
          </div>
        ) : (
        <div className="group">
          <Row icon={<MailIcon size={20} />} label={account.email || account.name} />
          {isPlus && (
            <Row
              icon={<StarIcon size={20} />}
              label="Manage Subscription"
              onClick={async () => {
                capture("settings_manage_subscription_tapped");
                window.open(await manageSubscriptionUrl(), "_blank", "noopener");
              }}
            />
          )}
          <Row icon={<LogOutIcon size={20} />} label="Sign Out" onClick={onSignOut} chevron={false} />
          <Row
            icon={<TrashIcon size={20} />}
            label={deleting === "busy" ? "Deleting…" : "Delete Account"}
            onClick={deleting === "busy" ? undefined : deleteAccount}
            destructive
            chevron={false}
          />
        </div>
        )}

        <div className="group-label">LEGAL</div>
        <div className="group">
          <Row icon={<ShieldIcon size={20} />} label="Privacy Policy" href="/privacy" />
          <Row icon={<ShieldIcon size={20} />} label="Terms of Service" href="/terms" />
        </div>
      </div>
    </main>
  );
}

// The plan card at the top (app: SettingsScreen's usage card): today's free
// credits with the bar and the gold Upgrade to Plus, or YOUR PLAN with the
// PLUS logo.
function PlanCard({ isPlus }: { isPlus: boolean }) {
  const left = creditsRemaining();
  const sale = plusForSale();
  useEffect(() => {
    if (!isPlus && sale) capture("plus_button_shown", { where: "settings_upgrade", style: "gold" });
  }, [isPlus, sale]);
  if (isPlus) {
    return (
      <div className="plan-usage">
        <span className="label">YOUR PLAN</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="plus-logo" src="/web-app/logo-plus-only.png" alt="Plus" />
      </div>
    );
  }
  return (
    <div className="plan-usage">
      <span className="label">FREE USAGE</span>
      <span className="big">{left}</span>
      <span className="sub">of {FREE_DAILY_CREDITS} credits left today</span>
      <div className="track"><div className="fill" style={{ width: `${Math.max(0, Math.min(100, (100 * left) / FREE_DAILY_CREDITS))}%` }} /></div>
      <span className="reset">Resets every day at midnight</span>
      {sale && <div style={{ alignSelf: "stretch" }}>
        <Button
          label="Upgrade to Plus"
          variant="gold"
          style={{ marginTop: 16 }}
          onPress={() => {
            capture("plus_button_tapped", { where: "settings_upgrade", style: "gold" });
            openPaywall("settings_upgrade_card");
          }}
        />
      </div>}
    </div>
  );
}

// A row's page: "‹ Settings", a centred title and one line under it, like the
// app's ModalScreen.
function Page({ title, lede, onBack, children, footer }: {
  title: string; lede?: string; onBack: () => void; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <main className="settings">
      <div className="inner page">
        <button type="button" className="back-link" onClick={onBack}><ChevronLeftIcon size={16} />Settings</button>
        <h1 className="page-title">{title}</h1>
        {lede && <p className="page-lede">{lede}</p>}
        <div className="page-body">{children}</div>
        {footer && <div className="page-footer">{footer}</div>}
      </div>
    </main>
  );
}

function LanguageHints({ onBack }: { onBack: () => void }) {
  const { settingsLangHints } = useSettings();
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");

  if (picking) {
    const q = query.trim().toLowerCase();
    const options = LANGUAGES.filter(l => !settingsLangHints.includes(l.name) && (!q || l.name.toLowerCase().includes(q)));
    return (
      <Page title="Add a language" onBack={() => { setPicking(false); setQuery(""); }}>
        <label className="search" style={{ margin: "0 0 12px" }}>
          <SearchIcon size={20} />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search language" aria-label="Search language" />
        </label>
        <div className="group">
          {options.map(l => (
            <Row
              key={l.name}
              icon={<span style={{ fontSize: 22 }}>{l.flag}</span>}
              label={l.name}
              chevron={false}
              onClick={() => {
                capture("settings_language_added", { language: l.name });
                updateSettings({ settingsLangHints: [...settingsLangHints, l.name] });
                setPicking(false);
                setQuery("");
              }}
            />
          ))}
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Language hints"
      lede="Language hints will help increase transcription accuracy. The model will still transcribe in any language."
      onBack={onBack}
      footer={<button type="button" className="primary-btn" onClick={() => setPicking(true)}>Add a language</button>}
    >
      {settingsLangHints.length > 0 && (
        <div className="group">
          {settingsLangHints.map(name => {
            const lang = LANGUAGES.find(l => l.name === name);
            return (
              <Row
                key={name}
                icon={<span style={{ fontSize: 22 }}>{lang?.flag}</span>}
                label={name}
                trailing={
                  <button
                    type="button" className="icon-btn" style={{ color: "var(--ink-meta)" }} aria-label={`${name}, Delete`}
                    onClick={() => { capture("settings_language_removed", { language: name }); updateSettings({ settingsLangHints: settingsLangHints.filter(l => l !== name) }); }}
                  >
                    <XIcon size={18} />
                  </button>
                }
              />
            );
          })}
        </div>
      )}
    </Page>
  );
}

function ContextWindow({ onBack, account }: { onBack: () => void; account: Account }) {
  const { contextWords, contextWindowText } = useSettings();
  const [input, setInput] = useState("");
  const add = () => {
    const words = input.split(/[,\n]/).map(w => w.trim()).filter(Boolean);
    if (!words.length) return;
    const seen = new Set(contextWords.map(w => w.toLowerCase()));
    const fresh = words.filter(w => !seen.has(w.toLowerCase()) && (seen.add(w.toLowerCase()), true));
    updateSettings({ contextWords: [...contextWords, ...fresh] });
    capture("settings_vocabulary_added", { count: fresh.length });
    setInput("");
  };
  const firstName = account.name.trim().split(/\s+/)[0] || "Alex";
  return (
    <Page title="Context Window" lede="Names and words to spell right, and anything that helps understand the topic." onBack={onBack}>
      <div className="field-label">✏️ WORDS &amp; NAMES</div>
      <div className="add-row">
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") add(); }}
          placeholder={`e.g. ${firstName}, London, WhatsApp...`}
          aria-label="Words and names"
        />
        <button type="button" className="add-btn" onClick={add} disabled={!input.trim()}>Add</button>
      </div>
      {contextWords.length > 0 && (
        <div className="word-chips">
          {contextWords.map(w => (
            <button key={w} type="button" className="word-chip" aria-label={`${w}, Delete`} onClick={() => { capture("settings_vocabulary_removed"); updateSettings({ contextWords: contextWords.filter(x => x !== w) }); }}>
              {w}<XIcon size={12} color="var(--ink-meta)" />
            </button>
          ))}
        </div>
      )}
      <div className="field-label" style={{ marginTop: 28 }}>📄 BACKGROUND INFO</div>
      <textarea
        className="input"
        rows={7}
        value={contextWindowText}
        onChange={e => updateSettings({ contextWindowText: e.target.value })}
        placeholder="Paste text here..."
        aria-label="Background info"
      />
    </Page>
  );
}

type ChatApp = "claude" | "chatgpt" | "gemini" | "perplexity";
const CHAT_APPS: { key: ChatApp; name: string; steps: string[] }[] = [
  { key: "claude", name: "Claude", steps: [
    "On <b>claude.ai</b>, open <b>Customize</b> → <b>Connectors</b>",
    "Click <b>+</b> → <b>Add custom connector</b>",
    `Name it <b>Captio AI</b>, enter <b>${CONNECTOR_URL}</b>, click <b>Add</b>`,
    "Click <b>Connect</b>, sign in with your Captio AI account, click <b>Allow</b>",
    "Ask about any recording, <b>on your phone too</b>",
  ] },
  { key: "chatgpt", name: "ChatGPT", steps: [
    "On <b>chatgpt.com</b>, open <b>Plugins</b>, click <b>+</b>",
    "Click <b>Add custom MCP server</b>",
    `Name it <b>Captio AI</b>, enter <b>${CONNECTOR_URL}</b>, pick <b>OAuth</b>`,
    "Tick <b>I understand and want to continue</b>, click <b>Create as a plugin</b>",
    "Sign in with your Captio AI account, click <b>Allow</b>",
    "In <b>Plugins</b>, click <b>+</b> next to <b>Captio AI</b> to install it",
    "In a chat, type <b>@</b>, pick <b>Captio AI</b> and ask",
  ] },
  { key: "gemini", name: "Gemini", steps: [
    "On <b>gemini.google.com</b>, open <b>Settings</b> → <b>Connected Apps</b>",
    "Under <b>Custom apps</b>, click <b>Add a custom app</b>",
    `Enter <b>${CONNECTOR_URL}</b>, click <b>Next</b>`,
    "Sign in with your Captio AI account, click <b>Allow</b>",
    "In a chat, type <b>@</b>, pick <b>Captio AI</b> and ask, <b>on your phone too</b>",
  ] },
  { key: "perplexity", name: "Perplexity", steps: [
    "On <b>perplexity.ai</b>, open <b>Plugins</b> in the sidebar",
    "Click <b>Add custom</b> → <b>Connector</b> → <b>Add MCP connector</b>",
    `Pick <b>Remote</b>, name it <b>Captio AI</b>, enter <b>${CONNECTOR_URL}</b>`,
    "Pick <b>OAuth</b>, tick the box, click <b>Add</b>",
    "Click the <b>Captio AI</b> card, sign in, click <b>Allow</b>",
    "Ask about any recording",
  ] },
];

// "Click <b>Add</b>" → Click **Add**, without HTML from strings.
function Bold({ text }: { text: string }) {
  return <>{text.split(/<b>(.*?)<\/b>/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}</>;
}

function Connectors({ onBack }: { onBack: () => void }) {
  const [app, setApp] = useState<ChatApp>("claude");
  const [copied, setCopied] = useState(false);
  const current = CHAT_APPS.find(a => a.key === app)!;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONNECTOR_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      capture("connect_chats_address_copied", { app, how: "copy" });
    } catch (e) {
      recordError("connector_copy", e);
    }
  };
  return (
    <Page title="Connectors" onBack={onBack}>
      <div className="app-tabs" role="tablist">
        {CHAT_APPS.map(a => (
          <button key={a.key} type="button" role="tab" aria-selected={a.key === app} onClick={() => { setApp(a.key); capture("connect_chats_app_switched", { app: a.key }); }}>
            {a.name}
          </button>
        ))}
      </div>
      <ol className="steps">
        {current.steps.map((s, i) => <li key={i}><span className="num">{i + 1}</span><span><Bold text={s} /></span></li>)}
      </ol>
      <div className="field-label" style={{ marginTop: 28 }}>ADDRESS</div>
      <button type="button" className="address" onClick={copy}>
        <span>{CONNECTOR_URL}</span>
        {copied ? <CopyCheckIcon size={20} color="var(--brand)" /> : <CopyIcon size={20} color="var(--brand)" />}
      </button>
    </Page>
  );
}

function Report({ kind, onBack }: { kind: "bug" | "feature"; onBack: () => void }) {
  const bug = kind === "bug";
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    const body = text.trim().slice(0, 2000);
    if (!body) return;
    capture(bug ? "bug_report" : "feature_request", { text: body, is_plus: isPlusNow(), signed_in: true });
    setSent(true);
  };
  if (sent) {
    return (
      <Page
        title={bug ? "Thanks for telling us" : "Thanks for the idea"}
        lede={bug ? "Your report went straight to the team. We'll look into it." : "It went straight to the team. We read every request when planning what to build next."}
        onBack={onBack}
      >
        <button type="button" className="primary-btn" onClick={onBack}>Done</button>
      </Page>
    );
  }
  return (
    <Page
      title={bug ? "Report a Bug" : "Request a Feature"}
      lede={bug ? "Describe what happened and how to reproduce it." : "Tell us what you'd like to see in Captio AI."}
      onBack={onBack}
    >
      <textarea
        className="input"
        rows={8}
        autoFocus
        maxLength={2000}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={bug ? "Describe the bug..." : "Describe your idea..."}
        aria-label={bug ? "Report a Bug" : "Request a Feature"}
      />
      <button type="button" className="primary-btn" style={{ marginTop: 16 }} onClick={send} disabled={!text.trim()}>Send</button>
    </Page>
  );
}
