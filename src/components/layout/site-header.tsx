"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BandGlyph } from "@/components/graphics/marks";
import { ButtonLink } from "@/components/ui/button";
import { ScrollProgress } from "@/components/motion/primitives";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ networkStatus }: { networkStatus: string }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const onScroll = () => {
      node.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="group/header fixed inset-x-0 top-0 z-40 h-[var(--header-h)] border-b border-transparent bg-transparent transition-[background-color,border-color,backdrop-filter] duration-[260ms] data-[scrolled=true]:border-line data-[scrolled=true]:bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] data-[scrolled=true]:backdrop-blur-md"
    >
      <div className="container-page flex h-[var(--header-h)] items-center gap-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-sm py-2 text-ink"
          aria-label={`${SITE.name} home`}
        >
          <BandGlyph className="size-7 text-mutedfg transition-colors duration-[180ms] group-hover:text-ink" />
          <span className="display text-lg tracking-[-0.02em]">{SITE.name}</span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm transition-colors duration-[180ms]",
                isActive(item.href) ? "text-ink" : "text-mutedfg hover:text-ink",
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive(item.href) ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/lanes"
            className="hidden items-center gap-2 rounded-md border border-line bg-raised px-3 py-2 font-mono text-2xs tracking-[0.1em] text-mutedfg uppercase transition-colors duration-[180ms] hover:border-linestrong hover:text-ink md:inline-flex"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-cold" />
            {networkStatus}
          </Link>
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Book a walkthrough
          </ButtonLink>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-raised text-ink transition-colors duration-[180ms] hover:border-linestrong active:scale-[0.97] lg:hidden"
              >
                <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
                  <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="drawer-overlay fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--canvas)_78%,transparent)] backdrop-blur-sm" />
              <Dialog.Content className="drawer-content fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col border-l border-line bg-surface shadow-[var(--shadow-3)]">
                <div className="flex h-[var(--header-h)] items-center justify-between border-b border-line px-5">
                  <Dialog.Title className="label-mono">Menu</Dialog.Title>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="inline-flex size-10 items-center justify-center rounded-md border border-line bg-raised text-ink transition-colors duration-[180ms] hover:border-linestrong active:scale-[0.97]"
                  >
                    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
                      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </Dialog.Close>
                </div>

                <Dialog.Description className="sr-only">
                  Site navigation and contact details
                </Dialog.Description>

                <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
                  {[{ href: "/", label: "Home" }, ...NAV].map((item) => (
                    <Dialog.Close asChild key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) && item.href !== "/" ? "page" : undefined}
                        className="flex items-center justify-between border-b border-line py-4 text-lg text-ink transition-colors duration-[180ms] hover:text-accent"
                      >
                        {item.label}
                        <span aria-hidden="true" className="font-mono text-xs text-muted">
                          {isActive(item.href) && item.href !== "/" ? "current" : "→"}
                        </span>
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>

                <div className="mt-auto space-y-4 border-t border-line p-5">
                  <ButtonLink
                    href="/contact"
                    size="md"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Book a walkthrough
                  </ButtonLink>
                  <p className="font-mono text-2xs leading-relaxed tracking-[0.08em] text-muted uppercase">
                    {SITE.contact.email}
                    <br />
                    {SITE.contact.hours}
                  </p>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}
