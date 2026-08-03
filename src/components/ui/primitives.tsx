import type { ReactNode } from "react";
import { cn, STATUS_META, type LaneStatus } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export function Eyebrow({
  children,
  className,
  marker = true,
}: {
  children: ReactNode;
  className?: string;
  marker?: boolean;
}) {
  return (
    <p className={cn("label-mono flex items-center gap-2", className)}>
      {marker ? <span aria-hidden="true" className="h-px w-6 bg-accent" /> : null}
      {children}
    </p>
  );
}

export function StatusDot({ status, className }: { status: LaneStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: meta.color, boxShadow: `0 0 0 3px color-mix(in srgb, ${meta.color} 18%, transparent)` }}
    />
  );
}

export function StatusTag({ status, className }: { status: LaneStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-xs border px-2 py-1 font-mono text-2xs tracking-[0.12em] uppercase",
        className,
      )}
      style={{
        borderColor: `color-mix(in srgb, ${meta.color} 34%, transparent)`,
        color: meta.color,
        backgroundColor: `color-mix(in srgb, ${meta.color} 9%, transparent)`,
      }}
    >
      <StatusDot status={status} />
      {meta.label}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border border-line bg-surface px-2 py-1 font-mono text-2xs tracking-[0.12em] text-mutedfg uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Label / value row used across lane detail, pricing and evidence sections. */
export function SpecRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0",
        className,
      )}
    >
      <dt className="label-mono">{label}</dt>
      <dd className="text-right font-mono text-sm text-ink">{value}</dd>
    </div>
  );
}

export function SampleNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 font-mono text-2xs leading-relaxed tracking-[0.06em] text-muted uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="mt-[0.45em] h-px w-4 shrink-0 bg-muted" />
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-linestrong bg-surface px-6 py-12">
      <div className="flex size-9 items-center justify-center rounded-sm border border-line bg-raised">
        <svg viewBox="0 0 20 20" className="size-4 text-muted" fill="none" aria-hidden="true">
          <path d="M2 14.5 6.5 9l3.5 3.5L14 6.5 18 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17.5h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-medium text-ink">{title}</h3>
        <p className="measure mt-2 text-sm text-mutedfg">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-bar rounded-sm", className)} aria-hidden="true" />;
}


