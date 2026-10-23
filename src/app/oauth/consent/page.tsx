import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { ConsentFlow } from "./ConsentFlow";

// captioai.app/oauth/consent?authorization_id=…: where Claude, ChatGPT or another
// chat app sends people to connect their Captio AI account (the /mcp
// connector). Supabase's OAuth server sends them here (Authentication → OAuth
// Server → Authorization Path, on top of the Site URL); they sign in with the
// account they use in the app, see what the chat app gets, and allow or deny.
// Never indexed.

export const dynamic = "force-dynamic";
export const viewport: Viewport = { themeColor: "#F2F4F8" };
export const metadata: Metadata = {
  title: { absolute: "Connect Captio AI" },
  description: "Connect your Captio AI recordings to your chat app.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ authorization_id?: string }> };

export default async function ConsentPage({ searchParams }: Props) {
  const authorizationId = (await searchParams).authorization_id ?? "";
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      <div className="sticky top-0 z-10 px-3 pt-3 sm:px-4 sm:pt-4">
        <header className="mx-auto flex h-14 max-w-xl items-center rounded-xl bg-brand px-4 shadow-[0_6px_20px_rgba(28,73,245,0.25)] sm:h-16 sm:px-5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo_image_profile.png" alt="" width={36} height={36} className="rounded-full sm:h-10 sm:w-10" priority />
            <Image src="/logo_text.png" alt="Captio AI" width={100} height={23} className="sm:w-[110px]" priority />
          </Link>
        </header>
      </div>
      <div className="mx-auto max-w-xl px-3 pb-16 pt-5 sm:px-4 sm:pt-8">
        <article className="overflow-hidden rounded-3xl bg-white px-6 pb-8 pt-9 text-center shadow-sm ring-1 ring-black/5 sm:px-10">
          {authorizationId && SUPABASE_URL && SUPABASE_ANON_KEY ? (
            <ConsentFlow authorizationId={authorizationId} supabaseUrl={SUPABASE_URL} anonKey={SUPABASE_ANON_KEY} />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">This link doesn&rsquo;t work</h1>
              <p className="mt-3 text-[16px] text-gray-600">Start connecting again from your chat app.</p>
            </>
          )}
        </article>
      </div>
    </main>
  );
}
