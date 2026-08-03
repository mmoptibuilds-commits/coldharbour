import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, SampleNote } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy and data",
  description:
    "What this demonstration build stores, where it stores it, and how to have it removed. Written in plain terms.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    heading: "What this site stores",
    body: [
      "Two forms write to a database: the walkthrough request on the contact page, and the field notes subscription in the footer. The walkthrough form stores the name, work email, organisation, role, shipping volume, lanes of interest and message you type. The subscription form stores an email address.",
      "Nothing else is recorded. There is no analytics script, no advertising pixel, no session cookie and no third-party tag on any page of this site.",
    ],
  },
  {
    heading: "Where it goes",
    body: [
      "Both forms write to a PostgreSQL database that runs alongside this application. No email is sent, no CRM receives the record, and no data leaves the environment this build runs in.",
      "Server logs record the usual request metadata that any web server writes: time, path, status code and user agent. Form submissions are rate limited by IP address in memory, which is discarded when the process restarts.",
    ],
  },
  {
    heading: "How long it stays",
    body: [
      "This is a demonstration build, so the database may be reset at any time without notice. Treat anything you submit here as temporary and do not send confidential study information through it.",
    ],
  },
  {
    heading: "Removing your data",
    body: [
      "Email the address below and ask. There is no account system to log into and no verification step beyond replying from the address you used.",
    ],
  },
  {
    heading: "Sample content",
    body: [
      "The lanes, temperature readings, excursions, carriers, field notes, authors, scenarios and prices on this site are synthetic. They were generated for this build to show how the interface behaves with realistic data. No real shipment, customer or carrier is described anywhere on the site.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>Privacy and data</Eyebrow>
          <h1 className="display mt-5 text-4xl text-ink md:text-5xl">
            What this site keeps, and for how long
          </h1>
          <p className="measure mt-6 text-lg text-mutedfg">
            Short version: two forms, one database, no tracking, and nothing leaves this environment.
          </p>

          <div className="mt-14 space-y-12">
            {SECTIONS.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl text-ink">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="measure mt-4 text-base text-mutedfg">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-lg border border-line bg-raised p-6">
            <p className="label-mono">Contact</p>
            <p className="mt-3 text-base text-ink">
              <a href={`mailto:${SITE.contact.email}`} className="underline underline-offset-4 hover:text-accent">
                {SITE.contact.email}
              </a>
            </p>
            <p className="mt-4 text-sm text-mutedfg">
              Or go back to{" "}
              <Link href="/" className="text-ink underline underline-offset-4 hover:text-accent">
                the home page
              </Link>
              .
            </p>
          </div>

          <SampleNote className="mt-10">
            This page describes the demonstration build only. It is not a legal privacy notice for a
            production service.
          </SampleNote>
        </div>
      </Container>
    </section>
  );
}
