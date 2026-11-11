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
import { LANGUAGES, languageLabel, languageMatches, updateSettings, useSettings } from "./settings";
import { t } from "./i18n";
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
    const text = t("settings.shareAppMessage", { url: STORE_URL });
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
      title: t("settings.deleteAccountTitle"),
      body: t("settings.deleteAccountBody"),
      confirm: t("common.delete"),
      destructive: true,
    }))) return;
    setDeleting("busy");
    if (account.preview) { onSignOut(); return; }
    const { error } = await supabase().rpc("delete_user");
    if (error) {
      setDeleting("no");
      showErrorAlert({ where: "account_delete", error, title: t("settings.deleteAccountFailed"), body: t("common.genericError") });
      return;
    }
    capture("account_deleted", { is_plus: isPlus });
    onSignOut();
  };

  return (
    <main className="settings">
      <div className="inner">
        <div className="settings-head">
          <button type="button" className="icon-btn" onClick={onBack} aria-label={t("common.back")}><ChevronLeftIcon size={22} /></button>
          <h1>{t("settings.title")}</h1>
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

        <div className="group-label">{t("settings.sectionCaptions")}</div>
        <div className="group">
          <Row icon={<LanguagesIcon size={20} />} label={t("settings.languageHints")} onClick={() => onPage("language-hints")} />
          <Row icon={<FileTextIcon size={20} />} label={t("settings.contextWindow")} onClick={() => onPage("context")} />
          <Row
            icon={<UsersIcon size={20} />}
            label={t("captionSettings.separateSpeakers")}
            trailing={<Switch on={separateSpeakers} label={t("captionSettings.separateSpeakers")} onChange={on => { capture("settings_speakers_toggled", { on }); updateSettings({ separateSpeakers: on }); }} />}
          />
          <Row icon={<MicrophoneIcon size={20} />} label={t("mic.settings.row")} onClick={() => { capture("settings_microphone_tapped"); onPage("microphone"); }} />
        </div>

        <div className="group-label">{t("settings.sectionAddons")}</div>
        <div className="group">
          <Row icon={<PuzzleIcon size={20} />} label={t("settings.connectChats")} onClick={() => { capture("settings_connect_chats_tapped", { signed_in: !account.guest }); if (account.guest) needsAccount("connectors"); else onPage("connectors"); }} />
        </div>

        {/* Captio AI's other products (the app shows this web app here; the
            Apple Watch app joins later). */}
        <div className="group-label">{t("settings.sectionMore")}</div>
        <div className="group">
          {canInstall && (
            <Row icon={<DesktopIcon size={20} />} label={t("web.settings.installApp")} onClick={() => { void promptInstall(); }} />
          )}
          <Row icon={<PhoneIcon size={20} />} label={t("web.settings.iosApp")} href="https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=web_app_settings&mt=8" onOpen={() => capture("settings_product_tapped", { product: "ios" })} />
          <Row icon={<PhoneIcon size={20} />} label={t("web.settings.androidApp")} href="https://play.google.com/store/apps/details?id=com.captio.app" onOpen={() => capture("settings_product_tapped", { product: "android" })} />
        </div>

        <div className="group-label">{t("settings.sectionSupport")}</div>
        <div className="group">
          <Row icon={<MailIcon size={20} />} label={t("settings.contactUs")} href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Support - ${account.name || "User"}`)}`} onOpen={() => capture("settings_contact_tapped")} />
        </div>

        <div className="group-label">{t("settings.sectionFeedback")}</div>
        <div className="group">
          <Row icon={<DiscordLogo size={20} />} label={t("settings.joinDiscord")} href={DISCORD_URL} onOpen={() => capture("settings_discord_tapped")} />
          <Row icon={<BugIcon size={20} />} label={t("settings.reportBug")} onClick={() => onPage("bug")} />
          <Row icon={<LightbulbIcon size={20} />} label={t("settings.requestFeature")} onClick={() => onPage("feature")} />
        </div>

        <div className="group-label">{t("settings.sectionApp")}</div>
        <div className="group">
          <Row icon={<StarIcon size={20} />} label={t("settings.rateApp")} href={RATE_APP_URL} onOpen={() => capture("settings_rate_app_tapped")} />
          <Row icon={<ShareIcon size={20} />} label={shared ? t("export.copied") : t("settings.shareApp")} onClick={shareApp} />
        </div>

        <div className="group-label">{t("settings.sectionAccount")}</div>
        {account.guest ? (
          <div className="group">
            <Row icon={<LogOutIcon size={20} style={{ transform: "scaleX(-1)" }} />} label={t("settings.signIn")} onClick={() => { capture("settings_sign_in_tapped"); window.dispatchEvent(new CustomEvent("captio-sign-in", { detail: { source: "settings" } })); }} />
          </div>
        ) : (
        <div className="group">
          <Row icon={<MailIcon size={20} />} label={account.email || account.name} />
          {isPlus && (
            <Row
              icon={<StarIcon size={20} />}
              label={t("settings.manageSubscription")}
              onClick={async () => {
                capture("settings_manage_subscription_tapped");
                window.open(await manageSubscriptionUrl(), "_blank", "noopener");
              }}
            />
          )}
          <Row icon={<LogOutIcon size={20} />} label={t("settings.signOut")} onClick={onSignOut} chevron={false} />
          <Row
            icon={<TrashIcon size={20} />}
            label={deleting === "busy" ? t("settings.deleting") : t("settings.deleteAccount")}
            onClick={deleting === "busy" ? undefined : deleteAccount}
            destructive
            chevron={false}
          />
        </div>
        )}

        <div className="group-label">{t("settings.sectionLegal")}</div>
        <div className="group">
          <Row icon={<ShieldIcon size={20} />} label={t("settings.privacyPolicy")} href="/privacy" />
          <Row icon={<ShieldIcon size={20} />} label={t("settings.terms")} href="/terms" />
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
        <span className="label">{t("settings.yourPlan")}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="plus-logo" src="/web-app/logo-plus-only.png" alt="Plus" />
      </div>
    );
  }
  return (
    <div className="plan-usage">
      <span className="label">{t("settings.freeUsage")}</span>
      <span className="big">{left}</span>
      <span className="sub">{t("settings.creditsLeft", { total: FREE_DAILY_CREDITS })}</span>
      <div className="track"><div className="fill" style={{ width: `${Math.max(0, Math.min(100, (100 * left) / FREE_DAILY_CREDITS))}%` }} /></div>
      <span className="reset">{t("settings.resetsDaily")}</span>
      {sale && <div style={{ alignSelf: "stretch" }}>
        <Button
          label={t("settings.upgrade")}
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
        <button type="button" className="back-link" onClick={onBack}><ChevronLeftIcon size={16} />{t("settings.title")}</button>
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
    const options = LANGUAGES.filter(l => !settingsLangHints.includes(l.name) && languageMatches(l.name, q));
    return (
      <Page title={t("common.addLanguage")} onBack={() => { setPicking(false); setQuery(""); }}>
        <label className="search" style={{ margin: "0 0 12px" }}>
          <SearchIcon size={20} />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder={t("common.searchLanguage")} aria-label={t("common.searchLanguage")} />
        </label>
        <div className="group">
          {options.map(l => (
            <Row
              key={l.name}
              icon={<span style={{ fontSize: 22 }}>{l.flag}</span>}
              label={languageLabel(l.name)}
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
      title={t("settings.languageHints")}
      lede={t("captionSettings.hintsDesc")}
      onBack={onBack}
      footer={<button type="button" className="primary-btn" onClick={() => setPicking(true)}>{t("common.addLanguage")}</button>}
    >
      {settingsLangHints.length > 0 && (
        <div className="group">
          {settingsLangHints.map(name => {
            const lang = LANGUAGES.find(l => l.name === name);
            return (
              <Row
                key={name}
                icon={<span style={{ fontSize: 22 }}>{lang?.flag}</span>}
                label={languageLabel(name)}
                trailing={
                  <button
                    type="button" className="icon-btn" style={{ color: "var(--ink-meta)" }} aria-label={t("web.settings.deleteItem", { name })}
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
  const firstName = account.name.trim().split(/\s+/)[0] || t("captionSettings.defaultName");
  return (
    <Page title={t("settings.contextWindow")} lede={t("settings.contextDesc")} onBack={onBack}>
      <div className="field-label">{t("settings.wordsLabel")}</div>
      <div className="add-row">
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") add(); }}
          placeholder={t("captionSettings.wordsPlaceholder", { name: firstName })}
          aria-label={t("web.settings.wordsAria")}
        />
        <button type="button" className="add-btn" onClick={add} disabled={!input.trim()}>{t("common.add")}</button>
      </div>
      {contextWords.length > 0 && (
        <div className="word-chips">
          {contextWords.map(w => (
            <button key={w} type="button" className="word-chip" aria-label={t("web.settings.deleteItem", { name: w })} onClick={() => { capture("settings_vocabulary_removed"); updateSettings({ contextWords: contextWords.filter(x => x !== w) }); }}>
              {w}<XIcon size={12} color="var(--ink-meta)" />
            </button>
          ))}
        </div>
      )}
      <div className="field-label" style={{ marginTop: 28 }}>{t("settings.backgroundLabel")}</div>
      <textarea
        className="input"
        rows={7}
        value={contextWindowText}
        onChange={e => updateSettings({ contextWindowText: e.target.value })}
        placeholder={t("settings.backgroundPlaceholder")}
        aria-label={t("web.settings.backgroundAria")}
      />
    </Page>
  );
}

type ChatApp = "claude" | "chatgpt" | "gemini" | "perplexity";
// Each app's steps are the app's keys connectChats.<app>1…N (the same words
// as the phone's Show me how).
const CHAT_APPS: { key: ChatApp; name: string; steps: number }[] = [
  { key: "claude", name: "Claude", steps: 5 },
  { key: "chatgpt", name: "ChatGPT", steps: 7 },
  { key: "gemini", name: "Gemini", steps: 5 },
  { key: "perplexity", name: "Perplexity", steps: 6 },
];

// The chat apps' menu names, filled into the steps (app: ConnectChatsScreen ui()).
const chatUi = () => ({
  customize: t("connectChats.ui.customize"),
  connectors: t("connectChats.ui.connectors"),
  addCustom: t("connectChats.ui.addCustom"),
  add: t("connectChats.ui.add"),
  connect: t("connectChats.ui.connect"),
  plugins: t("connectChats.ui.plugins"),
  addMcp: t("connectChats.ui.addMcp"),
  understand: t("connectChats.ui.understand"),
  createPlugin: t("connectChats.ui.createPlugin"),
  settings: t("connectChats.ui.settings"),
  connectedApps: t("connectChats.ui.connectedApps"),
  customApps: t("connectChats.ui.customApps"),
  addCustomApp: t("connectChats.ui.addCustomApp"),
  next: t("connectChats.ui.next"),
  addCustomMenu: t("connectChats.ui.addCustomMenu"),
  connector: t("connectChats.ui.connector"),
  addMcpConnector: t("connectChats.ui.addMcpConnector"),
  remote: t("connectChats.ui.remote"),
  allow: t("connectChats.ui.allow"),
  url: CONNECTOR_URL,
});

// "Click <b>Add</b>" → Click **Add**, without HTML from strings.
function Bold({ text }: { text: string }) {
  return <>{text.split(/<b>(.*?)<\/b>/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}</>;
}

function Connectors({ onBack }: { onBack: () => void }) {
  const [app, setApp] = useState<ChatApp>("claude");
  const [copied, setCopied] = useState(false);
  const current = CHAT_APPS.find(a => a.key === app)!;
  const ui = chatUi();
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
    <Page title={t("connectChats.title")} onBack={onBack}>
      <div className="app-tabs" role="tablist">
        {CHAT_APPS.map(a => (
          <button key={a.key} type="button" role="tab" aria-selected={a.key === app} onClick={() => { setApp(a.key); capture("connect_chats_app_switched", { app: a.key }); }}>
            {a.name}
          </button>
        ))}
      </div>
      <ol className="steps">
        {Array.from({ length: current.steps }, (_, i) => {
          const s = t(`connectChats.${current.key}${i + 1}`, ui);
          return <li key={i}><span className="num">{i + 1}</span><span><Bold text={s} /></span></li>;
        })}
      </ol>
      <div className="field-label" style={{ marginTop: 28 }}>{t("connectChats.address")}</div>
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
        title={bug ? t("errorReport.thanksTitle") : t("settings.requestThanksTitle")}
        lede={bug ? t("errorReport.thanksBody") : t("settings.requestThanksBody")}
        onBack={onBack}
      >
        <button type="button" className="primary-btn" onClick={onBack}>{t("voices.done")}</button>
      </Page>
    );
  }
  return (
    <Page
      title={bug ? t("settings.reportBug") : t("settings.requestFeature")}
      lede={bug ? t("settings.reportDesc") : t("settings.requestDesc")}
      onBack={onBack}
    >
      <textarea
        className="input"
        rows={8}
        autoFocus
        maxLength={2000}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={bug ? t("settings.reportPlaceholder") : t("settings.requestPlaceholder")}
        aria-label={bug ? t("settings.reportBug") : t("settings.requestFeature")}
      />
      <button type="button" className="primary-btn" style={{ marginTop: 16 }} onClick={send} disabled={!text.trim()}>{t("common.send")}</button>
    </Page>
  );
}
