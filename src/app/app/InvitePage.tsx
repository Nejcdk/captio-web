"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "./invite.css";
import { capture, getSupabase, isPreview, recordErrorOnce } from "./client";
import {
  applyReferralLink, cashAvailable, closeInvite, formatUsd, getReferralStats, markInviteDue, markInviteSeen,
  markInviteShared, onInviteDue, openInvite as open, redeemErrorText, redeemReferralCode, referralLink, shareMessage, takeDueInvite,
  takeInviteFromUrl, useCashAmounts, useInviteOpen, type ReferralStats,
} from "./invite";
import { isPlusNow } from "./plus";
import { CopyCheckIcon, CopyIcon, ShareIcon } from "./Icons";
import { Button, CloseButton, ModalCard, QuietButton, isCardOpen, showCard } from "./ui";
import { locale, t } from "./i18n";

// The referral page (app: InviteScreen, Nejc 2026-10-30): "Referral program",
// what you've earned (from $0 on; a tap is only confetti), up to $10 for each friend
// who buys monthly and up to $50 for yearly (both tiles share the link), the meter
// up to the most anyone can earn, and the one link with Share. Under it "How
// does it work?" and "Got a code from a friend?". A full-window page over the
// app, like the paywall. Nothing at all where the cash can't be paid.

export function openInvite(source: string): void {
  open(source);
}

export function InvitePage() {
  const { open: isOpen, source } = useInviteOpen();
  useInviteAutomation();
  if (!isOpen || !cashAvailable()) return null;
  return <InviteScreen key={source} source={source} />;
}

