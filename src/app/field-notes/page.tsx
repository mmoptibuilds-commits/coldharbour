import type { Metadata } from "next";
import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/button";
import { MaskedLines, Reveal } from "@/components/motion/primitives";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Container, EmptyState, Eyebrow, SampleNote } from "@/components/ui/primitives";
import { getFieldNotes } from "@/db/queries";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Field notes",
  description:
    "Excursion teardowns, dry ice arithmetic, escalation procedures and audit questions. Written by the people who read the traces.",
  alternates: { canonical: "/field-notes" },
};

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function FieldNotesPage({ searchParams }: Props) {
  const { topic } = await searchParams;
  const notes = await getFieldNotes();
  const topics = Array.from(new Set(notes.map((note) => note.topic))).sort();
  const active = topic && topics.includes(topic) ? topic : undefined;
  const visible = active ? notes.filter((note) => note.topic === active) : notes;

  return (
    <>
      <section className="border-b border-line py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Field notes</Eyebrow>
              <MaskedLines
                as="h1"
                trigger={false}
                className="display mt-5 text-4xl text-ink md:text-5xl"
                lines={["Notes from lanes", "that went wrong."]}
              />
              <p className="measure mt-6 text-lg text-mutedfg">
                Teardowns, arithmetic and procedure. Written for people who have to defend a
                temperature record, not for a search engine.
              </p>
            </div>
          </div>

          {topics.length > 0 ? (
            <nav aria-label="Filter by topic" className="mt-10 flex flex-wrap items-center gap-2">
              <Link
                href="/field-notes"
                aria-current={active ? undefined : "true"}
                className={cn(
                  "inline-flex h-9 items-center rounded-md border px-3 font-mono text-2xs tracking-[0.12em] uppercase transition-colors duration-[180ms]",
                  active
                    ? "border-line text-mutedfg hover:border-linestrong hover:text-ink"
                    : "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent",
                )}
              >
                All
              </Link>
              {topics.map((item) => {
                const on = item === active;
                return (
                  <Link
                    key={item}
                    href={`/field-notes?topic=${encodeURIComponent(item)}`}
                    aria-current={on ? "true" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-md border px-3 font-mono text-2xs tracking-[0.12em] uppercase transition-colors duration-[180ms]",
                      on
                        ? "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent"
                        : "border-line text-mutedfg hover:border-linestrong hover:text-ink",
                    )}
                  >
                    {item}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          {visible.length === 0 ? (
            <EmptyState
              title={active ? `No notes filed under ${active} yet` : "No notes have loaded"}
              description={
                active
                  ? "That topic is empty in the sample dataset. Clear the filter to see everything published."
                  : "The demonstration database seeds itself when the server starts. Reload in a moment."
              }
              action={
                <Link
                  href="/field-notes"
                  className="text-sm text-accent underline underline-offset-4 hover:text-accenthover"
                >
                  Clear the filter
                </Link>
              }
            />
          ) : (
            <ul className="border-t border-line">
              {visible.map((note) => (
                <li key={note.slug}>
                  <Reveal y={12}>
                    <Link
                      href={`/field-notes/${note.slug}`}
                      className="group grid gap-4 border-b border-line py-8 transition-colors duration-[260ms] hover:bg-surface md:grid-cols-12 md:gap-8 md:px-4"
                    >
                      <div className="md:col-span-3">
                        <p className="label-mono">{note.topic}</p>
                        <p className="mt-2 font-mono text-2xs text-muted">
                          {formatDate(note.publishedAt)} · {note.readMinutes} min read
                        </p>
                      </div>
                      <div className="md:col-span-8">
                        <h2 className="text-xl text-ink transition-colors duration-[180ms] group-hover:text-accent md:text-2xl">
                          {note.title}
                        </h2>
                        <p className="measure mt-3 text-base text-mutedfg">{note.dek}</p>
                        <p className="mt-4 font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                          {note.author} · {note.authorRole}
                        </p>
                      </div>
                      <div className="md:col-span-1 md:text-right">
                        <ArrowGlyph className="inline-block text-muted transition-colors group-hover:text-accent" />
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

          <SampleNote className="mt-10">
            Sample articles written for this demonstration build. Authors are fictional.
          </SampleNote>
        </Container>
      </section>

      <ClosingCta
        eyebrow="Beyond reading"
        lines={["Bring the lane", "behind the question."]}
        body="If one of these notes matched something you are dealing with, send us the lane and we will read the trace with you."
      />
    </>
  );
}
