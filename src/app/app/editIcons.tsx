// The edit sheet's and folder pages' icons, from the app's Icons.tsx (Tabler
// outline paths, 24 grid, stroke 2).

type IconProps = { color?: string; size?: number };

function Tabler({ paths, color = "currentColor", size = 22, weight = 2 }: IconProps & { paths: string[]; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map(d => <path key={d} d={d} />)}
    </svg>
  );
}

export const PencilIcon = (p: IconProps) => <Tabler {...p} paths={["M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4", "M13.5 6.5l4 4"]} />;
export const SmileIcon = (p: IconProps) => <Tabler {...p} paths={["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M9 10l.01 0", "M15 10l.01 0", "M9.5 15a3.5 3.5 0 0 0 5 0"]} />;
export const FolderLineIcon = (p: IconProps) => <Tabler {...p} paths={["M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2V6a2 2 0 0 1 2 -2"]} />;
export const FolderOffIcon = (p: IconProps) => <Tabler {...p} paths={["M8 4h1l3 3h7a2 2 0 0 1 2 2v8m-2 2H5a2 2 0 0 1 -2 -2V6a2 2 0 0 1 1.172 -1.821", "M3 3l18 18"]} />;
export const UserPlusIcon = (p: IconProps) => <Tabler {...p} paths={["M16 21v-2a4 4 0 0 0 -4 -4H6a4 4 0 0 0 -4 4v2", "M5 7a4 4 0 1 0 8 0 4 4 0 1 0 -8 0", "m19 8 0 6", "m22 11 -6 0"]} />;
export const PlusLineIcon = (p: IconProps) => <Tabler {...p} paths={["M12 5v14", "M5 12h14"]} />;
export const DotsIcon = (p: IconProps) => <Tabler {...p} paths={["M5 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0", "M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0", "M19 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"]} />;
export const TextLinesIcon = (p: IconProps) => <Tabler {...p} paths={["M14 3v4a1 1 0 0 0 1 1h4", "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z", "M9 9l1 0", "M9 13l6 0", "M9 17l6 0"]} />;
