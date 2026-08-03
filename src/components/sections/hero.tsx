import Link from "next/link";
import { ArrowGlyph, ButtonLink } from "@/components/ui/button";
import { Sparkline } from "@/components/graphics/marks";
import {
  CountUp,
  MaskedLines,
  ParallaxLayer,
  Reveal,
  StaggerGroup,
} from "@/components/motion/primitives";
import { Container, Eyebrow, SampleNote, StatusTag } from "@/components/ui/primitives";
import type { Lane, Reading } from "@/db/schema";
import { type LaneStatus } from "@/lib/utils";

type Props = {
  lane: (Lane & { series: Pick<Reading, "minute" | "tempC">[] }) | null;
  stats: { lanes: number; countries: number; readings: number; probes: number };
};

export function Hero({ lane, stats }: Props) {
  return (
    <section className="field-top relative overflow-hidden pt-16 pb-20 md:pt-24 lg:pt-28">
      <ParallaxLayer className="pointer-events-none absolute inset-0" distance={28}>
        <div className="grid-field absolute inset-[-8%] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </ParallaxLayer>
      <Container className="relative">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>Cold chain telemetry · Clinical supply</Eyebrow>

            <MaskedLines
              as="h1"
              trigger={false}
              className="display mt-5 text-5xl text-ink md:text-6xl"
              lines={["Every reading,", "every minute,", "with the decision attached."]}
            />

            <Reveal y={12} delay={0.15}>
              <p className="measure mt-7 text-lg text-mutedfg">
                Coldharbour logs payload temperature every 60 seconds, raises a named reviewer when a
                shipment leaves its profile, and closes the run with a record your QA team can sign
                the same day.
              </p>
            </Reveal>

            <Reveal y={12} delay={0.25}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" size="lg" className="group">
                  Book a walkthrough
                  <ArrowGlyph />
                </ButtonLink>
                <ButtonLink href="/lanes" variant="secondary" size="lg">
                  Open the lane explorer
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal y={10} delay={0.35}>
              <SampleNote className="mt-8 max-w-md">
                Demonstration build. The traces on this site come from a synthetic dataset in the
                project database, not from real shipments.
              </SampleNote>
            </Reveal>
          </div>

          <Reveal y={24} delay={0.2} className="lg:col-span-5">
            {lane ? (
              <article className="rounded-xl border border-line bg-raised p-5 shadow-[var(--shadow-3),inset_0_1px_0_rgb(255_255_255/0.05)] md:p-6">
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                      Last run · {lane.code}
                    </p>
                    <h2 className="mt-2 text-xl text-ink">
                      {lane.originCode} → {lane.destinationCode}
                    </h2>
                    <p className="mt-1 text-sm text-mutedfg">
                      {lane.origin} to {lane.destination}
                    </p>
                  </div>
                  <StatusTag status={lane.status as LaneStatus} />
                </header>

                <div className="mt-6 rounded-md border border-line bg-surface p-4">
                  <Sparkline
                    points={lane.series}
                    bandMin={lane.bandMin}
                    bandMax={lane.bandMax}
                    status={lane.status as LaneStatus}
                    width={420}
                    height={104}
                    className="h-24 w-full"
                  />
                  <div className="mt-3 flex items-center justify-between font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                    <span>T+00:00</span>
                    <span>Profile {lane.profile}</span>
                    <span>T+{lane.transitHours}:00</span>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line">
                  {[
                    ["Probes", String(lane.probes)],
                    ["Transit", `${lane.transitHours} h`],
                    ["Risk", `${lane.riskScore}/100`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-surface px-4 py-3">
                      <dt className="label-mono">{label}</dt>
                      <dd className="mt-1 font-mono text-sm text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href={`/lanes/${lane.slug}`}
                  className="group mt-5 inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:text-accent hover:underline"
                >
                  Read this lane
                  <ArrowGlyph />
                </Link>
              </article>
            ) : (
              <article className="rounded-xl border border-dashed border-linestrong bg-surface p-6">
                <p className="label-mono">Lane preview</p>
                <p className="measure mt-3 text-sm text-mutedfg">
                  The sample dataset has not loaded yet. Open the lane explorer to see the traces
                  once the demonstration database finishes seeding.
                </p>
                <Link href="/lanes" className="mt-4 inline-block text-sm text-accent underline underline-offset-4">
                  Open the lane explorer
                </Link>
              </article>
            )}
          </Reveal>
        </div>

        <StaggerGroup className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:mt-24 md:grid-cols-4">
          {(
            [
              ["Monitored lanes", stats.lanes],
              ["Destination countries", stats.countries],
              ["Probes deployed", stats.probes],
              ["Readings stored", stats.readings],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="bg-canvas px-5 py-6">
              <p className="label-mono">{label}</p>
              <p className="display mt-3 text-2xl text-ink">
                <CountUp value={value} />
              </p>
            </div>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
