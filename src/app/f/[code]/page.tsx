import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFolderInvite, INVITE_STORE_LINK, type FolderInvite } from "@/lib/folderInvite";

// captioai.app/f/<code>: an invite to a shared folder in the app. With the app
// installed the link opens the app instead (universal link, see
// .well-known/apple-app-site-association). Without it, this page: who invited
// you to which folder, Get Captio AI, and the invite code to type in the app
// (Folders → "Got an invite code?"). Never indexed.

export const dynamic = "force-dynamic";
export const viewport: Viewport = { themeColor: "#F2F4F8" };

type Props = { params: Promise<{ code: string }> };

const normalize = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const invite = await getFolderInvite(normalize((await params).code));
  const title = invite ? `Join “${invite.name}” on Captio AI` : "Captio AI";
  const description = invite
    ? `${invite.inviter ?? "A friend"} invited you to a shared folder of live-caption recordings.`
    : "Live captions for every conversation.";
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website" },
  };
}

// The app's folder (FolderArt): a darker back with the tab, a lighter front.
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16) || 0;
  const target = amount > 0 ? 255 : 0;
  const a = Math.abs(amount);
  const mix = (c: number) => Math.round(c + (target - c) * a);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function Folder({ color }: { color: string }) {
  return (
    <svg width="132" height="112" viewBox="0 0 120 102" aria-hidden>
      <defs>
        <linearGradient id="back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, -0.02)} />
          <stop offset="1" stopColor={shade(color, -0.16)} />
        </linearGradient>
        <linearGradient id="front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, 0.36)} />
          <stop offset="0.12" stopColor={shade(color, 0.27)} />
          <stop offset="1" stopColor={shade(color, 0.16)} />
        </linearGradient>
      </defs>
      <path fill="url(#back)" d="M0 12C0 6.5 4.5 2 10 2H39C43 2 45.6 3.3 48.2 5.8L52 9.4C53.9 11.2 55.9 12 58.5 12H110C115.5 12 120 16.5 120 22V92C120 97.5 115.5 102 110 102H10C4.5 102 0 97.5 0 92Z" />
      <rect x="10" y="8" width="100" height="40" rx="4" fill="#fff" opacity="0.97" />
      <path fill="url(#front)" d="M0 31C0 24.4 5.4 19 12 19H108C114.6 19 120 24.4 120 31V88C120 94.6 114.6 100 108 100H12C5.4 100 0 94.6 0 88Z" />
      <path d="M12 20.2H108" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Header() {
  return (
    <div className="px-3 pt-3 sm:px-4 sm:pt-4">
      <header className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 rounded-xl bg-brand px-4 shadow-[0_6px_20px_rgba(28,73,245,0.25)] sm:h-16 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo_image_profile.png" alt="" width={36} height={36} className="rounded-full" priority />
          <Image src="/logo_text.png" alt="Captio AI" width={100} height={23} priority />
        </Link>
      </header>
    </div>
  );
}

function Invite({ invite, code }: { invite: FolderInvite; code: string }) {
  const who = invite.inviter ?? "A friend";
  const people = `${invite.members} ${invite.members === 1 ? "person" : "people"}`;
  const recordings = `${invite.recordings} ${invite.recordings === 1 ? "recording" : "recordings"}`;
  return (
    <article className="overflow-hidden rounded-3xl bg-white px-6 pb-8 pt-9 text-center shadow-sm ring-1 ring-black/5 sm:px-10">
      <div className="flex justify-center">
        <Folder color={invite.color ?? "#4DA8F7"} />
      </div>
      <p className="mt-5 text-[15px] text-gray-500">{who} invited you to</p>
      <h1 dir="auto" className="mt-1 text-3xl font-bold leading-tight text-gray-900">{invite.name}</h1>
      <p className="mt-2 text-[15px] text-gray-500">{people}, {recordings}</p>
      <p className="mx-auto mt-6 max-w-sm text-[16px] leading-relaxed text-gray-700">
        A shared folder in Captio AI, the app that turns conversations into live captions. Everyone in it sees every recording, and what you record there shows up for them too.
      </p>

      <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
        <a href={`captio://join/${code}`} className="rounded-lg bg-brand px-5 py-4 text-[17px] font-bold text-white">
          Open in Captio AI
        </a>
        <a href={INVITE_STORE_LINK} className="rounded-lg bg-[#F97316] px-5 py-4 text-[17px] font-bold text-white">
          Get Captio AI
        </a>
      </div>

      <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-gray-50 px-5 py-4 text-center">
        <p className="text-[13px] font-semibold tracking-[0.12em] text-gray-400">INVITE CODE</p>
        <p className="font-mono text-2xl font-bold tracking-[0.2em] text-gray-900">{code}</p>
      </div>
    </article>
  );
}

export default async function FolderInvitePage({ params }: Props) {
  const code = normalize((await params).code);
  const invite = await getFolderInvite(code);
  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      <Header />
      <div className="mx-auto max-w-xl px-3 pb-16 pt-5 sm:px-4 sm:pt-8">
        {invite ? (
          <Invite invite={invite} code={code} />
        ) : (
          <article className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-black/5">
            <h1 className="text-2xl font-bold text-gray-900">This invite doesn’t work anymore</h1>
            <p className="mt-3 text-[16px] text-gray-600">It may have been removed. Ask your friend for a new one.</p>
            <a href={INVITE_STORE_LINK} className="mt-8 inline-block rounded-lg bg-[#F97316] px-6 py-4 text-[17px] font-bold text-white">
              Get Captio AI
            </a>
          </article>
        )}
      </div>
    </main>
  );
}
