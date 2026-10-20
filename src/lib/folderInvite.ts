import { cache } from "react";

// A shared-folder invite from the app (Folders → Invite friends). Read through
// folder_invite_info() (app repo: supabase/folder_sharing.sql), which shows
// only the folder's look and name, the inviter's first name and how many
// people and recordings are in it — never the recordings themselves.

export type FolderInvite = {
  ok: true;
  folder_id: string;
  name: string;
  color: string | null;
  icon: string | null;
  inviter: string | null;
  members: number;
  recordings: number;
};

// App Store link tagged so App Store Connect counts installs from invites.
export const INVITE_STORE_LINK = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=folder_invite&mt=8";

export const getFolderInvite = cache(async (code: string): Promise<FolderInvite | null> => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !/^[A-Za-z0-9]{6,16}$/.test(code)) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/folder_invite_info`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_code: code }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.ok ? (data as FolderInvite) : null;
  } catch {
    return null;
  }
});
