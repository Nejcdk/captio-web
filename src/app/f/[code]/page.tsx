import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFolderInvite, type FolderInvite } from "@/lib/folderInvite";
import { GetAppHeader, InviteViewed, OpenInApp } from "./InviteActions";
import { JoinWithAccount } from "./JoinWithAccount";

// captioai.app/f/<code>: an invite to a shared folder in the app. With the app
// installed the link opens the app instead (universal link, see
// .well-known/apple-app-site-association), and in Safari Apple's banner offers
// "Open" with the invite. Without the app, this page: who invited you to which
// folder, "Open in Captio AI" (the app if it's there, else the App Store),
// "Continue with Google/Apple" to join now and find the folder waiting in the
// app after signing in with the same account (JoinWithAccount.tsx), and the
// code. Both buttons put the invite on the clipboard first, so the app can
// join the folder by itself after it's installed (InviteActions.tsx).
// Never indexed.

export const dynamic = "force-dynamic";
export const viewport: Viewport = { themeColor: "#F2F4F8" };

type Props = { params: Promise<{ code: string }> };

const normalize = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = normalize((await params).code);
  const invite = await getFolderInvite(code);
  const ok = invite && invite !== "error" ? invite : null;
  const title = ok ? `Join “${ok.name}” on Captio AI` : "Captio AI";
  const description = ok
    ? `${ok.inviter ?? "A friend"} invited you to a shared folder of live-caption recordings.`
    : "Live captions for every conversation.";
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website" },
    // Safari's Smart App Banner: "Open" hands the app this link, "Get" the App Store.
    itunes: { appId: "6796617180", appArgument: `captio://join/${code}` },
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

// Sticky like the shared-recording page: the logo and the one way to the app.
function Header({ code }: { code: string | null }) {
  return (
    <div className="sticky top-0 z-10 px-3 pt-3 sm:px-4 sm:pt-4">
      <header className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 rounded-xl bg-brand px-4 shadow-[0_6px_20px_rgba(28,73,245,0.25)] sm:h-16 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo_image_profile.png" alt="" width={36} height={36} className="rounded-full sm:h-10 sm:w-10" priority />
          <Image src="/logo_text.png" alt="Captio AI" width={100} height={23} className="sm:w-[110px]" priority />
        </Link>
        <GetAppHeader code={code} />
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

      {/* One way in: join with the account they'll use in the app. People who
          already have the app mostly never see this page (the link opens the
          app), so opening it is only a quiet link. */}
      <div className="mx-auto mt-8 max-w-sm">
        {process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? (
          <JoinWithAccount code={code} folderName={invite.name} supabaseUrl={process.env.SUPABASE_URL} anonKey={process.env.SUPABASE_ANON_KEY} />
        ) : (
          <OpenInApp code={code} variant="button" />
        )}
      </div>
    </article>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-black/5">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-3 text-[16px] text-gray-600">{body}</p>
    </article>
  );
}

export default async function FolderInvitePage({ params }: Props) {
  const code = normalize((await params).code);
  const invite = await getFolderInvite(code);
  const ok = invite && invite !== "error" ? invite : null;
  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      <Header code={ok ? code : null} />
      <InviteViewed valid={!!ok} error={invite === "error"} members={ok?.members} recordings={ok?.recordings} hasInviter={!!ok?.inviter} />
      <div className="mx-auto max-w-xl px-3 pb-16 pt-5 sm:px-4 sm:pt-8">
        {ok ? (
          <>
            <Invite invite={ok} code={code} />
            <div className="mt-5 flex flex-col items-center gap-2 text-[14px] text-gray-500">
              <OpenInApp code={code} variant="link" />
              <p>
                Invite code <span className="font-mono font-semibold tracking-wider text-gray-700">{code}</span>
              </p>
            </div>
          </>
        ) : invite === "error" ? (
          <Message title="Couldn’t load this invite" body="Please try again in a moment." />
        ) : (
          <Message title="This invite doesn’t work anymore" body="It may have been removed. Ask your friend for a new one." />
        )}
      </div>
    </main>
  );
}
