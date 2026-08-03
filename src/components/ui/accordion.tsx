"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <RadixAccordion.Root type="single" collapsible className="border-t border-line">
      {items.map((item, index) => (
        <RadixAccordion.Item key={item.q} value={`item-${index}`} className="border-b border-line">
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-[180ms] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]">
              <span className="text-lg text-ink group-hover:text-accent">{item.q}</span>
              <span
                aria-hidden="true"
                className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-xs border border-line text-muted transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:text-accent"
              >
                <svg viewBox="0 0 16 16" className="size-3" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="accordion-content overflow-hidden">
            <p className="measure pb-6 text-base text-mutedfg">{item.a}</p>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
