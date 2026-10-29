import type { OrgMessages } from "@/i18n/organizations";

// Small drawings of three features for /organizations, drawn in the page
// (no images): what the captions look like with recognised voices, with
// speaker direction, and with recognised sounds. Colours are the app's tag
// colours; the words (made up for the drawing) come from the page's language.

type Drawing = OrgMessages["awareness"]["drawing"];

function Tag({ emoji, name, tone }: { emoji: string; name: string; tone: "blue" | "rose" }) {
  const colors = tone === "blue" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700";
  return (
    <span className={`inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${colors}`}>
      <span aria-hidden>{emoji}</span>
      {name}
    </span>
  );
}

export function VoicesMock({ d }: { d: Drawing }) {
  return (
    <div className="flex flex-col gap-2.5 text-left" aria-hidden>
      <div>
        <Tag emoji="👩" name={d.otherName} tone="rose" />
        <p className="mt-1 text-[13px] text-gray-900">{d.voicesLine1}</p>
      </div>
      <div>
        <Tag emoji="🙋" name={d.me} tone="blue" />
        <p className="mt-1 text-[13px] text-gray-900">{d.voicesLine2}</p>
      </div>
    </div>
  );
}

// A captions screen with the waveform on the left edge, where the voice is.
export function DirectionMock({ d }: { d: Drawing }) {
  return (
    <div className="relative mx-auto h-[118px] w-[150px] overflow-hidden rounded-[14px] border border-gray-200 bg-white" aria-hidden>
      <svg viewBox="0 0 14 118" className="absolute left-0 top-0 h-full w-[14px]">
        <path
          d="M2 10 Q11 16 2 22 Q12 30 2 38 Q13 47 2 56 Q13 65 2 74 Q12 83 2 92 Q10 100 2 108"
          fill="none"
          stroke="#E11D48"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-x-0 top-0 flex justify-center gap-1.5 pt-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="h-1 w-[2px] rounded-full bg-gray-300" />
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 flex flex-col justify-center gap-1.5 pr-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-[2px] w-1 rounded-full bg-gray-300" />
        ))}
      </div>
      <div className="flex h-full flex-col justify-center gap-1 pl-5 pr-3">
        <Tag emoji="👩" name={d.otherName} tone="rose" />
        <p className="text-[11px] leading-snug text-gray-900">{d.directionLine}</p>
      </div>
    </div>
  );
}

export function SoundsMock({ d }: { d: Drawing }) {
  return (
    <div className="flex flex-col gap-2 text-left" aria-hidden>
      <div>
        <Tag emoji="👩" name={d.otherName} tone="rose" />
        <p className="mt-1 text-[13px] leading-relaxed text-gray-900">
          {d.soundsBefore}{" "}<span className="text-gray-400">{d.sound}</span>{" "}{d.soundsAfter}
        </p>
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-[6px] bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600">
        <span>📳</span> {d.vibrates}
      </span>
    </div>
  );
}
