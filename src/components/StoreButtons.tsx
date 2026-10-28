import Image from "next/image";
import en from "@/i18n/messages/en.json";
import type { Messages } from "@/i18n";

// Store links behind every download button and QR code on the site.
// (Canonical listings for schema/llms.txt live in src/lib/schema.ts.)
export const APP_STORE_LINK = "https://apps.apple.com/si/app/captio-ai/id6796617180";
export const GOOGLE_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.captio.app&hl=en";

type Size = "md" | "sm";

/** The buttons' words; English unless a translated page passes its own. */
type StoreLabels = Messages["store"];

const AppleLogo = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
  </svg>
);

const PlayLogo = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
  </svg>
);

const STORES = {
  apple: {
    href: APP_STORE_LINK,
    Logo: AppleLogo,
    overline: "appleOverline",
    name: "App Store",
    qr: "/qr-appstore.png",
    qrAlt: "appleQrAlt",
  },
  google: {
    href: GOOGLE_PLAY_LINK,
    Logo: PlayLogo,
    overline: "googleOverline",
    name: "Google Play",
    qr: "/qr-googleplay.png",
    qrAlt: "googleQrAlt",
  },
} as const;

type Store = keyof typeof STORES;

/** One orange store button. Both stores share a fixed width so they read as a pair. */
export function StoreButton({ store, size = "md", fill = false, t = en.store }: { store: Store; size?: Size; fill?: boolean; t?: StoreLabels }) {
  const s = STORES[store];
  const width = fill ? "w-full" : size === "sm" ? "w-[152px]" : "w-[156px] sm:w-[200px]";
  const box = size === "sm" ? "px-3 py-3 gap-2.5" : "px-3 py-3 gap-2.5 sm:px-5 sm:py-4 sm:gap-3";
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center bg-cta text-white font-semibold rounded-[8px] hover:bg-cta-dark transition-colors ${width} ${box}`}
    >
      <s.Logo className={size === "sm" ? "w-5 h-5 shrink-0" : "w-5 h-5 sm:w-6 sm:h-6 shrink-0"} />
      <span className="text-start whitespace-nowrap">
        <span className={`block font-normal opacity-75 leading-none mb-1 ${size === "sm" ? "text-[10px]" : "text-[10px] sm:text-xs"}`}>
          {t[s.overline]}
        </span>
        <span className={`block font-bold leading-none ${size === "sm" ? "text-[15px]" : "text-[15px] sm:text-lg"}`}>{s.name}</span>
      </span>
    </a>
  );
}

/** App Store + Google Play side by side; wraps to two rows on very narrow screens. */
export function StoreButtons({ size = "md", stacked = false, t }: { size?: Size; stacked?: boolean; t?: StoreLabels }) {
  return (
    <div className={stacked ? "flex flex-col gap-2" : "flex flex-wrap justify-center gap-2 sm:gap-3"}>
      <StoreButton store="apple" size={size} t={t} />
      <StoreButton store="google" size={size} t={t} />
    </div>
  );
}

/**
 * Buttons with a QR code above each one from `sm` up (a computer visitor scans
 * with their phone); on a phone the QR codes are hidden and only the buttons show.
 */
export function StoreQrButtons({ t = en.store }: { t?: StoreLabels }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
      {(Object.keys(STORES) as Store[]).map((store) => (
        <div key={store} className="flex flex-col items-center gap-4">
          <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
            <Image src={STORES[store].qr} alt={t[STORES[store].qrAlt]} width={112} height={112} className="w-28 h-28 rounded-lg" />
          </div>
          <StoreButton store={store} t={t} />
        </div>
      ))}
    </div>
  );
}

/**
 * The download card used in heroes and at the bottom of pages. A white card on
 * computers with both QR codes; on phones just the label and the two buttons.
 */
export function DownloadCard({ id, className = "", t = en.store }: { id?: string; className?: string; t?: StoreLabels }) {
  return (
    <div
      id={id}
      className={`flex flex-col items-center gap-3 sm:gap-5 sm:bg-white sm:rounded-xl sm:border sm:border-gray-100 sm:shadow-sm sm:px-10 sm:py-7 ${className}`}
    >
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{t.downloadForFree}</p>
      <StoreQrButtons t={t} />
    </div>
  );
}

/** Two small QR codes for tight spots (the blog sidebar), each captioned with its store. */
export function StoreQrPair({ onDark = false }: { onDark?: boolean }) {
  const t = en.store;
  return (
    <div className="flex gap-3">
      {(Object.keys(STORES) as Store[]).map((store) => (
        <div key={store} className="flex flex-col items-center gap-2">
          <div className="p-2 bg-white rounded-xl">
            <Image src={STORES[store].qr} alt={t[STORES[store].qrAlt]} width={80} height={80} className="w-20 h-20 rounded-md" />
          </div>
          <span className={`text-[11px] font-semibold ${onDark ? "text-blue-100" : "text-gray-500"}`}>
            {store === "apple" ? "iPhone" : "Android"}
          </span>
        </div>
      ))}
    </div>
  );
}
