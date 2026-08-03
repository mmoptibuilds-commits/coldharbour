import type { Metadata } from "next";
import { LaneExplorer, type ExplorerLane } from "@/components/lanes/lane-explorer";
import { MaskedLines } from "@/components/motion/primitives";
import { Container, Eyebrow, EmptyState, SampleNote } from "@/components/ui/primitives";
import { ClosingCta } from "@/components/sections/closing-cta";
import { getLanesWithSeries, getNetworkStats } from "@/db/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lane explorer",
  description:
    "Eight monitored lanes with live traces, risk scores and logged excursions. Filter by status, mode or product and open any lane record.",
  alternates: { canonical: "/lanes" },
};

export default async function LanesPage() {
  const [lanes, stats] = await Promise.all([getLanesWithSeries(), getNetworkStats()]);

  const rows: ExplorerLane[] = lanes.map((lane) => ({
    id: lane.id,
    slug: lane.slug,
    code: lane.code,
    origin: lane.origin,
    destination: lane.destination,
    originCode: lane.originCode,
    destinationCode: lane.destinationCode,
    mode: lane.mode,
    payload: lane.payload,
    profile: lane.profile,
    bandMin: lane.bandMin,
    bandMax: lane.bandMax,
    transitHours: lane.transitHours,
    status: lane.status,
    riskScore: lane.riskScore,
    shipmentsYtd: lane.shipmentsYtd,
    excursionCount: lane.excursionCount,
    series: lane.series.map((point) => ({ minute: point.minute, tempC: point.tempC })),
  }));

  return (
    <>
      <section className="border-b border-line py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Lane explorer</Eyebrow>
              <MaskedLines
                as="h1"
                trigger={false}
                className="display mt-5 text-4xl text-ink md:text-5xl"
                lines={["Eight lanes,", "read the way QA reads them."]}
              />
              <p className="measure mt-6 text-lg text-mutedfg">
                Each row carries the payload trace against its accepted band. Open a lane for the
                full record: readings, excursion log, custody timeline and the release decision.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px self-end overflow-hidden rounded-lg border border-line bg-line lg:col-span-5">
              {[
                ["Lanes", formatNumber(stats.lanes)],
                ["Readings", formatNumber(stats.readings)],
                ["Logged excursions", formatNumber(stats.excursions)],
                ["Shipments this year", formatNumber(stats.shipments)],
              ].map(([label, value]) => (
                <div key={label} className="bg-canvas px-5 py-5">
                  <dt className="label-mono">{label}</dt>
                  <dd className="display mt-2 text-xl text-ink tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          {rows.length === 0 ? (
            <EmptyState
              title="The sample network has not loaded"
              description="The demonstration database has no lanes yet. It seeds itself when the server starts, so reload in a moment."
            />
          ) : (
            <LaneExplorer lanes={rows} />
          )}
          <SampleNote className="mt-8">
            Synthetic dataset. Carriers, codes and readings were generated for this build and stored
            in PostgreSQL.
          </SampleNote>
        </Container>
      </section>

      <ClosingCta
        eyebrow="Your lanes"
        lines= {["These are ours.", "Bring one of yours."]}
        body="Send a lane with its profile and transit times. We will show what the record would look like on your route, including where it would still depend on your depots."
      />
    </>
  );
}
