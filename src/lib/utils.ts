import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Minute offset from departure rendered as an elapsed clock, e.g. 04:30. */
export function elapsedClock(minute: number) {
  const h = Math.floor(minute / 60);
  const m = Math.round(minute % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export const STATUS_META = {
  "in-band": { label: "In band", color: "var(--cold)", note: "Every reading inside the profile" },
  watch: { label: "Watch", color: "var(--warn)", note: "Within 1 °C of a limit" },
  excursion: { label: "Excursion", color: "var(--accent)", note: "Out of band, decision required" },
} as const;

export type LaneStatus = keyof typeof STATUS_META;

export const MODE_LABEL = {
  air: "Air",
  road: "Road",
  sea: "Sea",
} as const;

export type LaneMode = keyof typeof MODE_LABEL;
