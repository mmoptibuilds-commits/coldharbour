import Link from "next/link";
import { BandGlyph } from "@/components/graphics/marks";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/platform", label: "How it works" },
      { href: "/lanes", label: "Lane explorer" },
      { href: "/pricing", label: "Plans and pricing" },
      { href: "/platform#evidence", label: "Evidence pack" },
    ],
  },
  {
    heading: "Reading",
    links: [
      { href: "/field-notes", label: "Field notes" },
      { href: "/field-notes/ramp-time-breaks-more-shipments-than-flight-time", label: "Where lanes fail" },
      { href: "/field-notes/seven-questions-inspectors-ask-about-a-temperature-record", label: "Audit questions" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/contact", label: "Book a walkthrough" },
      { href: "/privacy", label: "Privacy and data" },
      { href: "/api/health", label: "Service health" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line bg-surface">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-ink">
            <BandGlyph className="size-7 text-mutedfg" />
            <span className="display text-lg">{SITE.name}</span>
          </Link>
          <p className="measure mt-4 text-sm text-mutedfg">
            Temperature and custody monitoring for clinical shipments. Built for the people who sign
            the release.
          </p>
          <div className="mt-8">
            <SubscribeForm />
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="label-mono">{column.heading}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-mutedfg underline-offset-4 transition-colors duration-[180ms] hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
            Demonstration build. Lanes, readings, field notes and scenarios are synthetic sample data.
          </p>
          <p className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
            {SITE.contact.email} · {SITE.contact.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}
