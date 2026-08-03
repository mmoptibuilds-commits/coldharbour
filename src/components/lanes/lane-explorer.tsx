"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowGlyph, Button } from "@/components/ui/button";
import { RiskRing, Sparkline } from "@/components/graphics/marks";
import { EmptyState, StatusTag } from "@/components/ui/primitives";
import { MODE_LABEL, STATUS_META, cn, type LaneMode, type LaneStatus } from "@/lib/utils";

export type ExplorerLane = {
  id: number;
  slug: string;
  code: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  mode: string;
  payload: string;
  profile: string;
  bandMin: number;
  bandMax: number;
  transitHours: number;
  status: string;
  riskScore: number;
  shipmentsYtd: number;
  excursionCount: number;
  series: { minute: number; tempC: number }[];
};

type Sort = "risk" | "transit" | "volume" | "code";

const SORTS: { value: Sort; label: string }[] = [
  { value: "risk", label: "Risk score" },
  { value: "transit", label: "Transit time" },
  { value: "volume", label: "Shipments" },
  { value: "code", label: "Lane code" },
];

export function LaneExplorer({ lanes }: { lanes: ExplorerLane[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | LaneStatus>("all");
  const [mode, setMode] = useState<"all" | LaneMode>("all");
  const [sort, setSort] = useState<Sort>("risk");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = lanes.filter((lane) => {
      if (status !== "all" && lane.status !== status) return false;
      if (mode !== "all" && lane.mode !== mode) return false;
      if (!needle) return true;
      return [lane.code, lane.origin, lane.destination, lane.payload, lane.profile]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });

    return rows.sort((a, b) => {
      if (sort === "risk") return b.riskScore - a.riskScore;
      if (sort === "transit") return b.transitHours - a.transitHours;
      if (sort === "volume") return b.shipmentsYtd - a.shipmentsYtd;
      return a.code.localeCompare(b.code);
    });
  }, [lanes, query, status, mode, sort]);

  // Only offer filters the sample network can actually satisfy.
  const availableModes = useMemo(
    () => (Object.keys(MODE_LABEL) as LaneMode[]).filter((key) => lanes.some((lane) => lane.mode === key)),
    [lanes],
  );
  const availableStatuses = useMemo(
    () =>
      (Object.keys(STATUS_META) as LaneStatus[]).filter((key) =>
        lanes.some((lane) => lane.status === key),
      ),
    [lanes],
  );

  const dirty = query !== "" || status !== "all" || mode !== "all" || sort !== "risk";

  function reset() {
    setQuery("");
    setStatus("all");
    setMode("all");
    setSort("risk");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-line bg-raised p-4 md:flex-row md:items-end md:gap-6 md:p-5">
        <div className="flex-1">
          <label htmlFor="lane-search" className="label-mono">
            Search lanes
          </label>
          <input
            id="lane-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Code, city, product or profile"
            className="mt-2 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          />
        </div>

        <FilterGroup
          legend="Status"
          value={status}
          onChange={(next) => setStatus(next as "all" | LaneStatus)}
          options={[
            { value: "all", label: "All" },
            ...availableStatuses.map((key) => ({ value: key, label: STATUS_META[key].label })),
          ]}
        />

        <FilterGroup
          legend="Mode"
          value={mode}
          onChange={(next) => setMode(next as "all" | LaneMode)}
          options={[
            { value: "all", label: "All" },
            ...availableModes.map((key) => ({ value: key, label: MODE_LABEL[key] })),
          ]}
        />

        <div>
          <label htmlFor="lane-sort" className="label-mono">
            Sort by
          </label>
          <select
            id="lane-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="mt-2 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] md:w-40"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
          {filtered.length} of {lanes.length} lanes
        </p>
        {dirty ? (
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No lane matches those filters"
            description="Nothing in the sample network fits that combination. Widen the status or mode filter, or clear the search."
            action={
              <Button type="button" variant="secondary" size="sm" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 border-t border-line">
          {filtered.map((lane) => (
            <li key={lane.id}>
              <Link
                href={`/lanes/${lane.slug}`}
                className="group grid grid-cols-1 items-center gap-4 border-b border-line px-2 py-5 transition-colors duration-[180ms] hover:bg-raised md:grid-cols-12 md:gap-6 md:py-4"
              >
                <div className="md:col-span-3">
                  <p className="font-mono text-sm text-ink group-hover:text-accent">{lane.code}</p>
                  <p className="mt-1 text-sm text-mutedfg">
                    {lane.origin} → {lane.destination}
                  </p>
                </div>

                <div className="md:col-span-3">
                  <p className="text-sm text-mutedfg">{lane.payload}</p>
                  <p className="mt-1 font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                    {MODE_LABEL[lane.mode as LaneMode]} · {lane.profile} · {lane.transitHours} h
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Sparkline
                    points={lane.series}
                    bandMin={lane.bandMin}
                    bandMax={lane.bandMax}
                    status={lane.status as LaneStatus}
                  />
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <StatusTag status={lane.status as LaneStatus} />
                  {lane.excursionCount > 0 ? (
                    <span className="font-mono text-2xs text-muted">
                      {lane.excursionCount} logged
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <RiskRing value={lane.riskScore} />
                  <ArrowGlyph className="text-muted group-hover:text-accent" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset>
      <legend className="label-mono">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-1 rounded-md border border-line bg-surface p-1">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "h-9 rounded-sm px-3 text-xs transition-colors duration-[180ms] active:scale-[0.98]",
                active ? "bg-overlay text-ink" : "text-mutedfg hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
