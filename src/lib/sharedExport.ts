import { cache } from "react";

// A recording's captions or summary shared from the app (export sheet → Link).
// Stored in Supabase (app repo: supabase/shared_exports.sql) and read only
// through get_shared_export(). The words around the content (labels) come
// from the app in the sharer's language, so this site needs no translations.

export type CaptionBlock = { speaker: string; color: string | null; text: string; original?: string };
export type SummaryBlock =
  | { type: "header" | "subheader" | "paragraph" | "bullet"; text: string }
  | { type: "numbered"; text: string; n: number }
  | { type: "todo"; text: string; done: boolean }
  | { type: "quote"; text: string; speaker?: string };

export type ReaderExports = { text: string; emailSubject: string; emailBody: string; chat: string };

export type SharedExport = {
  id: string;
  what: "captions" | "summary";
  lang: string;
  title: string;
  emoji: string;
  // exports: the app's Text, Email and Chat versions, ready-made in the
  // sharer's language, for the page's Export button (links shared before it
  // existed have none, and get no button).
  content: { blocks: CaptionBlock[] | SummaryBlock[]; exports?: ReaderExports };
  labels: {
    kind: string; chips: string[]; getApp: string; madeWith: string; scan: string; dir: "ltr" | "rtl";
    exportButton?: string; text?: string; pdf?: string; email?: string; chat?: string; copied?: string;
  };
  updated_at: string;
};

// App Store link tagged so App Store Connect counts installs from share links.
export const STORE_LINK = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=share_link&mt=8";

// One read per request (the page and its metadata share it); `count` adds a
// view, the preview image doesn't.
export const getSharedExport = cache(async (id: string, count = true): Promise<SharedExport | null> => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !/^[A-Za-z0-9]{6,32}$/.test(id)) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_shared_export`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_id: id, p_count: count }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as SharedExport | null;
  } catch {
    return null;
  }
});

// Plain text of the content, for the link preview's description.
export function previewText(s: SharedExport, max = 160): string {
  const text = (s.content.blocks as { text: string }[]).map(b => b.text).join(" ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
