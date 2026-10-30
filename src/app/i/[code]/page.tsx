import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyCode, GetApp, GetAppHeader, PageViewed } from "./ReferralActions";

// captioai.app/i/<code>: someone's personal invite link from the app (Settings
// → Referral program). One link for one friend or a whole group: everyone who
// comes through it counts for the person who shared it. With the app installed
// the link opens the app instead (universal link, see
// .well-known/apple-app-site-association). Without it, this page says what they
// get, and the button puts the link on the clipboard before going to the store,
// so the app can apply the invite by itself after the first sign-in
// (src/lib/folderSharing.ts in the app repo). The code, with a copy button, sits
// right above the button as the backup.
// No name on the page: these links get posted publicly. Never indexed.

export const viewport: Viewport = { themeColor: "#F2F4F8" };

type Props = { params: Promise<{ code: string }> };

const normalize = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = normalize((await params).code);
  const title = "You've been invited to Captio AI";
  const description = "Get 1 week of Plus, free. Live captions for any conversation, on your phone.";
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website" },
    // Safari's Smart App Banner: "Open" hands the app this link, "Get" the App Store.
    itunes: { appId: "6796617180", appArgument: `captio://invite/${code}` },
  };
}

export default async function ReferralPage({ params }: Props) {
  const code = normalize((await params).code);
  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      <PageViewed />
      <div className="sticky top-0 z-10 px-3 pt-3 sm:px-4 sm:pt-4">
        <header className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 rounded-xl bg-brand px-4 shadow-[0_4px_16px_rgba(28,73,245,0.25)]">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo_image_profile.png" alt="" width={36} height={36} className="rounded-full" priority />
            <Image src="/logo_text.png" alt="Captio AI" width={100} height={23} priority />
          </Link>
          <GetAppHeader code={code} />
        </header>
      </div>
      <div className="mx-auto max-w-xl px-3 pb-16 pt-5 sm:px-4 sm:pt-8">
        <article className="rounded-3xl bg-white px-6 pb-8 pt-8 text-center shadow-sm ring-1 ring-black/5 sm:px-10">
          <div className="flex justify-center">
            <Image src="/owl-gift.png" alt="" width={168} height={168} priority />
          </div>
          <p className="mt-4 text-[15px] font-medium text-gray-500">You&apos;ve been invited</p>
          <h1 className="mt-1 text-[32px] font-bold leading-tight text-gray-900">1 week of Plus, free</h1>
          <p className="mx-auto mt-3 max-w-sm text-[16px] leading-snug text-gray-600">
            Captio AI turns any conversation into live captions on your phone.
          </p>
          <div className="mx-auto mt-6 max-w-sm">
            {code && <CopyCode code={code} />}
            <div className="mt-3">
              <GetApp code={code} />
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-sm text-[14px] leading-snug text-gray-500">
            When the app asks to paste, tap Allow Paste and your invite is applied by itself.
          </p>
        </article>
      </div>
    </main>
  );
}
