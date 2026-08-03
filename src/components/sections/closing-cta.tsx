import { ArrowGlyph, ButtonLink } from "@/components/ui/button";
import { MaskedLines } from "@/components/motion/primitives";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";

export function ClosingCta({
  eyebrow = "Next step",
  lines = ["Bring one lane.", "We will read it with you."],
  body = "A 40 minute call with an engineer and a quality lead. Send the lane that keeps you awake and we will walk through how the record would look, including the parts that would still be your job.",
}: {
  eyebrow?: string;
  lines?: string[];
  body?: string;
}) {
  return (
    <section className="field-close relative overflow-hidden border-t border-line py-24 md:py-32">
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_100%,black,transparent)]"
      />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{eyebrow}</Eyebrow>
            <MaskedLines
              as="h2"
              className="display mt-4 text-4xl text-ink md:text-5xl"
              lines={lines}
            />
            <p className="measure mt-6 text-lg text-mutedfg">{body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact" size="lg" className="group">
                Book a walkthrough
                <ArrowGlyph />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" size="lg">
                Compare plans
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-10">
            <dl className="space-y-6 border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div>
                <dt className="label-mono">Direct</dt>
                <dd className="mt-2 text-base text-ink">
                  <a href={`mailto:${SITE.contact.email}`} className="underline-offset-4 hover:text-accent hover:underline">
                    {SITE.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label-mono">Phone</dt>
                <dd className="mt-2 text-base text-ink">
                  <a href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:text-accent hover:underline">
                    {SITE.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label-mono">Hours</dt>
                <dd className="mt-2 text-base text-mutedfg">{SITE.contact.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
