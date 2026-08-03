import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowGlyph, ButtonLink } from "@/components/ui/button";
import { MaskedLines } from "@/components/motion/primitives";
import { NoteBody } from "@/components/notes/note-body";
import { Container, Eyebrow, SampleNote } from "@/components/ui/primitives";
import { getFieldNote } from "@/db/queries";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFieldNote(slug);
  if (!data) return { title: "Note not found" };

  return {
    title: data.note.title,
    description: data.note.dek,
    alternates: { canonical: `/field-notes/${data.note.slug}` },
    openGraph: {
      type: "article",
      title: data.note.title,
      description: data.note.dek,
      publishedTime: new Date(data.note.publishedAt).toISOString(),
      authors: [data.note.author],
    },
  };
}

export default async function FieldNotePage({ params }: Params) {
  const { slug } = await params;
  const data = await getFieldNote(slug);
  if (!data) notFound();

  const { note, more } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.dek,
    datePublished: new Date(note.publishedAt).toISOString(),
    author: { "@type": "Person", name: note.author },
    publisher: { "@type": "Organization", name: SITE.name },
    isAccessibleForFree: true,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="border-b border-line py-12 md:py-16">
          <Container>
            <nav aria-label="Breadcrumb" className="mb-8">
              <Link
                href="/field-notes"
                className="group inline-flex items-center gap-2 font-mono text-2xs tracking-[0.12em] text-muted uppercase hover:text-ink"
              >
                <ArrowGlyph className="rotate-180 group-hover:-translate-x-0.5" />
                Field notes
              </Link>
            </nav>

            <div className="max-w-3xl">
              <Eyebrow>{note.topic}</Eyebrow>
              <MaskedLines
                as="h1"
                trigger={false}
                className="display mt-5 text-3xl text-ink md:text-4xl"
                lines={[note.title]}
              />
              <p className="measure mt-6 text-lg text-mutedfg">{note.dek}</p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
                <div>
                  <dt className="label-mono">Author</dt>
                  <dd className="mt-1.5 text-sm text-ink">
                    {note.author}, {note.authorRole}
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">Published</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink">{formatDate(note.publishedAt)}</dd>
                </div>
                <div>
                  <dt className="label-mono">Reading time</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink">{note.readMinutes} min</dd>
                </div>
              </dl>
            </div>
          </Container>
        </header>

        <div className="py-14 md:py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <div className="max-w-[68ch]">
                  <NoteBody body={note.body} />
                </div>
                <SampleNote className="mt-12 border-t border-line pt-6">
                  Sample article written for this demonstration build. The author is fictional and the
                  figures come from the synthetic dataset.
                </SampleNote>
              </div>

              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <div className="rounded-lg border border-line bg-raised p-6">
                    <p className="label-mono">Read a lane instead</p>
                    <p className="mt-3 text-sm text-mutedfg">
                      Every claim in these notes comes from the same sample dataset the lane explorer
                      reads from.
                    </p>
                    <ButtonLink href="/lanes" variant="secondary" size="sm" className="group mt-5 w-full">
                      Open the lane explorer
                      <ArrowGlyph />
                    </ButtonLink>
                  </div>

                  {more.length > 0 ? (
                    <div className="mt-8">
                      <p className="label-mono">More notes</p>
                      <ul className="mt-4 space-y-4">
                        {more.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/field-notes/${item.slug}`}
                              className="group block border-t border-line pt-4"
                            >
                              <p className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                                {item.topic}
                              </p>
                              <p className="mt-2 text-base text-ink group-hover:text-accent">
                                {item.title}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </aside>
            </div>
          </Container>
        </div>
      </article>
    </>
  );
}
