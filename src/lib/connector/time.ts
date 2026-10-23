// Dates and times for the connector, in the person's own time zone (the app
// sends it with set_email_profile; UTC when it never did).

export function validZone(tz: string | null | undefined): string {
  if (!tz) return "UTC";
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

// How far the zone is ahead of UTC at that moment, in ms.
function zoneOffset(ms: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(ms));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(ms / 1000) * 1000;
}

// A wall-clock time in the zone → ms since 1970.
function zonedToMs(y: number, mo: number, d: number, h: number, mi: number, tz: string): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const first = guess - zoneOffset(guess, tz);
  return guess - zoneOffset(first, tz);
}

// "2026-10-20", "2026-10-20 14:30" or "2026-10-20T14:30" (in the person's
// zone), or a full ISO time with its own offset. null when it isn't a date.
export function parseWhen(value: unknown, tz: string): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const s = value.trim();
  const local = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/.exec(s);
  if (local) {
    const [, y, mo, d, h, mi] = local;
    return zonedToMs(+y, +mo, +d, h ? +h : 0, mi ? +mi : 0, tz);
  }
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? null : ms;
}

// The end of a day given as "2026-10-20" is the start of the next one.
export function parseUntil(value: unknown, tz: string): number | null {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    const [y, mo, d] = value.trim().split("-").map(Number);
    const next = new Date(Date.UTC(y, mo - 1, d + 1));
    return zonedToMs(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), 0, 0, tz);
  }
  return parseWhen(value, tz);
}

export function formatDay(ms: number, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(ms));
}

export function formatClock(ms: number, tz: string, seconds = false): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", second: seconds ? "2-digit" : undefined, hourCycle: "h23",
  }).format(new Date(ms));
}

export function formatLength(seconds: number): string {
  if (!seconds || seconds < 60) return `${Math.max(0, Math.round(seconds || 0))} s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

// A recording is saved when it ends: it started about its length earlier
// (pauses make this approximate).
export function startedAt(createdAt: number, durationSeconds: number): number {
  return createdAt - Math.max(0, durationSeconds || 0) * 1000;
}

// "Mon, 20 Oct 2026, 09:00–17:30"
export function formatSpan(createdAt: number, durationSeconds: number, tz: string): string {
  const start = startedAt(createdAt, durationSeconds);
  return `${formatDay(start, tz)}, ${formatClock(start, tz)}–${formatClock(createdAt, tz)}`;
}

// "14:30" on the day a recording started → ms into the recording.
export function clockToOffset(clock: string, createdAt: number, durationSeconds: number, tz: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(clock.trim());
  if (!m) return null;
  const start = startedAt(createdAt, durationSeconds);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(start));
  const [y, mo, d] = day.split("-").map(Number);
  let at = zonedToMs(y, mo, d, +m[1], +m[2], tz);
  if (at < start - 60_000) at += 24 * 3600 * 1000; // past midnight
  return Math.max(0, at - start);
}
