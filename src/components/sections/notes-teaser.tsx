import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/button";
import { Reveal } from "@/components/motion/primitives";
import { Container, Eyebrow } from "@/components/ui/primitives";
import type { FieldNote } from "@/db/schema";
import { formatDate } from "@/lib/utils";

export function NotesTeaser({ notes }: { notes: FieldNote[] }) {
  if (notes.length === 0) return null;

  return (
    <section className="border-t border-line py-24 md:py-32" aria-labelledby="notes-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>Field notes</Eyebrow>
            <h2 id="notes-title" className="display mt-4 text-3xl text-ink md:text-4xl">
              Written by the people who read the traces
            </h2>
          </div>
          <Link
            href="/field-notes"
            className="group inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            All field notes
            <ArrowGlyph />
          </Link>
        </div>

        <ul className="mt-14 border-t border-line">
          {notes.map((note) => (
            <li key={note.slug}>
              <Reveal y={12}>
                <Link
                  href={`/field-notes/${note.slug}`}
                  className="group grid gap-4 border-b border-line py-8 transition-colors duration-[260ms] hover:bg-surface md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
                >
                  <div className="md:col-span-3">
                    <p className="label-mono">{note.topic}</p>
                    <p className="mt-2 font-mono text-2xs text-muted">
                      {formatDate(note.publishedAt)} · {note.readMinutes} min
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="text-xl text-ink transition-colors duration-[180ms] group-hover:text-accent">
                      {note.title}
                    </h3>
                    <p className="measure mt-2 text-sm text-mutedfg">{note.dek}</p>
                  </div>
                  <div className="md:col-span-1 md:text-right">
                    <ArrowGlyph className="inline-block text-muted transition-colors group-hover:text-accent" />
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
