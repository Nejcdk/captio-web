"use client";

import { useRef, useState } from "react";
import "./folders.css";
import type { Folder, Recording } from "./data";
import { FolderArt } from "./FolderArt";
import { luminance } from "./format";
import { CheckIcon, FOLDER_ICONS, TrashIcon } from "./Icons";
import { OptionTile, SheetCard } from "./sheet";
import { CloseButton, confirmCard, showCard, showErrorAlert } from "./ui";
import { isGuest, needsAccount } from "./client";
import {
  FOLDER_COLORS, FOLDER_DEFAULT_COLOR, FOLDER_NAME_MAX, createFolder, deleteFolder, editContext, hslToHex,
  isSharedFolder, moveRecording, updateFolder,
} from "./folders";

// Make or edit a folder (app repo: FolderEditorScreen.tsx), laid out like
// iOS's own New Folder: ✕, the title and a blue ✓; a big live preview that
// bounces on every change; the name; Color | Icon. Colours are the 27
// swatches and a rainbow that opens a spectrum to drag on; icons are plain
// line icons, the last one "no icon". From the "New folder" tile, a folder's
// People sheet (Edit folder), and Move to folder's "New folder", which then
// moves that recording into it.

const RAINBOW = "linear-gradient(135deg, #FF3B30, #FF9500, #FFCC00, #34C759, #32ADE6, #5856D6, #AF52DE, #FF2D55)";
const spotColor = (x: number, y: number) => hslToHex(x * 360, 0.9, 0.92 - y * 0.74);

export function openFolderEditor({ folder, source = "home", moveRecording: rec }: {
  folder?: Folder; source?: "home" | "move_sheet"; moveRecording?: Recording;
} = {}) {
  // Folders live on the account.
  if (!folder && isGuest()) { needsAccount("folders"); return; }
  showCard(close => <FolderEditor folder={folder} source={source} rec={rec} close={close} />);
}

