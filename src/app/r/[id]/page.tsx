import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSharedExport, previewText, STORE_LINK,
  type CaptionBlock, type SharedExport, type SummaryBlock,
} from "@/lib/sharedExport";

// captioai.app/r/<id>: a recording's captions or summary, shared from the app
// (export sheet → Link). Same look as the app's export email: brand header,
// a card with what this is and the content, under a sticky header with the
// one way to get the app. Never indexed; works until the recording or the
// account is deleted.

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shared = await getSharedExport((await params).id);
  if (!shared) return { title: { absolute: "Captio AI" }, robots: { index: false, follow: false } };
  const title = `${shared.emoji} ${shared.title}`;
  const description = previewText(shared);
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "article", url: `/r/${shared.id}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function Captions({ blocks }: { blocks: CaptionBlock[] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        const color = b.color ?? "#6F7280";
        const label = b.speaker && b.speaker !== blocks[i - 1]?.speaker;
        return (
          <div key={i}>
            {label && (
              <div className="mt-6 mb-1.5 first:mt-0">
                <span
                  className="inline-block rounded-md px-2.5 py-0.5 text-xs font-bold tracking-wide"
                  style={{ color, background: rgba(color, 0.1) }}
                >
                  {b.speaker}
                </span>
              </div>
            )}
            <p dir="auto" className="my-1.5 text-[17px] leading-relaxed text-gray-900">{b.text}</p>
            {b.original && (
              <p dir="auto" className="mb-2 text-[15px] italic leading-relaxed text-gray-400">{b.original}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Summary({ blocks }: { blocks: SummaryBlock[] }) {
  // Consecutive bullets / numbers become one list.
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "bullet" || b.type === "numbered") {
      const items: SummaryBlock[] = [];
      while (i < blocks.length && blocks[i].type === b.type) items.push(blocks[i++]);
      i--;
      const List = b.type === "bullet" ? "ul" : "ol";
      out.push(
        <List key={i} dir="auto" className={`my-2 ps-6 space-y-1.5 text-[17px] leading-relaxed text-gray-900 ${b.type === "bullet" ? "list-disc" : "list-decimal"}`}>
          {items.map((it, k) => <li key={k}>{it.text}</li>)}
        </List>,
      );
    } else if (b.type === "header") {
      out.push(<h2 key={i} dir="auto" className="mt-7 mb-2 text-xl font-bold text-brand first:mt-0">{b.text}</h2>);
    } else if (b.type === "subheader") {
      out.push(<h3 key={i} dir="auto" className="mt-5 mb-1.5 text-[17px] font-bold text-gray-900">{b.text}</h3>);
    } else if (b.type === "paragraph") {
      out.push(<p key={i} dir="auto" className="my-2 text-[17px] leading-relaxed text-gray-900">{b.text}</p>);
    } else if (b.type === "todo") {
      out.push(
        <p key={i} dir="auto" className="my-2 flex items-start gap-2.5 text-[17px] leading-relaxed text-gray-900">
          <span
            className={`mt-1 inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px] border-2 text-[11px] text-white ${b.done ? "border-brand bg-brand" : "border-gray-300"}`}
          >
            {b.done ? "✓" : ""}
          </span>
          <span className={b.done ? "text-gray-400 line-through" : ""}>{b.text}</span>
        </p>,
      );
    } else if (b.type === "quote") {
      out.push(
        <blockquote key={i} dir="auto" className="my-4 border-s-[3px] border-brand/25 ps-4 text-[17px] italic leading-relaxed text-gray-700">
          {b.text}
          {b.speaker && <span className="mt-1 block text-sm not-italic text-gray-500">— {b.speaker}</span>}
        </blockquote>,
      );
    }
  }
  return <div>{out}</div>;
}

function GetApp({ shared, className = "" }: { shared: SharedExport; className?: string }) {
  return (
    <a
      href={STORE_LINK}
      className={`inline-flex items-center justify-center rounded-[10px] bg-brand font-semibold text-white transition-colors hover:bg-brand-dark ${className}`}
    >
      {shared.labels.getApp}
    </a>
  );
}

export default async function SharedPage({ params }: Props) {
  const shared = await getSharedExport((await params).id);
  if (!shared) notFound();
  const { labels } = shared;

  return (
    <main dir={labels.dir} lang={shared.lang} className="min-h-screen bg-[#F2F4F8]">
      {/* Sticky: the logo and the one way to the app stay in view. */}
      <header className="sticky top-0 z-10 border-b border-black/5 bg-[#F2F4F8]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5" dir="ltr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-[10px]" />
            <span className="text-lg font-bold text-gray-900">Captio AI</span>
          </Link>
          <GetApp shared={shared} className="px-4 py-2.5 text-sm" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:py-8">
        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-gray-100 px-6 pb-6 pt-8 sm:px-10">
            <div className="text-[11px] font-bold tracking-[0.12em] text-brand">{labels.kind}</div>
            <h1 dir="auto" className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {shared.emoji} {shared.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {labels.chips.map(c => {
                // "📅 11 October": the emoji gets its own room.
                const [icon, ...rest] = c.split(" ");
                return (
                  <span key={c} className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-[13px] text-gray-600">
                    <span>{icon}</span>
                    <span>{rest.join(" ")}</span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="px-6 py-7 sm:px-10">
            {shared.what === "summary"
              ? <Summary blocks={shared.content.blocks as SummaryBlock[]} />
              : <Captions blocks={shared.content.blocks as CaptionBlock[]} />}
          </div>
        </article>
      </div>
    </main>
  );
}
