"use client";

import { useEffect, type ReactNode } from "react";
import "./folders.css";

// The sheets of the edit and folder work: a card with a sheet's look over the
// dimmed window (Esc and a click outside close it), and its option tiles.

// One choice in a sheet (app: OptionTile): outlined, an accent icon, the label.
export function OptionTile({ icon, label, onPress, color, trailing, selected, disabled }: {
  icon: ReactNode; label: string; onPress: () => void; color?: string; trailing?: ReactNode; selected?: boolean; disabled?: boolean;
}) {
  return (
    <button type="button" className={`es-tile${selected ? " selected" : ""}`} onClick={onPress} disabled={disabled}>
      <span className="es-tile-icon">{icon}</span>
      <span className="es-tile-label" style={color ? { color } : undefined}>{label}</span>
      {trailing}
    </button>
  );
}

// The card itself: a sheet's look over the dimmed window, Esc closes.
export function SheetCard({ children, onClose, wide }: { children: ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="ui-scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`ui-card es-sheet${wide ? " wide" : ""}`} role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

