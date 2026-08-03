"use client";

import Link from "next/link";
import {
  forwardRef,
  useCallback,
  useRef,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const BASE =
  "relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-[180ms] " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] " +
  "disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55";

const VARIANTS: Record<Variant, string> = {
  primary:
    "rounded-md bg-accent text-accentfg shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_28px_-16px_rgb(255_106_43/0.9)] hover:bg-accenthover",
  secondary:
    "rounded-md border border-line bg-raised text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] hover:border-linestrong hover:bg-overlay",
  ghost:
    "rounded-md border border-transparent text-ink hover:border-line hover:bg-raised",
  quiet:
    "rounded-sm px-0 text-ink underline-offset-[6px] decoration-[var(--border-strong)] hover:decoration-[var(--accent)] underline",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(BASE, VARIANTS[variant], variant === "quiet" ? "h-auto" : SIZES[size], className);
}

/** Click-origin ripple, clipped to the host radius, cleaned up on animation end. */
function useRipple<T extends HTMLElement>() {
  const hostRef = useRef<T | null>(null);

  const spawn = useCallback((clientX?: number, clientY?: number) => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = host.getBoundingClientRect();
    const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
    const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
    const radius = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y),
    );

    const dot = document.createElement("span");
    dot.className = "ripple-dot";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = `${radius * 2}px`;
    dot.style.height = `${radius * 2}px`;
    dot.addEventListener("animationend", () => dot.remove(), { once: true });

    while (host.querySelectorAll(".ripple-dot").length > 3) {
      host.querySelector(".ripple-dot")?.remove();
    }
    host.appendChild(dot);
  }, []);

  return { hostRef, spawn };
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, loading, loadingLabel = "Working", children, onPointerDown, onClick, disabled, ...rest },
  forwardedRef,
) {
  const { hostRef, spawn } = useRipple<HTMLButtonElement>();

  return (
    <button
      ref={(node) => {
        hostRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
        spawn(event.clientX, event.clientY);
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        if (event.detail === 0) spawn();
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  onPointerDown,
  children,
  ...rest
}: ButtonLinkProps) {
  const { hostRef, spawn } = useRipple<HTMLAnchorElement>();

  return (
    <Link
      ref={hostRef}
      className={buttonClasses(variant, size, className)}
      onPointerDown={(event) => {
        spawn(event.clientX, event.clientY);
        onPointerDown?.(event);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 animate-spin", className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Arrow that shifts on hover. Used inside buttons and row links. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4 transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5", className)}
      fill="none"
      aria-hidden="true"
    >
      <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
