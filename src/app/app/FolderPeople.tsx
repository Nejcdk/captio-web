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
import { t } from "./i18n";
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
    const ok = await confirmCard({ title: t("folders.removeTitle", { name }), body: t("folders.removeBody"), confirm: t("folders.removeConfirm"), destructive: true });
    if (!ok) return;
    setBusy(userId);
    const done = await removeMember(folder, userId);
    setBusy(null);
    if (!done) showErrorAlert({ where: "folder_remove_member", error: "failed", title: t("folders.removeFailed"), body: t("folders.inviteFailedBody") });
  };

  const leave = async () => {
    const ok = await confirmCard({
      title: t("folders.leaveTitle", { folder: folder.name }),
      body: t("folders.leaveBody"),
      confirm: t("folders.leaveConfirm"),
      destructive: true,
    });
    if (!ok) return;
    setBusy("leave");
    const done = await leaveFolder(folder);
    setBusy(null);
    if (!done) { showErrorAlert({ where: "folder_leave", error: "failed", title: t("folders.leaveFailed"), body: t("folders.inviteFailedBody") }); return; }
    close();
    editContext().openFolder(null);
  };

  const remove_folder = async () => {
    const ok = await confirmCard({
      title: t("folders.deleteTitle"),
      body: isSharedFolder(library, folder.id) ? t("folders.deleteSharedBody") : t("folders.deleteBody"),
      confirm: t("common.delete"),
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteFolder(folder);
      close();
      editContext().openFolder(null);
    } catch (e) {
      showErrorAlert({ where: "folder_delete", error: e, body: t("folders.inviteFailedBody") });
    }
  };

  return (
    <SheetCard onClose={close}>
      <div className="es-top">
        <span className="es-title fp-name">{folder.name}</span>
        <CloseButton onPress={close} />
      </div>
      <div className="es-section" style={{ marginTop: 4 }}>{t("folders.people")}</div>
      <div className="fp-group">
        {list.map(p => {
          const isMe = p.userId === me;
          const name = isMe ? t("folders.you") : p.name || t("folders.someone");
          const isOwner = p.userId === folder.ownerId || (!folder.ownerId && isMe);
          return (
            <div key={p.userId} className="fp-person">
              <span className="fp-person-name">{name}</span>
              {isOwner && <span className="fp-role">{t("folders.owner")}</span>}
              {mine && !isMe && !isOwner && (
                <button type="button" className="es-icon-btn" onClick={() => void remove(p.userId, name)} disabled={!!busy} aria-label={t("folders.removeTitle", { name })}>
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
          label={busy === "invite" ? t("common.pleaseWait") : t("folders.invite")}
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
            label={t("folders.editFolder")}
            onPress={() => { close(); setTimeout(() => openFolderEditor({ folder }), 0); }}
          />
        )}
        {mine ? (
          <OptionTile icon={<TrashIcon size={22} color="var(--destructive)" />} label={t("folders.delete")} color="var(--destructive)" onPress={() => void remove_folder()} />
        ) : (
          <OptionTile
            icon={<LogOutIcon size={22} color="var(--destructive)" />}
            label={busy === "leave" ? t("common.pleaseWait") : t("folders.leave")}
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
  t("folders.inviteMessage", { folder, link: inviteLink(code), code });

// The app's invite: makes this account's code for the folder, then the share
// sheet where the browser has one, else a card with the link to copy.
export async function inviteToFolder(folder: Folder, from: "folder" | "people"): Promise<void> {
  if (isGuest()) { needsAccount("share_folder"); return; }
  const result = await createInvite(folder, from);
  if (!result.ok) {
    showErrorAlert({ where: "folder_invite", error: "failed", title: t("folders.inviteFailed"), body: t("folders.inviteFailedBody") });
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
  const [codeBefore = "", codeAfter = ""] = t("web.folders.inviteCode").split(/\{\{\s*code\s*\}\}/);
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
    <ModalCard title={t("folders.invite")} body={t("web.folders.inviteCardBody", { folder: folder.name })} onClose={() => { if (!copied) capture("folder_invite_shared", { from, shared: false }); close(); }}>
      <button type="button" className="fp-link" onClick={() => void copy()}>
        <span>{inviteLink(code)}</span>
        {copied ? <CopyCheckIcon size={20} color="var(--brand)" /> : <CopyIcon size={20} color="var(--brand)" />}
      </button>
      {/* The code in bold, wherever the language puts it in the line. */}
      <div className="fp-code">{codeBefore}<b>{code}</b>{codeAfter}</div>
      <Button label={copied ? t("export.copied") : t("web.folders.copyInvite")} size="compact" onPress={() => void copy()} />
      <QuietButton label={t("voices.done")} onPress={close} />
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
          <ModalCard
            title={result.name ? t("folders.joinedTitle", { folder: result.name }) : t("web.folders.joinedTitleNoName")}
            body={t("folders.joinedBody")}
            onClose={done}
          >
            <Button label={t("folders.sortedOk")} size="compact" onPress={done} />
          </ModalCard>
        ));
      }
      return;
    }
    if (result.error === "invalid_code" || result.error === "folder_full") {
      const invalid = result.error === "invalid_code";
      showCard(done => (
        <ModalCard
          title={invalid ? t("folders.joinInvalidTitle") : t("folders.joinFullTitle")}
          body={invalid ? t("folders.joinInvalidBody") : t("folders.joinFullBody")}
          onClose={done}
        >
          <Button label={t("common.close")} size="compact" onPress={done} />
        </ModalCard>
      ));
      return;
    }
    showErrorAlert({ where: "folder_join", error: "failed", title: t("folders.joinFailed"), body: t("folders.inviteFailedBody") });
  };
  return (
    <ModalCard title={t("folders.joinTitle")} body={t("folders.joinBody")} onClose={close}>
      <input
        className="es-input fp-join-input"
        value={code}
        autoFocus
        maxLength={12}
        autoCapitalize="characters"
        onChange={e => setCode(e.target.value.toUpperCase())}
        onKeyDown={e => { if (e.key === "Enter") void join(); }}
        aria-label={t("web.folders.inviteCodeLabel")}
      />
      <Button label={t("folders.joinConfirm")} size="compact" loading={busy} disabled={!normalizeCode(code)} onPress={() => void join()} style={{ marginTop: 12 }} />
      <QuietButton label={t("common.cancel")} onPress={close} />
    </ModalCard>
  );
}

