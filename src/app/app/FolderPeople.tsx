"use client";

import { useState } from "react";
import "./folders.css";
import { capture, isGuest, needsAccount } from "./client";
import type { Folder } from "./data";
import { CopyCheckIcon, CopyIcon, LogOutIcon, TrashIcon, XIcon } from "./Icons";
import { PencilIcon } from "./editIcons";
import { OptionTile, SheetCard } from "./sheet";
import { Button, CloseButton, ModalCard, QuietButton, confirmCard, showCard, showErrorAlert } from "./ui";
import { openFolderEditor } from "./FolderEditor";
import {
  createInvite, deleteFolder, editContext, inviteLink, isSharedFolder, joinFolder, leaveFolder, normalizeCode, ownsFolder,
  removeMember,
} from "./folders";

// A folder's settings (app repo: FolderPeopleScreen.tsx, the gear on its
// page): who's in it, 👋 Add members, and for its owner Edit folder, Delete
// folder and taking people out; for everyone else, Leave folder. Plus the
// app's invite (folderSharing.ts) and "Got an invite code?" join.

export function openFolderPeople(folder: Folder) {
  showCard(close => <FolderPeople folder={folder} close={close} />);
}

function FolderPeople({ folder, close }: { folder: Folder; close: () => void }) {
  const { library, me } = editContext();
  const [busy, setBusy] = useState<string | null>(null);
  const mine = ownsFolder(folder, me);
  const people = (library?.people ?? []).filter(p => p.folderId === folder.id);
  const byId = new Map(people.map(p => [p.userId, p]));
  // Not shared yet (or not synced): just you.
  const list = byId.size > 0
    ? [...byId.values()].sort((a, b) => (a.userId === folder.ownerId ? -1 : b.userId === folder.ownerId ? 1 : 0))
    : [{ folderId: folder.id, userId: me, name: "" }];

  const remove = async (userId: string, name: string) => {
    const ok = await confirmCard({ title: `Remove ${name}?`, body: "Their recordings leave the folder with them.", confirm: "Remove", destructive: true });
    if (!ok) return;
    setBusy(userId);
    const done = await removeMember(folder, userId);
    setBusy(null);
    if (!done) showErrorAlert({ where: "folder_remove_member", error: "failed", title: "Couldn't remove them", body: "Check your connection and try again." });
  };

  const leave = async () => {
    const ok = await confirmCard({
      title: `Leave ${folder.name}?`,
      body: "Your recordings in it go back to All transcripts, and you won't see the others' anymore.",
      confirm: "Leave",
      destructive: true,
    });
    if (!ok) return;
    setBusy("leave");
    const done = await leaveFolder(folder);
    setBusy(null);
    if (!done) { showErrorAlert({ where: "folder_leave", error: "failed", title: "Couldn't leave the folder", body: "Check your connection and try again." }); return; }
    close();
    editContext().openFolder(null);
  };

  const remove_folder = async () => {
    const ok = await confirmCard({
      title: "Delete folder?",
      body: isSharedFolder(library, folder.id) ? "Everyone in it loses it. Recordings stay with whoever made them." : "Its recordings stay in All transcripts.",
      confirm: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteFolder(folder);
      close();
      editContext().openFolder(null);
    } catch (e) {
      showErrorAlert({ where: "folder_delete", error: e, body: "Check your connection and try again." });
    }
  };

  return (
    <SheetCard onClose={close}>
      <div className="es-top">
        <span className="es-title fp-name">{folder.name}</span>
        <CloseButton onPress={close} />
      </div>
      <div className="es-section" style={{ marginTop: 4 }}>PEOPLE</div>
      <div className="fp-group">
        {list.map(p => {
          const isMe = p.userId === me;
          const name = isMe ? "You" : p.name || "Someone";
          const isOwner = p.userId === folder.ownerId || (!folder.ownerId && isMe);
          return (
            <div key={p.userId} className="fp-person">
              <span className="fp-person-name">{name}</span>
              {isOwner && <span className="fp-role">Owner</span>}
              {mine && !isMe && !isOwner && (
                <button type="button" className="es-icon-btn" onClick={() => void remove(p.userId, name)} disabled={!!busy} aria-label={`Remove ${name}?`}>
                  <XIcon size={18} color="var(--ink-meta)" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="es-options" style={{ marginTop: 20 }}>
        <OptionTile
          icon={<span style={{ fontSize: 20 }}>👋</span>}
          label={busy === "invite" ? "Please wait…" : "Add members"}
          disabled={!!busy}
          onPress={async () => {
            setBusy("invite");
            await inviteToFolder(folder, "people");
            setBusy(null);
          }}
        />
        {mine && (
          <OptionTile
            icon={<PencilIcon size={22} color="#8430CE" />}
            label="Edit folder"
            onPress={() => { close(); setTimeout(() => openFolderEditor({ folder }), 0); }}
          />
        )}
        {mine ? (
          <OptionTile icon={<TrashIcon size={22} color="var(--destructive)" />} label="Delete folder" color="var(--destructive)" onPress={() => void remove_folder()} />
        ) : (
          <OptionTile
            icon={<LogOutIcon size={22} color="var(--destructive)" />}
            label={busy === "leave" ? "Please wait…" : "Leave folder"}
            color="var(--destructive)"
            disabled={!!busy}
            onPress={() => void leave()}
          />
        )}
      </div>
    </SheetCard>
  );
}

// ─── Inviting ─────────────────────────────────────────────────────────────────

const inviteMessage = (folder: string, code: string) =>
  `Join my folder “${folder}” on Captio AI, so we see each other's recordings: ${inviteLink(code)}\n\nInvite code: ${code}`;

// The app's invite: makes this account's code for the folder, then the share
// sheet where the browser has one, else a card with the link to copy.
export async function inviteToFolder(folder: Folder, from: "folder" | "people"): Promise<void> {
  if (isGuest()) { needsAccount("share_folder"); return; }
  const result = await createInvite(folder, from);
  if (!result.ok) {
    showErrorAlert({ where: "folder_invite", error: "failed", title: "Couldn't make an invite", body: "Check your connection and try again." });
    return;
  }
  const text = inviteMessage(folder.name, result.code);
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text });
      capture("folder_invite_shared", { from, shared: true });
      return;
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") {
        capture("folder_invite_shared", { from, shared: false });
        return;
      }
      // Not allowed here (some browsers): the card below.
    }
  }
  showCard(close => <InviteCard folder={folder} code={result.code} text={text} from={from} close={close} />);
}

function InviteCard({ folder, code, text, from, close }: { folder: Folder; code: string; text: string; from: string; close: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      capture("folder_invite_shared", { from, shared: true, activity: "copy" });
    } catch {
      capture("folder_invite_shared", { from, shared: false, activity: "copy_failed" });
    }
  };
  return (
    <ModalCard title="Add members" body={`Send this to the people you want in “${folder.name}”.`} onClose={() => { if (!copied) capture("folder_invite_shared", { from, shared: false }); close(); }}>
      <button type="button" className="fp-link" onClick={() => void copy()}>
        <span>{inviteLink(code)}</span>
        {copied ? <CopyCheckIcon size={20} color="var(--brand)" /> : <CopyIcon size={20} color="var(--brand)" />}
      </button>
      <div className="fp-code">Invite code: <b>{code}</b></div>
      <Button label={copied ? "Copied" : "Copy invite"} size="compact" onPress={() => void copy()} />
      <QuietButton label="Done" onPress={close} />
    </ModalCard>
  );
}

// ─── Joining ("Got an invite code?") ──────────────────────────────────────────

export function openJoinFolder() {
  if (isGuest()) { needsAccount("join_folder"); return; }
  capture("folder_join_code_opened");
  showCard(close => <JoinCard close={close} />);
}

function JoinCard({ close }: { close: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const join = async () => {
    if (!normalizeCode(code) || busy) return;
    setBusy(true);
    const result = await joinFolder(code, "code").catch(() => ({ ok: false as const, error: "failed" as const }));
    setBusy(false);
    close();
    if (result.ok) {
      editContext().openFolder(result.folderId);
      if (!result.already) {
        capture("folder_joined_card_shown");
        showCard(done => (
          <ModalCard title={`You joined ${result.name || "the folder"}`} body="Recordings anyone saves here show up for everyone in it." onClose={done}>
            <Button label="Got it" size="compact" onPress={done} />
          </ModalCard>
        ));
      }
      return;
    }
    if (result.error === "invalid_code" || result.error === "folder_full") {
      const invalid = result.error === "invalid_code";
      showCard(done => (
        <ModalCard
          title={invalid ? "This invite doesn't work" : "This folder is full"}
          body={invalid ? "It may have been removed. Ask for a new one." : "A folder can have up to 30 people."}
          onClose={done}
        >
          <Button label="Close" size="compact" onPress={done} />
        </ModalCard>
      ));
      return;
    }
    showErrorAlert({ where: "folder_join", error: "failed", title: "Couldn't join the folder", body: "Check your connection and try again." });
  };
  return (
    <ModalCard title="Join a folder" body="Enter the code from your invite." onClose={close}>
      <input
        className="es-input fp-join-input"
        value={code}
        autoFocus
        maxLength={12}
        autoCapitalize="characters"
        onChange={e => setCode(e.target.value.toUpperCase())}
        onKeyDown={e => { if (e.key === "Enter") void join(); }}
        aria-label="Invite code"
      />
      <Button label="Join" size="compact" loading={busy} disabled={!normalizeCode(code)} onPress={() => void join()} style={{ marginTop: 12 }} />
      <QuietButton label="Cancel" onPress={close} />
    </ModalCard>
  );
}

