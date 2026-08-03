"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky index for long pages. Anchor links keep working without JavaScript. */
export function SectionIndex({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.4] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <p className="label-mono">On this page</p>
      <ol className="mt-4 space-y-1">
        {sections.map((section, index) => {
          const on = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-sm py-2 text-sm transition-colors duration-[180ms]",
                  on ? "text-ink" : "text-mutedfg hover:text-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px transition-all duration-[260ms]",
                    on ? "w-6 bg-accent" : "w-3 bg-linestrong",
                  )}
                />
                <span className="font-mono text-2xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
