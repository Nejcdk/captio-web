const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LanguageMetrics({
  language,
  wer,
  useCer,
}: {
  language: string;
  wer: number;
  useCer?: boolean;
}) {
  const accuracy = Math.round((1 - wer / 100) * 100 * 10) / 10;
  const filled = (accuracy / 100) * CIRCUMFERENCE;
  const metricLabel = useCer ? 'character accuracy' : 'word accuracy';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {/* Accuracy */}
      <div className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-3">
        <span className="absolute top-3 left-3 bg-brand/10 text-brand text-[11px] font-semibold px-2 py-0.5 rounded-md">{language}</span>
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            {/* Fill */}
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="#1C49F5"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-brand leading-none">{accuracy}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800">{metricLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5">independent benchmark, 2025</p>
        </div>
      </div>

      {/* Latency */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="text-3xl font-bold text-brand">&lt; 200ms</div>
          {/* Timeline visual */}
          <div className="flex items-center gap-1.5 w-full mt-1">
            <span className="text-[11px] text-gray-400 shrink-0">you speak</span>
            <div className="flex-1 flex items-center gap-0.5">
              <div className="h-0.5 w-2 bg-gray-300 rounded-full" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              <div className="flex-1 h-0.5 bg-brand rounded-full" />
              <div className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              <div className="h-0.5 w-2 bg-gray-300 rounded-full" />
            </div>
            <span className="text-[11px] text-gray-400 shrink-0">captions</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800">real-time captions</p>
          <p className="text-xs text-gray-400 mt-0.5">first word appears as you speak</p>
        </div>
      </div>
    </div>
  );
}
