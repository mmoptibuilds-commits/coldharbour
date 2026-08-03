"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, elapsedClock } from "@/lib/utils";

export type ChartPoint = { minute: number; tempC: number; ambientC: number };
export type ChartEvent = { startMinute: number; endMinute: number; peakTempC: number };

type Props = {
  points: ChartPoint[];
  bandMin: number;
  bandMax: number;
  events?: ChartEvent[];
  height?: number;
  laneCode: string;
  className?: string;
};

const PAD = { top: 18, right: 18, bottom: 30, left: 46 };

function niceTicks(min: number, max: number, count = 4) {
  const span = max - min || 1;
  const raw = span / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? magnitude * 10;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-6; v += step) ticks.push(Number(v.toFixed(4)));
  return ticks;
}

export function LaneChart({
  points,
  bandMin,
  bandMax,
  events = [],
  height = 320,
  laneCode,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [width, setWidth] = useState(760);
  const [cursor, setCursor] = useState<number | null>(null);
  const [pinned, setPinned] = useState(false);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next && Math.abs(next - width) > 2) setWidth(next);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [width]);

  const model = useMemo(() => {
    const maxMinute = points.length > 0 ? points[points.length - 1]!.minute : 60;
    const temps = points.map((p) => p.tempC);
    const lo = Math.min(bandMin, ...temps);
    const hi = Math.max(bandMax, ...temps);
    const pad = (hi - lo) * 0.16 || 1;
    const yMin = lo - pad;
    const yMax = hi + pad;

    const innerW = Math.max(120, width - PAD.left - PAD.right);
    const innerH = height - PAD.top - PAD.bottom;

    const x = (minute: number) => PAD.left + (minute / maxMinute) * innerW;
    const y = (value: number) => PAD.top + (1 - (value - yMin) / (yMax - yMin)) * innerH;

    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.minute).toFixed(2)} ${y(p.tempC).toFixed(2)}`)
      .join(" ");

    const ambient = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.minute).toFixed(2)} ${y(p.ambientC).toFixed(2)}`)
      .join(" ");

    // Out-of-band segments drawn over the base trace in the accent colour.
    const breaches: string[] = [];
    let current: string[] = [];
    for (const p of points) {
      const out = p.tempC > bandMax || p.tempC < bandMin;
      if (out) current.push(`${current.length === 0 ? "M" : "L"}${x(p.minute).toFixed(2)} ${y(p.tempC).toFixed(2)}`);
      else if (current.length > 0) {
        if (current.length > 1) breaches.push(current.join(" "));
        current = [];
      }
    }
    if (current.length > 1) breaches.push(current.join(" "));

    return {
      x,
      y,
      innerW,
      innerH,
      maxMinute,
      line,
      ambient,
      breaches,
      yTicks: niceTicks(yMin, yMax, 4),
      xTicks: Array.from({ length: 5 }, (_, i) => Math.round((maxMinute / 4) * i)),
      bandTop: y(bandMax),
      bandBottom: y(bandMin),
    };
  }, [points, bandMin, bandMax, width, height]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path = pathRef.current;
        if (!path) return;
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: path, start: "top 92%", once: true },
            onComplete: () => path.removeAttribute("stroke-dasharray"),
          },
        );
      });
      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [model.line] },
  );

  const activeIndex = cursor ?? -1;
  const active = activeIndex >= 0 ? points[activeIndex] : undefined;

  function indexFromClientX(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || points.length === 0) return 0;
    const relative = clientX - rect.left;
    const ratio = (relative - PAD.left) / model.innerW;
    return Math.max(0, Math.min(points.length - 1, Math.round(ratio * (points.length - 1))));
  }

  const outOfBand = active ? active.tempC > bandMax || active.tempC < bandMin : false;

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={wrapRef}
        className="relative w-full touch-pan-y"
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          setCursor(indexFromClientX(event.clientX));
        }}
        onPointerLeave={() => {
          if (!pinned) setCursor(null);
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block w-full outline-offset-4"
          role="img"
          tabIndex={0}
          aria-label={`Temperature trace for lane ${laneCode}. Profile ${bandMin} to ${bandMax} degrees Celsius over ${elapsedClock(model.maxMinute)} of transit. Use left and right arrow keys to read individual points.`}
          onFocus={() => setCursor((c) => c ?? Math.floor(points.length / 2))}
          onBlur={() => {
            setPinned(false);
            setCursor(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              const step = event.shiftKey ? 5 : 1;
              setCursor((c) => {
                const base = c ?? 0;
                const next = event.key === "ArrowRight" ? base + step : base - step;
                return Math.max(0, Math.min(points.length - 1, next));
              });
              setPinned(true);
            }
            if (event.key === "Home") {
              event.preventDefault();
              setCursor(0);
            }
            if (event.key === "End") {
              event.preventDefault();
              setCursor(points.length - 1);
            }
            if (event.key === "Escape") {
              setPinned(false);
              setCursor(null);
            }
          }}
        >
          <defs>
            <linearGradient id={`band-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cold)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--cold)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* horizontal rules */}
          {model.yTicks.map((tick) => (
            <g key={`y-${tick}`}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={model.y(tick)}
                y2={model.y(tick)}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 10}
                y={model.y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-[var(--muted)] font-mono"
                fontSize="10"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* accepted band */}
          <rect
            x={PAD.left}
            y={model.bandTop}
            width={model.innerW}
            height={Math.max(2, model.bandBottom - model.bandTop)}
            fill={`url(#band-${gradientId})`}
          />
          <line x1={PAD.left} x2={width - PAD.right} y1={model.bandTop} y2={model.bandTop} stroke="var(--cold)" strokeOpacity="0.4" strokeDasharray="3 4" />
          <line x1={PAD.left} x2={width - PAD.right} y1={model.bandBottom} y2={model.bandBottom} stroke="var(--cold)" strokeOpacity="0.4" strokeDasharray="3 4" />

          {/* logged excursion windows */}
          {events.map((event) => (
            <rect
              key={`${event.startMinute}-${event.endMinute}`}
              x={model.x(event.startMinute)}
              y={PAD.top}
              width={Math.max(3, model.x(event.endMinute) - model.x(event.startMinute))}
              height={model.innerH}
              fill="var(--accent)"
              fillOpacity="0.09"
            />
          ))}

          {/* ambient reference */}
          <path d={model.ambient} fill="none" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2 4" />

          {/* payload trace */}
          <path
            ref={pathRef}
            d={model.line}
            fill="none"
            stroke="var(--cold)"
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {model.breaches.map((segment, index) => (
            <path key={index} d={segment} fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
          ))}

          {/* x axis */}
          <line x1={PAD.left} x2={width - PAD.right} y1={height - PAD.bottom} y2={height - PAD.bottom} stroke="var(--border-strong)" />
          {model.xTicks.map((tick) => (
            <text
              key={`x-${tick}`}
              x={model.x(tick)}
              y={height - PAD.bottom + 16}
              textAnchor={tick === 0 ? "start" : tick === model.maxMinute ? "end" : "middle"}
              className="fill-[var(--muted)] font-mono"
              fontSize="10"
            >
              {elapsedClock(tick)}
            </text>
          ))}

          {/* cursor */}
          {active ? (
            <g>
              <line
                x1={model.x(active.minute)}
                x2={model.x(active.minute)}
                y1={PAD.top}
                y2={height - PAD.bottom}
                stroke="var(--foreground)"
                strokeOpacity="0.35"
              />
              <circle
                cx={model.x(active.minute)}
                cy={model.y(active.tempC)}
                r="4.5"
                fill="var(--canvas)"
                stroke={outOfBand ? "var(--accent)" : "var(--cold)"}
                strokeWidth="2"
              />
            </g>
          ) : null}
        </svg>
      </div>

      {/* readout */}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-3">
        <p aria-live="polite" className="font-mono text-xs text-ink">
          {active ? (
            <>
              <span className="text-muted">T+{elapsedClock(active.minute)}</span>{" "}
              <span style={{ color: outOfBand ? "var(--accent)" : "var(--cold)" }}>
                {active.tempC.toFixed(1)} °C payload
              </span>{" "}
              <span className="text-muted">/ {active.ambientC.toFixed(1)} °C ambient</span>{" "}
              <span className={outOfBand ? "text-accent" : "text-mutedfg"}>
                {outOfBand ? "out of band" : "in band"}
              </span>
            </>
          ) : (
            <span className="text-muted">
              Hover the trace, or focus it and use the arrow keys, to read a point.
            </span>
          )}
        </p>
        <ul className="ml-auto flex flex-wrap items-center gap-4 font-mono text-2xs tracking-[0.1em] text-muted uppercase">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ background: "var(--cold)" }} />
            Payload
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ background: "var(--accent)" }} />
            Out of band
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full border-t border-dashed" style={{ borderColor: "var(--border-strong)" }} />
            Ambient
          </li>
        </ul>
      </div>

      <details className="group mt-4 border-t border-line pt-3">
        <summary className="label-mono cursor-pointer list-none marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="transition-transform duration-[180ms] group-open:rotate-90">
              ›
            </span>
            Read the same data as a table
          </span>
        </summary>
        <div className="mt-3 max-h-64 overflow-auto rounded-sm border border-line">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <caption className="sr-only">
              Payload and ambient temperature readings for lane {laneCode}
            </caption>
            <thead className="sticky top-0 bg-overlay text-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-normal">Elapsed</th>
                <th scope="col" className="px-3 py-2 font-normal">Payload °C</th>
                <th scope="col" className="px-3 py-2 font-normal">Ambient °C</th>
                <th scope="col" className="px-3 py-2 font-normal">State</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => {
                const out = point.tempC > bandMax || point.tempC < bandMin;
                return (
                  <tr key={point.minute} className="border-t border-line">
                    <td className="px-3 py-1.5 text-mutedfg">T+{elapsedClock(point.minute)}</td>
                    <td className="px-3 py-1.5 text-ink">{point.tempC.toFixed(1)}</td>
                    <td className="px-3 py-1.5 text-mutedfg">{point.ambientC.toFixed(1)}</td>
                    <td className="px-3 py-1.5" style={{ color: out ? "var(--accent)" : "var(--muted)" }}>
                      {out ? "Out of band" : "In band"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
