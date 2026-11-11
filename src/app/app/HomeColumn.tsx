import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./folders.css";
import type { Folder, Library, Recording } from "./data";
import { FolderArt } from "./FolderArt";
import { formatDateTime, personName } from "./format";
import { ChevronLeftIcon, CircleXIcon, SearchIcon, SettingsIcon, WifiOffIcon } from "./Icons";
import { DotsIcon } from "./editIcons";
import { openEditSheet } from "./editSheet";
import { openFolderEditor } from "./FolderEditor";
import { inviteToFolder, openFolderPeople, openJoinFolder } from "./FolderPeople";
import { applyChanges, membersOf, reorderFolders, setEditContext, useFolderChanges } from "./folders";

// The left column is the phone's Home: "All transcripts | Folders" (the
// segmented control), the search and the list, or the folders two to a row
// (hold and drag to reorder, the dashed New folder tile last, "Got an invite
// code?" under them); a folder opens its own page here (gear = its People
// sheet, 👋 Add members above the record button). ⋯ on a row, a right-click,
// or holding a row on a touch screen opens the edit sheet. The recording
// opens on the right.

export type HomeTab = "all" | "folders";

// The dashed folder outline of the New folder tile (FolderArt's back).
const FOLDER_BACK = "M0 12C0 6.5 4.5 2 10 2H39C43 2 45.6 3.3 48.2 5.8L52 9.4C53.9 11.2 55.9 12 58.5 12H110C115.5 12 120 16.5 120 22V92C120 97.5 115.5 102 110 102H10C4.5 102 0 97.5 0 92Z";

export function HomeColumn({
  tab, onTab, folder, onFolder, library: loaded, recordings: listed, selectedId, query, onQuery, onOpen, error, onRetry, me, dock, offline, notice,
}: {
  tab: HomeTab;
  onTab: (tab: HomeTab) => void;
  folder: Folder | null;
  onFolder: (id: string | null) => void;
  library: Library | null;
  recordings: Recording[];
  selectedId: string | null;
  query: string;
  onQuery: (q: string) => void;
  onOpen: (id: string) => void;
  error: boolean;
  onRetry: () => void;
  me: string;
  dock: ReactNode;
  offline: boolean;
  // Above the list (a guest's "only saved in this browser").
  notice?: ReactNode;
}) {
  // Changes made here that the list hasn't read back yet (the dev preview,
  // the Welcome folder's settings, this browser's folder order).
  const changes = useFolderChanges();
  const library = useMemo(() => applyChanges(loaded), [loaded, changes]); // eslint-disable-line react-hooks/exhaustive-deps
  const shownFolder = folder ? library?.folders.find(f => f.id === folder.id) ?? null : null;
  const recordings = useMemo(() => {
    const byId = new Map((library?.recordings ?? []).map(r => [r.id, r]));
    return listed
      .map(r => byId.get(r.id))
      .filter((r): r is Recording => !!r && (!shownFolder || r.folderId === shownFolder.id));
  }, [listed, library, shownFolder]);

  // What the edit sheet and the folder sheets see, wherever they're opened.
  useEffect(() => {
    setEditContext({
      library,
      me,
      openFolder: id => {
        if (id) onTab("folders");
        onFolder(id);
      },
    });
  }, [library, me, onTab, onFolder]);

  const showList = tab === "all" || !!shownFolder;
  return (
    <section className="home-col" aria-label="Recordings">
      <div className="home-tabs" role="tablist">
        <span className="pill" style={{ transform: tab === "folders" ? "translateX(calc(100% + 2px))" : undefined }} />
        <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => onTab("all")}>
          <span>🎙️</span>All transcripts
        </button>
        <button type="button" role="tab" aria-selected={tab === "folders"} onClick={() => onTab("folders")}>
          <FolderArt width={20} />Folders
        </button>
      </div>
      {offline && (
        <div className="home-offline" role="status">
          <WifiOffIcon size={18} />
          <span>You&rsquo;re offline. You can still record audio, and it will be transcribed when you reconnect.</span>
        </div>
      )}
      {notice}
      {error && (
        <div className="banner" role="alert">
          <span>Couldn&rsquo;t load your recordings. Check your connection.</span>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      )}
      {tab === "folders" && shownFolder && <FolderHeader folder={shownFolder} library={library} onBack={() => onFolder(null)} />}
      {showList
        ? <List {...{ library, recordings, selectedId, query, onQuery, onOpen, me }} folder={shownFolder} showFolder={tab === "all"} />
        : <FolderGrid library={library} onOpen={id => onFolder(id)} />}
      {/* A folder's "👋 Add members", centred above the record button. */}
      {tab === "folders" && shownFolder && (
        <button type="button" className="fo-add-members" onClick={() => void inviteToFolder(shownFolder, "folder")}>
          <span aria-hidden>👋</span>Add members
        </button>
      )}
      {dock}
    </section>
  );
}

