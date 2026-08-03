import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/button";
import { LaneChart } from "@/components/graphics/lane-chart";
import { Reveal } from "@/components/motion/primitives";
import { Container, Eyebrow, SampleNote, StatusTag } from "@/components/ui/primitives";
import type { Excursion, Lane, Reading } from "@/db/schema";
import { elapsedClock, formatMinutes, type LaneStatus } from "@/lib/utils";

export function LaneReader({
  lane,
  series,
  events,
}: {
  lane: Lane;
  series: Reading[];
  events: Excursion[];
}) {
  const event = events[0];

  return (
    <section className="border-t border-line py-24 md:py-32" aria-labelledby="reader-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Eyebrow>Read a lane</Eyebrow>
            <h2 id="reader-title" className="display mt-4 text-3xl text-ink md:text-4xl">
              The trace is the argument
            </h2>
            <p className="measure mt-6 text-base text-mutedfg">
              This is {lane.code} exactly as the platform stores it: payload against ambient, the
              accepted band shaded, and the logged excursion marked in the timeline. Nothing is
              smoothed and nothing is redrawn for the website.
            </p>

            {event ? (
              <dl className="mt-8 space-y-4 border-t border-line pt-6">
                <div>
                  <dt className="label-mono">Excursion window</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink">
                    T+{elapsedClock(event.startMinute)} to T+{elapsedClock(event.endMinute)} ·{" "}
                    {formatMinutes(event.endMinute - event.startMinute)}
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">Peak / MKT</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink">
                    {event.peakTempC.toFixed(1)} °C / {event.mkt.toFixed(1)} °C
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">Cause</dt>
                  <dd className="mt-1.5 text-sm text-mutedfg">{event.cause}</dd>
                </div>
                <div>
                  <dt className="label-mono">Outcome</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink capitalize">{event.outcome}</dd>
                </div>
              </dl>
            ) : null}

            <Link
              href={`/lanes/${lane.slug}`}
              className="group mt-8 inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Open the full lane record
              <ArrowGlyph />
            </Link>
          </div>

          <Reveal y={20} className="lg:col-span-8">
            <div className="rounded-lg border border-line bg-raised p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] md:p-6">
              <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-mono text-sm text-ink">{lane.code}</h3>
                  <p className="mt-1 text-sm text-mutedfg">
                    {lane.origin} → {lane.destination} · {lane.payload}
                  </p>
                </div>
                <StatusTag status={lane.status as LaneStatus} />
              </header>

              <div className="rounded-md border border-line bg-surface p-3 md:p-4">
                <LaneChart
                  laneCode={lane.code}
                  points={series.map((r) => ({ minute: r.minute, tempC: r.tempC, ambientC: r.ambientC }))}
                  bandMin={lane.bandMin}
                  bandMax={lane.bandMax}
                  events={events.map((e) => ({
                    startMinute: e.startMinute,
                    endMinute: e.endMinute,
                    peakTempC: e.peakTempC,
                  }))}
                  height={320}
                />
              </div>

              <SampleNote className="mt-5">
                Synthetic dataset generated for this build, stored in PostgreSQL and read at request
                time.
              </SampleNote>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
