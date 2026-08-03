"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { DUR, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Travel distance in pixels. Kept small so nothing jumps. */
  y?: number;
  delay?: number;
  start?: string;
};

/** One-shot entrance for a block. Content is in the DOM and readable without JS. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 18,
  delay = 0,
  start = "top 88%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };
          if (reduce || !ref.current) return;
          gsap.from(ref.current, {
            autoAlpha: 0,
            y,
            duration: DUR.section,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start, once: true },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggered entrance for direct children of the wrapper. */
export function StaggerGroup({
  children,
  className,
  selector = ":scope > *",
  y = 14,
  start = "top 86%",
}: {
  children: ReactNode;
  className?: string;
  selector?: string;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };
          const root = ref.current;
          if (reduce || !root) return;
          const items = root.querySelectorAll(selector);
          if (items.length === 0) return;
          gsap.from(items, {
            autoAlpha: 0,
            y,
            duration: DUR.layout,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: root, start, once: true },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Headline lines that rise out of overflow masks. Each line is a real text node,
 * so screen readers and search engines read the full heading.
 */
export function MaskedLines({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
  trigger = true,
}: {
  lines: string[];
  className?: string;
  as?: ElementType;
  delay?: number;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };
          const root = ref.current;
          if (reduce || !root) return;
          const spans = root.querySelectorAll(".line-mask > span");
          gsap.from(spans, {
            yPercent: 108,
            duration: DUR.cinematic,
            ease: "expo.out",
            stagger: 0.07,
            delay,
            scrollTrigger: trigger ? { trigger: root, start: "top 90%", once: true } : undefined,
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span className="line-mask" key={`${line}-${index}`}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Vertical parallax for a decorative layer. Transform only, 40px maximum. */
export function ParallaxLayer({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}

/** Counts to a value once, then holds. Falls back to the final number. */
export function CountUp({
  value,
  className,
  format = (n: number) => new Intl.NumberFormat("en-GB").format(Math.round(n)),
  suffix = "",
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const node = ref.current;
        if (!node) return;
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
          onUpdate: () => {
            node.textContent = `${format(counter.n)}${suffix}`;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {`${format(value)}${suffix}`}
    </span>
  );
}

/** Thin scroll progress line under the header. Writes to a ref, never to state. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        node.style.transform = `scaleX(${ratio})`;
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent"
    />
  );
}
