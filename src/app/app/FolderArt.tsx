import { useId } from "react";
import { FOLDER_ICONS } from "./Icons";
import { luminance, shade } from "./format";

// The app's Files-style folder (app repo: src/components/FolderArt.tsx): a
// darker back with the tab, a lighter front with a lit top edge, a sheet of
// paper peeking out when it has something in it, its icon on the front.

const BACK = "M0 12C0 6.5 4.5 2 10 2H39C43 2 45.6 3.3 48.2 5.8L52 9.4C53.9 11.2 55.9 12 58.5 12H110C115.5 12 120 16.5 120 22V92C120 97.5 115.5 102 110 102H10C4.5 102 0 97.5 0 92Z";
const FRONT = "M0 31C0 24.4 5.4 19 12 19H108C114.6 19 120 24.4 120 31V88C120 94.6 114.6 100 108 100H12C5.4 100 0 94.6 0 88Z";

export function FolderArt({ color = "#4DA8F7", icon, width = 96, filled = false }: {
  color?: string; icon?: string; width?: number; filled?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const height = width * (102 / 120);
  const front = shade(color, 0.22);
  const ink = luminance(front) > 0.42 ? shade(color, -0.55) : "rgba(255,255,255,0.92)";
  const paths = icon ? FOLDER_ICONS[icon] : undefined;
  const iconSize = 120 * 0.34;
  return (
    <svg
      width={width} height={height} viewBox="0 0 120 102" aria-hidden
      style={width >= 60 ? { filter: `drop-shadow(0 ${width * 0.03}px ${width * 0.05}px ${shade(color, -0.5)}38)`, overflow: "visible" } : undefined}
    >
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, -0.02)} />
          <stop offset="1" stopColor={shade(color, -0.16)} />
        </linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, 0.36)} />
          <stop offset="0.12" stopColor={shade(color, 0.27)} />
          <stop offset="1" stopColor={shade(color, 0.16)} />
        </linearGradient>
      </defs>
      <path d={BACK} fill={`url(#b${id})`} />
      {filled && <rect x={10} y={8} width={100} height={40} rx={4} fill="#FFFFFF" opacity={0.97} />}
      <path d={FRONT} fill={`url(#f${id})`} />
      <path d="M12 20.2H108" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1.4} strokeLinecap="round" />
      {paths && (
        <g
          transform={`translate(${60 - iconSize / 2} ${19 + (81 - iconSize) / 2}) scale(${iconSize / 24})`}
          fill="none" stroke={ink} strokeWidth={width >= 60 ? 1.6 : 2} strokeLinecap="round" strokeLinejoin="round"
        >
          {paths.map(d => <path key={d} d={d} />)}
        </g>
      )}
    </svg>
  );
}
