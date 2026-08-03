import { ArrowGlyph, ButtonLink } from "@/components/ui/button";
import { Reveal, StaggerGroup } from "@/components/motion/primitives";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { EVIDENCE_ITEMS } from "@/lib/site";

export function Evidence() {
  return (
    <section className="border-t border-line py-24 md:py-32" aria-labelledby="evidence-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>What QA receives</Eyebrow>
            <h2 id="evidence-title" className="display mt-4 text-3xl text-ink md:text-4xl">
              One record, built while the shipment moves
            </h2>
            <p className="measure mt-6 text-base text-mutedfg">
              An inspector will ask which probe produced a reading, whether it was with the product,
              who saw the alert, and who released the shipment. Each answer is a link inside the same
              record rather than a week of chasing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/platform#evidence" variant="secondary" size="md" className="group">
                See the pack in detail
                <ArrowGlyph />
              </ButtonLink>
              <ButtonLink href="/field-notes/seven-questions-inspectors-ask-about-a-temperature-record" variant="ghost" size="md">
                Read the audit questions
              </ButtonLink>
            </div>
          </div>

          <Reveal y={18} className="lg:col-span-7">
            <div className="overflow-hidden rounded-lg border border-line bg-raised shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
              <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
                <p className="font-mono text-2xs tracking-[0.16em] text-mutedfg uppercase">
                  Release evidence pack
                </p>
                <p className="font-mono text-2xs tracking-[0.16em] text-muted uppercase">
                  Template · v4
                </p>
              </div>
              <StaggerGroup className="divide-y divide-line">
                {EVIDENCE_ITEMS.map(([title, detail], index) => (
                  <div key={title} className="flex gap-5 px-5 py-5">
                    <span className="mt-0.5 font-mono text-xs text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base text-ink">{title}</h3>
                      <p className="mt-1.5 text-sm text-mutedfg">{detail}</p>
                    </div>
                  </div>
                ))}
              </StaggerGroup>
              <div className="border-t border-line bg-surface px-5 py-4">
                <p className="font-mono text-2xs leading-relaxed tracking-[0.08em] text-muted uppercase">
                  Coldharbour supplies the record and the documentation. Validating the system inside
                  your quality management framework stays with you.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
