"use client";

import { capture } from "./client";
import { FREE_DAILY_CREDITS } from "./usage";
import { MicrophoneIcon, TranslatorIcon, UploadIcon } from "./Icons";
import { DockButton, IslandButton } from "./ui";

// Home's bottom dock (app repo: HomeScreen dock, components/StartHint.tsx):
// the record button between translate and upload, over a white fade; and,
// until someone's first recording of their own, the owl perched on the record
// button with "Start captioning for FREE / 100 credits / day" (a tap starts
// captions too).

export function Dock({ onRecord, onTranslate, onUpload, showHint, isPlus, attract }: {
  onRecord: () => void; onTranslate: () => void; onUpload: () => void; showHint: boolean; isPlus: boolean; attract: boolean;
}) {
  return (
    <div className="dock-wrap">
      {showHint && (
        <div className="start-hint">
          <button
            type="button"
            className="start-bubble"
            onClick={() => { capture("start_hint_tapped", { is_plus: isPlus }); onRecord(); }}
          >
            <span className="edge" aria-hidden />
            <span className="face">
              <span className="tail" aria-hidden />
              <span className="title">{isPlus ? "Start captioning" : "Start captioning for FREE"}</span>
              {!isPlus && <span className="credits">{FREE_DAILY_CREDITS} credits / day</span>}
            </span>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="start-owl" src="/web-app/owl-start.png" alt="" />
        </div>
      )}
      <div className="dock">
        <DockButton label="Translate" onPress={onTranslate}><TranslatorIcon size={30} color="var(--brand)" /></DockButton>
        <IslandButton label="Live captions" onPress={onRecord} sheen attract={attract}>
          <MicrophoneIcon size={34} color="#FFFFFF" />
        </IslandButton>
        <DockButton label="Upload" onPress={onUpload}><UploadIcon size={30} color="var(--brand)" /></DockButton>
      </div>
    </div>
  );
}