// An invite link in the address, and the page opening by itself when it's due.
function useInviteAutomation() {
  useEffect(() => {
    const code = takeInviteFromUrl();
    if (code) void applyReferralLink(code);

    let timer: ReturnType<typeof setTimeout> | null = null;
    // Only over Home: no card, paywall, captions or other page up.
    const busy = () => isCardOpen() || !!document.querySelector(".paywall, .cs, .invite-page");
    const tryOpen = () => {
      timer = null;
      if (busy()) { timer = setTimeout(tryOpen, 2000); return; }
      const moment = takeDueInvite();
      if (moment) open(`auto_${moment}`);
    };
    const offDue = onInviteDue(() => { if (!timer) timer = setTimeout(tryOpen, 700); });

    // Coming back to the tab is coming back to Home: 1 time in 3.
    const onVisible = () => {
      if (document.visibilityState !== "visible" || isPreview()) return;
      void ownRecordingCount().then(n => markInviteDue("back_home", n));
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      offDue();
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}

// Their own recordings on the account (the welcome and onboarding demos left out).
async function ownRecordingCount(): Promise<number> {
  try {
    const sb = getSupabase();
    const { data } = await sb.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return 0;
    const { count, error } = await sb.from("recordings").select("id", { count: "exact", head: true })
      .eq("user_id", uid).is("deleted_at", null).not("id", "like", "onboarding-demo-%");
    if (error) throw error;
    return count ?? 0;
  } catch (e) {
    recordErrorOnce("invite_recordings_count", e);
    return 0;
  }
}

function InviteScreen({ source }: { source: string }) {
  const amounts = useCashAmounts();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [guide, setGuide] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const monthlyUsd = stats?.cash?.monthlyUsd ?? amounts.monthlyUsd;
  const yearlyUsd = stats?.cash?.yearlyUsd ?? amounts.yearlyUsd;
  const maxUsd = stats?.cash?.maxUsd ?? amounts.maxUsd;
  const money = stats?.cash ?? null;
  const earned = money ? money.paidUsd + money.readyUsd + money.waitingUsd : 0;
  const link = stats ? referralLink(stats.code) : null;

  const load = useCallback(async () => {
    const s = await getReferralStats();
    setStats(s);
    capture("invite_stats_loaded", { ok: !!s, friends_joined: s?.friendsJoined ?? 0, cash: !!s?.cash });
  }, []);

  useEffect(() => {
    capture("invite_screen_viewed", { source, signed_in: true, is_plus: isPlusNow(), cash: true });
    markInviteSeen();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets state only after the server answers
    void load();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !isCardOpen()) closeInvite(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [source, load]);

  // Every tap, even one that goes no further (what people tap and where they stop).
  const tapped = (what: string) => capture("invite_tapped", { what, source, cash: true });

  const onShare = async (from: "button" | "monthly_tile" | "yearly_tile") => {
    if (!stats) return;
    tapped(from);
    const text = shareMessage(stats.code);
    try {
      if (navigator.share) {
        await navigator.share({ text });
        capture("invite_shared", { channel: "web_share", is_plus: isPlusNow(), cash: true, from, source });
      } else {
        await navigator.clipboard.writeText(text);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        capture("invite_shared", { channel: "clipboard", is_plus: isPlusNow(), cash: true, from, source });
      }
      markInviteShared();
    } catch (e) {
      // Closing the share sheet is not an error.
      if ((e as DOMException)?.name !== "AbortError") recordErrorOnce("invite_share", e);
    }
  };

  const onCopy = async () => {
    if (!link) return;
    tapped("copy_link");
    try {
      await navigator.clipboard.writeText(link);
      capture("invite_link_copied", { cash: true, source });
      markInviteShared();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      recordErrorOnce("invite_copy", e);
    }
  };

  const onRedeem = () => {
    tapped("got_a_code");
    capture("referral_redeem_opened");
    showCard(close => (
      <RedeemCard
        close={close}
        onRedeem={async code => {
          setRedeeming(true);
          const res = await redeemReferralCode(code);
          setRedeeming(false);
          close();
          showCard(done => (
            <ModalCard
              title={res.ok ? t("invite.redeemedTitle") : t("invite.redeemFailedTitle")}
              body={res.ok ? t("invite.redeemedBody") : redeemErrorText(res.error)}
              onClose={done}
            >
              <Button label={t("common.close")} size="compact" onPress={done} />
            </ModalCard>
          ));
          if (res.ok) void load();
        }}
      />
    ));
  };

  if (guide) {
    return (
      <InviteGuide
        monthly={formatUsd(monthlyUsd)} yearly={formatUsd(yearlyUsd)} max={formatUsd(maxUsd)}
        onClose={() => setGuide(false)}
        onFinish={() => { capture("invite_guide_finished"); setGuide(false); }}
      />
    );
  }

  return (
    <div className="invite-page" role="dialog" aria-modal="true" aria-label={t("invite.page.title")}>
      <div className="invite-inner">
        <CloseButton onPress={closeInvite} style={{ position: "absolute", top: 16, right: 16 }} />
        <h1 className="invite-title">{t("invite.page.title")}</h1>
        <div className="invite-limited">{t("invite.page.limitedTime")}</div>

        <EarnedCard text={formatUsd(earned)} onTap={() => tapped("earned")} />

        {/* The paywall's two colours. People tap what looks like money, so both share. */}
        <div className="invite-tiles">
          <button type="button" className="invite-tile monthly" disabled={!stats} onClick={() => onShare("monthly_tile")}>
            <span className="label">{t("invite.page.upTo")}</span>
            <span className="amount">{formatUsd(monthlyUsd)}</span>
            <span className="label">{t("invite.page.monthly")}</span>
          </button>
          <button type="button" className="invite-tile yearly" disabled={!stats} onClick={() => onShare("yearly_tile")}>
            <span className="label">{t("invite.page.upTo")}</span>
            <span className="amount">{formatUsd(yearlyUsd)}</span>
            <span className="label">{t("invite.page.yearly")}</span>
          </button>
        </div>
        <InviteMeter perFriendUsd={monthlyUsd} maxUsd={maxUsd} />

        <div className="invite-footer">
          <div className="invite-link-label">{t("invite.page.linkLabel")}</div>
          <button type="button" className="invite-link" disabled={!link} onClick={onCopy} aria-label={t("invite.page.copyLink")}>
            <span className={link ? undefined : "placeholder"}>{link ? link.replace("https://", "") : "captioai.app/i/••••••"}</span>
            {copied ? <CopyCheckIcon size={20} color="#28A745" /> : <CopyIcon size={20} color={link ? "var(--brand)" : "#C7C7CC"} />}
          </button>
          <button type="button" className="invite-share" disabled={!stats} onClick={() => onShare("button")}>
            {stats ? <ShareIcon size={20} color="#FFFFFF" /> : <span className="invite-spinner" aria-hidden />}
            <span>{shareCopied ? t("export.copied") : t("invite.page.share")}</span>
          </button>
          <div className="invite-quiet-row">
            <button type="button" className="ui-quiet" onClick={() => { tapped("how_it_works"); capture("invite_guide_opened"); setGuide(true); }}>
              {t("invite.cash.howItWorks")}
            </button>
            <button type="button" className="ui-quiet" disabled={redeeming || !stats} onClick={onRedeem}>
              {redeeming ? t("invite.checking") : t("invite.gotCode")}
            </button>
          </div>
          {/* How the money comes: by PayPal. */}
          <div className="invite-paid" aria-label={t("web.invite.paidWithPayPal")}>
            <span>{t("invite.page.paidWith")}</span>
            <span className="invite-paypal"><PayPalLogo /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RedeemCard({ close, onRedeem }: { close: () => void; onRedeem: (code: string) => void }) {
  const [code, setCode] = useState("");
  return (
    <ModalCard title={t("invite.redeemTitle")} body={t("invite.redeemBody")} onClose={close}>
      <input
        className="input invite-code-input"
        autoFocus
        maxLength={32}
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        onKeyDown={e => { if (e.key === "Enter" && code.trim()) onRedeem(code); }}
        aria-label={t("web.invite.codeLabel")}
        autoCapitalize="characters"
        autoComplete="off"
      />
      <Button label={t("invite.redeem")} size="compact" disabled={!code.trim()} style={{ marginTop: 12 }} onPress={() => onRedeem(code)} />
      <QuietButton label={t("common.cancel")} onPress={close} />
    </ModalCard>
  );
}

// ─── You've earned (app: EarnedAmount) ───────────────────────────────────────
// The number hops and throws confetti when the page opens, every 6 s while
// it's on screen, and on every tap, even at $0. A tap opens nothing. Every
// burst moves differently; with reduced motion nothing starts by itself.

const CONFETTI = ["#1C49F5", "#FFB800", "#D93025", "#1E8E3E", "#E37400", "#8430CE", "#007B83"];
const random = (min: number, max: number) => min + Math.random() * (max - min);

function EarnedCard({ text, onTap }: { text: string; onTap: () => void }) {
  const card = useRef<HTMLButtonElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  const burst = useCallback(() => {
    const el = card.current;
    if (!el) return;
    number.current?.animate(
      [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-14px) rotate(-3deg)" }, { transform: "translateY(0) rotate(0)" }],
      { duration: 520, easing: "cubic-bezier(0.3, 1.5, 0.5, 1)" },
    );
    const aim = random(0, Math.PI * 2);
    const spread = [Math.PI * 2, Math.PI * 1.3, Math.PI * 0.7][Math.floor(Math.random() * 3)];
    const twoWays = Math.random() < 0.25;
    const power = random(0.75, 1.3);
    const gravity = random(0.7, 1.4);
    const fromX = random(-50, 50);
    const n = Math.round(random(18, 30));
    for (let i = 0; i < n; i++) {
      const piece = document.createElement("span");
      piece.className = "invite-confetti";
      piece.style.background = CONFETTI[i % CONFETTI.length];
      piece.style.width = `${random(5, 8)}px`;
      piece.style.height = `${random(9, 13)}px`;
      el.appendChild(piece);
      const angle = aim + (twoWays && i % 2 ? Math.PI : 0) + random(-spread / 2, spread / 2);
      const reach = random(50, 170) * power;
      const x = Math.cos(angle) * reach;
      const rise = Math.sin(angle) * reach * 0.55 - random(10, 40);
      const fall = random(40, 90) * gravity;
      const turns = random(0.5, 3) * (Math.random() < 0.5 ? -1 : 1) * 360;
      const sway = random(-24, 24);
      piece.animate(
        [
          { transform: `translate(${fromX}px, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${fromX + x * 0.7 + sway}px, ${rise}px) rotate(${turns * 0.5}deg)`, opacity: 1, offset: 0.4 },
          { transform: `translate(${fromX + x - sway}px, ${rise + fall}px) rotate(${turns}deg)`, opacity: 0 },
        ],
        { duration: 1900, delay: random(0, 200), easing: "cubic-bezier(0.2, 0.7, 0.4, 1)", fill: "forwards" },
      ).onfinish = () => piece.remove();
    }
    try { navigator.vibrate?.([30, 100, 20, 100, 20]); } catch { /* no vibration here */ }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const first = setTimeout(burst, 350);
    const every = setInterval(() => { if (document.visibilityState === "visible") burst(); }, 6000);
    return () => { clearTimeout(first); clearInterval(every); };
  }, [burst]);

  return (
    <button
      type="button"
      ref={card}
      className="invite-earned"
      onClick={() => { onTap(); if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) burst(); }}
    >
      <span className="invite-earned-label">{t("invite.cash.earnedLabel")}</span>
      <span className="invite-earned-amount" ref={number}>{text}</span>
    </button>
  );
}

// ─── The meter (app: InviteMeter) ────────────────────────────────────────────
// No words: the money climbs as friends do (1, 5, 10 … at the lowest reward)
// and the bar fills up to the most anyone can earn. Holds at 100 friends with
// reduced motion.

const STEPS = [1, 5, 10, 25, 50, 100, 250];
const STILL_STEP = 5;

function InviteMeter({ perFriendUsd, maxUsd }: { perFriendUsd: number; maxUsd: number }) {
  const top = Math.ceil(maxUsd / perFriendUsd);
  const steps = [...STEPS.filter(n => n < top), top];
  const [step, setStep] = useState(Math.min(STILL_STEP, steps.length - 1));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const go = (i: number) => {
      setStep(i);
      const last = i === steps.length - 1;
      timer = setTimeout(() => go(last ? 0 : i + 1), last ? 2400 : 780);
    };
    go(0);
    return () => clearTimeout(timer);
  }, [steps.length]);

  const friends = steps[Math.min(step, steps.length - 1)];
  const fill = (Math.min(step, steps.length - 1) + 1) / steps.length;
  return (
    <div className="invite-meter">
      <div className="invite-meter-numbers">
        <span className="total">{formatUsd(Math.min(friends * perFriendUsd, maxUsd))}</span>
        <span className="sum">👥 {friends.toLocaleString(locale())} × {formatUsd(perFriendUsd)}</span>
      </div>
      <div className="invite-meter-bar">
        <span className="track"><span className="fill" style={{ transform: `translateX(${(fill - 1) * 100}%)` }} /></span>
        <span className="max">{formatUsd(maxUsd)}</span>
      </div>
    </div>
  );
}

// ─── How does it work? (app: InviteGuideScreen, a StepGuide) ─────────────────
// Three steps, each with the owl for that moment; tap the picture's left or
// right half to go back or on.

function Bold({ text }: { text: string }) {
  return <>{text.split(/<b>(.*?)<\/b>/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}</>;
}

function InviteGuide({ monthly, yearly, max, onClose, onFinish }: {
  monthly: string; yearly: string; max: string; onClose: () => void; onFinish: () => void;
}) {
  const steps: { text: string; owl: string }[] = [
    { text: t("invite.guide.step1"), owl: "owl-gift" },
    { text: t("invite.guide.step3", { monthly, yearly, max }), owl: "owl-plus" },
    { text: t("invite.guide.step4"), owl: "owl-opening-gift" },
  ];
  const [i, setI] = useState(0);
  const last = i === steps.length - 1;
  const next = () => (last ? onFinish() : setI(i + 1));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") setI(v => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div className="invite-page invite-guide" role="dialog" aria-modal="true" aria-label={t("invite.cash.howItWorks")}>
      <div className="invite-inner">
        <div className="invite-guide-bars">
          {steps.map((_, k) => <span key={k} className={k <= i ? "on" : undefined} />)}
        </div>
        <CloseButton onPress={onClose} style={{ position: "absolute", top: 28, right: 16 }} />
        <p className="invite-guide-text"><Bold text={steps[i].text} /></p>
        <div className="invite-guide-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/web-app/${steps[i].owl}.png`} alt="" />
          <button type="button" className="half left" aria-label={t("common.back")} onClick={() => setI(Math.max(0, i - 1))} />
          <button type="button" className="half right" aria-label={t("widgetGuide.next")} onClick={next} />
        </div>
        <Button label={last ? t("widgetGuide.done") : t("widgetGuide.next")} onPress={next} />
      </div>
    </div>
  );
}

function PayPalLogo(): ReactNode {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#003087" d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" />
    </svg>
  );
}