function FolderEditor({ folder, source, rec, close }: { folder?: Folder; source: "home" | "move_sheet"; rec?: Recording; close: () => void }) {
  const [name, setName] = useState(folder?.name ?? "");
  const [color, setColor] = useState(folder?.color ?? FOLDER_DEFAULT_COLOR);
  const [icon, setIcon] = useState(folder?.icon ?? "");
  const [tab, setTab] = useState<"color" | "icon">("color");
  const isCustom = !FOLDER_COLORS.includes(color);
  const [pickerOpen, setPickerOpen] = useState(isCustom);
  const [spot, setSpot] = useState({ x: 0.55, y: 0.45 });
  const [busy, setBusy] = useState(false);
  const spectrum = useRef<HTMLDivElement>(null);
  const canSave = !!name.trim() && !busy;

  const pickAt = (clientX: number, clientY: number) => {
    const box = spectrum.current?.getBoundingClientRect();
    if (!box) return;
    const x = Math.max(0, Math.min(1, (clientX - box.left) / box.width));
    const y = Math.max(0, Math.min(1, (clientY - box.top) / box.height));
    setSpot({ x, y });
    setColor(spotColor(x, y));
  };

  const save = async () => {
    if (!canSave) return;
    setBusy(true);
    const fields = { name, color, icon };
    try {
      if (folder) {
        await updateFolder(folder, fields);
      } else {
        const made = await createFolder(fields, source);
        if (rec) await moveRecording(rec, made.id, "home");
      }
      close();
    } catch (e) {
      setBusy(false);
      showErrorAlert({ where: folder ? "folder_update" : "folder_create", error: e, body: "Check your connection and try again." });
    }
  };

  const remove = async () => {
    if (!folder) return;
    const shared = isSharedFolder(editContext().library, folder.id);
    const ok = await confirmCard({
      title: "Delete folder?",
      body: shared ? "Everyone in it loses it. Recordings stay with whoever made them." : "Its recordings stay in All transcripts.",
      confirm: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      await deleteFolder(folder);
      editContext().openFolder(null);
      close();
    } catch (e) {
      setBusy(false);
      showErrorAlert({ where: "folder_delete", error: e, body: "Check your connection and try again." });
    }
  };

  return (
    <SheetCard onClose={close} wide>
      <div className="fe-head">
        <CloseButton onPress={close} />
        <span className="fe-title">{folder ? "Edit folder" : "New folder"}</span>
        <button type="button" className="fe-done" onClick={() => void save()} disabled={!canSave} aria-label={folder ? "Save" : "Create folder"}>
          <CheckIcon size={24} color="#FFFFFF" />
        </button>
      </div>
      <div className="fe-scroll">
        {/* A little bounce whenever the colour or icon changes. */}
        <div className="fe-preview" key={`${color}|${icon}`}>
          <FolderArt color={color} icon={icon} width={190} />
        </div>
        <input
          className="fe-name"
          value={name}
          maxLength={FOLDER_NAME_MAX}
          autoFocus={!folder}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") void save(); }}
          placeholder="Folder name"
          aria-label="Folder name"
        />
        <div className="app-tabs fe-tabs" role="tablist" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <button type="button" role="tab" aria-selected={tab === "color"} onClick={() => setTab("color")}>Color</button>
          <button type="button" role="tab" aria-selected={tab === "icon"} onClick={() => setTab("icon")}>Icon</button>
        </div>
        {tab === "color" ? (
          <>
            <div className="fe-grid">
              {FOLDER_COLORS.map(c => {
                const selected = c === color && !pickerOpen;
                return (
                  <button
                    key={c} type="button" className={`fe-cell${selected ? " on" : ""}`} aria-label={c} aria-pressed={selected}
                    onClick={() => { setPickerOpen(false); setColor(c); }}
                  >
                    <span className="fe-swatch" style={{ background: c, boxShadow: luminance(c) > 0.75 ? "inset 0 0 0 1px var(--hairline)" : undefined }}>
                      {selected && <CheckIcon size={18} color={luminance(c) > 0.6 ? "#1C1C1E" : "#FFFFFF"} />}
                    </span>
                  </button>
                );
              })}
              {/* Any colour: opens the spectrum under the palette. */}
              <button
                type="button" className={`fe-cell${isCustom || pickerOpen ? " on" : ""}`} aria-label="Any color"
                onClick={() => { setPickerOpen(true); if (!isCustom) setColor(spotColor(spot.x, spot.y)); }}
              >
                <span className="fe-swatch" style={{ background: RAINBOW }}>
                  {isCustom && <span className="fe-custom-dot" style={{ background: color }} />}
                </span>
              </button>
            </div>
            {pickerOpen && (
              <div
                ref={spectrum}
                className="fe-spectrum"
                onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); pickAt(e.clientX, e.clientY); }}
                onPointerMove={e => { if (e.buttons) pickAt(e.clientX, e.clientY); }}
              >
                <span className="fe-knob" style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%`, background: isCustom ? color : spotColor(spot.x, spot.y) }} />
              </div>
            )}
          </>
        ) : (
          <div className="fe-grid">
            {Object.keys(FOLDER_ICONS).map(key => (
              <button key={key} type="button" className={`fe-icon${icon === key ? " on" : ""}`} aria-label={key} aria-pressed={icon === key} onClick={() => setIcon(key)}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={icon === key ? "var(--brand)" : "var(--ink)"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {FOLDER_ICONS[key].map(d => <path key={d} d={d} />)}
                </svg>
              </button>
            ))}
            {/* No icon: a plain folder. */}
            <button type="button" className={`fe-icon${!icon ? " on" : ""}`} aria-label="No icon" aria-pressed={!icon} onClick={() => setIcon("")}>
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden><path d="M19 5L5 19" stroke="var(--destructive)" strokeWidth={1.8} strokeLinecap="round" /></svg>
            </button>
          </div>
        )}
        {!!folder && (
          <div style={{ marginTop: 28 }}>
            <OptionTile icon={<TrashIcon size={22} color="var(--destructive)" />} label="Delete folder" color="var(--destructive)" onPress={() => void remove()} disabled={busy} />
          </div>
        )}
      </div>
    </SheetCard>
  );
}
