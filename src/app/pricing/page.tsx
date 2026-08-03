import type { Metadata } from "next";
import { ArrowGlyph, ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/accordion";
import { MaskedLines, Reveal } from "@/components/motion/primitives";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Container, Eyebrow, SampleNote } from "@/components/ui/primitives";
import { FAQS, FEATURE_ROWS, PLANS } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three plans: Lane, Programme and Validated. Compare active lanes, cadence, escalation, evidence and validation support side by side.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-line py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Pricing</Eyebrow>
              <MaskedLines
                as="h1"
                trigger={false}
                className="display mt-5 text-4xl text-ink md:text-5xl"
                lines= {["Priced per lane,", "not per person."]}
              />
              <p className="measure mt-6 text-lg text-mutedfg">
                Every plan includes the full record: raw readings, escalation, audit trail and the
                evidence pack. What changes is how many lanes you run, how deep the rota goes, and how
                much validation work we take on with you.
              </p>
            </div>
            <div className="lg:col-span-5 lg:pl-10">
              <SampleNote className="lg:border-l lg:border-line lg:pl-10">
                Demonstration build. The figures below are sample pricing written for this project and
                do not represent a real quotation.
              </SampleNote>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          {/* Plan headers */}
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <Reveal key={plan.id} y={16}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-lg border p-6",
                    plan.highlight
                      ? "border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-raised shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_24px_60px_-40px_rgb(255_106_43/0.55)]"
                      : "border-line bg-surface",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-mono text-sm tracking-[0.14em] text-ink uppercase">{plan.name}</h2>
                    {plan.highlight ? (
                      <span className="rounded-xs border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-1 font-mono text-2xs tracking-[0.12em] text-accent uppercase">
                        Most common
                      </span>
                    ) : null}
                  </div>
                  <p className="display mt-6 text-4xl text-ink">{plan.price}</p>
                  <p className="mt-1 font-mono text-2xs tracking-[0.12em] text-muted uppercase">
                    {plan.cadence}
                  </p>
                  <p className="mt-5 text-sm text-mutedfg">{plan.summary}</p>
                  <ButtonLink
                    href="/contact"
                    variant={plan.highlight ? "primary" : "secondary"}
                    size="md"
                    className="group mt-8 w-full"
                  >
                    {plan.cta}
                    <ArrowGlyph />
                  </ButtonLink>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Comparison, table on desktop */}
          <div className="mt-16 hidden md:block">
            <h2 className="display text-2xl text-ink">What each plan includes</h2>
            <table className="mt-6 w-full border-collapse text-left">
              <caption className="sr-only">Feature comparison across the three plans</caption>
              <thead>
                <tr className="border-b border-linestrong">
                  <th scope="col" className="w-[28%] py-3 pr-6 font-mono text-2xs tracking-[0.14em] text-muted uppercase">
                    Feature
                  </th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={cn(
                        "py-3 pr-6 font-mono text-2xs tracking-[0.14em] uppercase",
                        plan.highlight ? "text-accent" : "text-muted",
                      )}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row) => (
                  <tr key={row} className="border-b border-line">
                    <th scope="row" className="py-4 pr-6 text-sm font-normal text-ink">
                      {row}
                    </th>
                    {PLANS.map((plan) => (
                      <td
                        key={plan.id}
                        className={cn(
                          "py-4 pr-6 font-mono text-sm",
                          plan.highlight ? "text-ink" : "text-mutedfg",
                        )}
                      >
                        {plan.features[row]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comparison, stacked on small screens */}
          <div className="mt-14 space-y-10 md:hidden">
            <h2 className="display text-2xl text-ink">What each plan includes</h2>
            {PLANS.map((plan) => (
              <div key={plan.id}>
                <h3 className="font-mono text-sm tracking-[0.14em] text-ink uppercase">{plan.name}</h3>
                <dl className="mt-3 border-t border-line">
                  {FEATURE_ROWS.map((row) => (
                    <div key={row} className="flex justify-between gap-6 border-b border-line py-3">
                      <dt className="text-sm text-mutedfg">{row}</dt>
                      <dd className="text-right font-mono text-sm text-ink">{plan.features[row]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="display mt-4 text-2xl text-ink md:text-3xl">
                The ones we get asked on every first call
              </h2>
              <p className="measure mt-5 text-sm text-mutedfg">
                If yours is not here, put it in the message when you book a walkthrough and we will
                answer it on the call.
              </p>
            </div>
            <div className="lg:col-span-8">
              <Faq items={FAQS} />
            </div>
          </div>
        </Container>
      </section>

      <ClosingCta
        eyebrow="Before you commit"
        lines={["Start with one lane", "and compare the records."]}
        body="Most teams run Coldharbour next to their existing loggers for a quarter, then decide. We will help you set the comparison up so it produces an answer rather than an argument."
      />
    </>
  );
}
