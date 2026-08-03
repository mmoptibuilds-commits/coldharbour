"use client";

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "peer w-full rounded-md border border-line bg-surface px-3.5 pt-6 pb-2 text-base text-ink " +
  "transition-[border-color,box-shadow] duration-[180ms] placeholder:text-transparent " +
  "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] " +
  "aria-[invalid=true]:border-[var(--danger)]";

const LABEL_BASE =
  "pointer-events-none absolute left-3.5 top-2 origin-left font-mono text-2xs uppercase tracking-[0.12em] text-mutedfg " +
  "transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "peer-placeholder-shown:top-[1.05rem] peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-muted " +
  "peer-focus:top-2 peer-focus:text-2xs peer-focus:uppercase peer-focus:tracking-[0.12em] peer-focus:text-accent " +
  "peer-autofill:top-2 peer-autofill:text-2xs peer-autofill:uppercase peer-autofill:tracking-[0.12em]";

type Common = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

function Frame({
  id,
  error,
  hint,
  children,
  className,
}: {
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">{children}</div>
      <div className="mt-1.5 min-h-[1.1rem]">
        {error ? (
          <p id={`${id}-error`} className="flex items-start gap-1.5 text-xs text-[var(--danger)]">
            <svg viewBox="0 0 16 16" className="mt-[0.15em] size-3.5 shrink-0" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 4.8v3.8M8 11.1h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const TextField = forwardRef<
  HTMLInputElement,
  Common & InputHTMLAttributes<HTMLInputElement>
>(function TextField({ id, label, error, hint, optional, className, ...rest }, ref) {
  return (
    <Frame id={id} error={error} hint={hint} className={className}>
      <input
        ref={ref}
        id={id}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={FIELD_BASE}
        {...rest}
      />
      <label htmlFor={id} className={LABEL_BASE}>
        {label}
        {optional ? <span className="text-muted"> (optional)</span> : null}
      </label>
    </Frame>
  );
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  Common & TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextAreaField({ id, label, error, hint, optional, className, rows = 5, ...rest }, ref) {
  return (
    <Frame id={id} error={error} hint={hint} className={className}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(FIELD_BASE, "resize-y")}
        {...rest}
      />
      <label htmlFor={id} className={LABEL_BASE}>
        {label}
        {optional ? <span className="text-muted"> (optional)</span> : null}
      </label>
    </Frame>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly { value: string; label: string }[] }
>(function SelectField({ id, label, error, hint, options, className, ...rest }, ref) {
  return (
    <Frame id={id} error={error} hint={hint} className={className}>
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(FIELD_BASE, "appearance-none bg-none pr-10")}
        {...rest}
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-2 left-3.5 font-mono text-2xs tracking-[0.12em] text-mutedfg uppercase"
      >
        {label}
      </label>
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6.5 8 10.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Frame>
  );
});

/** Live requirement list. Icon plus text, never colour alone. */
export function RequirementList({
  items,
  id,
}: {
  items: { id: string; label: string; met: boolean }[];
  id: string;
}) {
  return (
    <ul id={id} className="mt-1 grid gap-1.5">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2 text-xs">
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex size-4 items-center justify-center rounded-full border font-mono text-[9px]",
              item.met ? "border-cold text-cold" : "border-linestrong text-muted",
            )}
          >
            {item.met ? "✓" : "○"}
          </span>
          <span className={item.met ? "text-mutedfg" : "text-muted"}>{item.label}</span>
          <span className="sr-only">{item.met ? "requirement met" : "requirement not met yet"}</span>
        </li>
      ))}
    </ul>
  );
}
