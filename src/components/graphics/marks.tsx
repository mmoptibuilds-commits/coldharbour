import { cn, type LaneStatus } from "@/lib/utils";

/**
 * Wordmark glyph: two rails (the accepted band) with a trace crossing them.
 * The trace breaks the upper rail once, which is the whole product in one mark.
 */
export function BandGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 24" className={cn("size-6", className)} fill="none" aria-hidden="true">
      <path d="M1 7h26M1 17h26" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M1 14.5c3.2 0 3.6-2 6.4-2s3.4 5.5 6 5.5c2.2 0 2.4-13.5 5.2-13.5 2.4 0 2.1 8 3.6 8 1.1 0 1.6-2 4.8-2"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Compact trace used in lane rows. Pure SVG, no client JavaScript. */
export function Sparkline({
  points,
  bandMin,
  bandMax,
  status,
  width = 104,
  height = 30,
  className,
}: {
  points: { minute: number; tempC: number }[];
  bandMin: number;
  bandMax: number;
  status: LaneStatus;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (points.length < 2) {
    return <div className={cn("h-[30px] w-[104px]", className)} aria-hidden="true" />;
  }

  const temps = points.map((p) => p.tempC);
  const lo = Math.min(bandMin, ...temps);
  const hi = Math.max(bandMax, ...temps);
  const span = hi - lo || 1;
  const maxMinute = points[points.length - 1]!.minute || 1;

  const x = (minute: number) => (minute / maxMinute) * width;
  const y = (value: number) => height - 2 - ((value - lo) / span) * (height - 4);

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.minute).toFixed(1)} ${y(p.tempC).toFixed(1)}`)
    .join(" ");

  const stroke = status === "excursion" ? "var(--accent)" : status === "watch" ? "var(--warn)" : "var(--cold)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0"
        y={y(bandMax)}
        width={width}
        height={Math.max(1, y(bandMin) - y(bandMax))}
        fill="var(--cold)"
        fillOpacity="0.08"
      />
      <path d={d} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Small numeric ring used for risk scores. */
export function RiskRing({ value, className }: { value: number; className?: string }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const tone = value >= 70 ? "var(--accent)" : value >= 45 ? "var(--warn)" : "var(--cold)";

  return (
    <span className={cn("relative inline-flex size-10 items-center justify-center", className)}>
      <svg viewBox="0 0 36 36" className="size-10 -rotate-90" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r={radius} stroke="var(--border)" strokeWidth="2" />
        <circle
          cx="18"
          cy="18"
          r={radius}
          stroke={tone}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <span className="absolute font-mono text-2xs text-ink">{value}</span>
    </span>
  );
}