function FolderHeader({ folder, library, onBack }: { folder: Folder; library: Library | null; onBack: () => void }) {
  const total = (library?.recordings ?? []).filter(r => r.folderId === folder.id).length;
  const members = membersOf(library, folder.id);
  const count = `${total} ${total === 1 ? "recording" : "recordings"}${members > 1 ? `, ${members} people` : ""}`;
  return (
    <div className="folder-head">
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
        <ChevronLeftIcon size={20} />
      </button>
      <FolderArt color={folder.color} icon={folder.icon} width={40} filled={total > 0} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <h2>{folder.name}</h2>
        <div className="sub">{count}</div>
      </div>
      <button type="button" className="icon-btn" onClick={() => openFolderPeople(folder)} aria-label="Edit folder" title="Edit folder">
        <SettingsIcon size={22} />
      </button>
    </div>
  );
}

function FolderGrid({ library, onOpen }: { library: Library | null; onOpen: (id: string) => void }) {
  const [dragOrder, setDragOrder] = useState<string[] | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  if (!library) return null;
  const counts = (id: string) => library.recordings.filter(r => r.folderId === id).length;
  const byId = new Map(library.folders.map(f => [f.id, f]));
  const order = dragOrder ?? library.folders.map(f => f.id);
  const folders = order.map(id => byId.get(id)).filter((f): f is Folder => !!f);

  // Hold and drag a folder: the others make room as it passes; dropped, the
  // new order is kept.
  const over = (id: string) => {
    const from = dragging;
    if (!from || from === id) return;
    const ids = [...order];
    const a = ids.indexOf(from);
    const b = ids.indexOf(id);
    if (a < 0 || b < 0) return;
    ids.splice(a, 1);
    ids.splice(b, 0, from);
    setDragOrder(ids);
  };
  const end = () => {
    const before = library.folders.map(f => f.id).join(",");
    if (dragOrder && dragOrder.join(",") !== before) void reorderFolders(dragOrder);
    setDragging(null);
    setDragOrder(null);
  };

  return (
    <div className="folder-grid">
      {folders.map(f => {
        const n = counts(f.id);
        const shared = membersOf(library, f.id) > 1;
        return (
          <button
            key={f.id} type="button" className={`folder-tile${dragging === f.id ? " fo-dragging" : ""}`}
            draggable
            onDragStart={e => { setDragging(f.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", f.id); }}
            onDragOver={e => { e.preventDefault(); over(f.id); }}
            onDrop={e => { e.preventDefault(); end(); }}
            onDragEnd={end}
            onClick={() => onOpen(f.id)}
          >
            <FolderArt color={f.color} icon={f.icon} width={132} filled={n > 0} />
            <span className="name">{f.name}</span>
            <span className="count">{shared ? "👥 " : ""}{n} {n === 1 ? "recording" : "recordings"}</span>
          </button>
        );
      })}
      {/* The dashed folder with a + that says where to tap to make one. */}
      <button type="button" className="folder-tile fo-new" onClick={() => openFolderEditor({ source: "home" })} aria-label="New folder">
        <span className="fo-new-art">
          <svg width="132" height="112" viewBox="-2 -2 124 106" aria-hidden>
            <path d={FOLDER_BACK} fill="var(--surface)" stroke="var(--ink-faint)" strokeWidth={2.2} strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="fo-new-plus">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" aria-hidden><path d="M12 5v14" /><path d="M5 12h14" /></svg>
          </span>
        </span>
        <span className="name" style={{ color: "var(--ink-meta)" }}>New folder</span>
      </button>
      <button type="button" className="fo-join" onClick={openJoinFolder}>Got an invite code?</button>
    </div>
  );
}

function List({ library, recordings, selectedId, query, onQuery, onOpen, me, folder, showFolder }: {
  library: Library | null; recordings: Recording[]; selectedId: string | null; query: string;
  onQuery: (q: string) => void; onOpen: (id: string) => void; me: string; folder: Folder | null; showFolder: boolean;
}) {
  const search = useRef<HTMLInputElement>(null);
  const held = useRef<{ timer: ReturnType<typeof setTimeout> | null; fired: boolean }>({ timer: null, fired: false });

  // "/" or ⌘F jumps to the search, Esc clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField = (e.target as HTMLElement).closest("input, textarea, [contenteditable]");
      if ((e.key === "/" && !inField) || (e.key === "f" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const edit = (r: Recording) => openEditSheet(r, "row", { scope: folder ? "folder" : "all" });
  // A touch screen: holding a row (350 ms) opens the edit sheet, as on the phone.
  const holdStart = (r: Recording, pointerType: string) => {
    if (pointerType !== "touch") return;
    held.current.fired = false;
    held.current.timer = setTimeout(() => { held.current.fired = true; edit(r); }, 350);
  };
  const holdEnd = () => {
    if (held.current.timer) clearTimeout(held.current.timer);
    held.current.timer = null;
  };

  const people = library?.people ?? [];
  const folders = library?.folders ?? [];
  return (
    <>
      <label className="search">
        <SearchIcon size={20} />
        <input
          ref={search}
          value={query}
          onChange={e => onQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Escape") { onQuery(""); e.currentTarget.blur(); }
            if (e.key === "Enter" && recordings[0]) onOpen(recordings[0].id);
          }}
          placeholder="Search"
          aria-label="Search"
        />
        {query
          ? <button type="button" className="clear" onClick={() => onQuery("")} aria-label="Clear search"><CircleXIcon size={18} /></button>
          : <kbd>/</kbd>}
      </label>
      <div className="rows">
        {library && !recordings.length && (
          query
            ? <div className="no-results">No results found</div>
            : folder && (
              <div className="empty">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/web-app/owl-folders.png" alt="" style={{ width: 96 }} />
                <h2>No recordings here yet</h2>
                <p>Hold a recording in All transcripts and choose Move to folder.</p>
              </div>
            )
        )}
        {recordings.map(r => {
          const inFolder = showFolder && r.folderId ? folders.find(f => f.id === r.folderId) : null;
          const by = r.userId !== me && !r.local ? personName(people, r.folderId, r.userId) ?? "Someone" : null;
          const meta = [formatDateTime(r.createdAt), inFolder?.name, by && `by ${by}`].filter(Boolean).join(", ");
          const busy = r.status === "transcribing";
          return (
            <div key={r.id} className="fo-row-wrap">
              <button
                type="button" className="row" data-row={r.id}
                aria-current={r.id === selectedId}
                onClick={() => { if (held.current.fired) { held.current.fired = false; return; } onOpen(r.id); }}
                onContextMenu={e => { if (busy) return; e.preventDefault(); edit(r); }}
                onPointerDown={e => { if (!busy) holdStart(r, e.pointerType); }}
                onPointerUp={holdEnd}
                onPointerLeave={holdEnd}
                onPointerCancel={holdEnd}
              >
                <span className="emoji">{busy ? "🎙️" : r.emoji}</span>
                <span className="info">
                  <span className="title" style={busy ? { color: "var(--ink-faint)", fontWeight: 500 } : undefined}>{busy ? "Transcribing..." : r.title || "Untitled"}</span>
                  <span className="meta">
                    {r.status === "failed" && <span className="failed">{r.failure?.startsWith("unsupported") ? "Can't be transcribed, " : "Transcription failed, "}</span>}
                    {meta}
                  </span>
                </span>
                {busy && <span className="row-spinner" aria-label="Transcribing" />}
              </button>
              {!busy && (
                <button type="button" className="fo-more" onClick={() => edit(r)} aria-label="More options" title="More options">
                  <DotsIcon size={20} color="#C7C7CC" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
