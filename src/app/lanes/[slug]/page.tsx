import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowGlyph, ButtonLink } from "@/components/ui/button";
import { LaneChart } from "@/components/graphics/lane-chart";
import { MaskedLines, Reveal } from "@/components/motion/primitives";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Container, Eyebrow, SampleNote, SpecRow, StatusTag } from "@/components/ui/primitives";
import { getLaneBySlug } from "@/db/queries";
import type { Lane } from "@/db/schema";
import {
  MODE_LABEL,
  STATUS_META,
  elapsedClock,
  formatMinutes,
  formatNumber,
  type LaneMode,
  type LaneStatus,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLaneBySlug(slug);
  if (!data) return { title: "Lane not found" };

  const { lane } = data;
  return {
    title: `${lane.code} · ${lane.originCode} to ${lane.destinationCode}`,
    description: `${lane.payload} on a ${lane.profile} profile, ${lane.transitHours} hours ${lane.origin} to ${lane.destination}. Sample lane record with readings and excursion log.`,
    alternates: { canonical: `/lanes/${lane.slug}` },
  };
}

function custodySteps(lane: Lane) {
  const total = lane.transitHours * 60;
  if (lane.mode === "road") {
    return [
      { at: 0, label: "Depot handover", detail: `${lane.origin}. Probes paired at pack out.` },
      { at: Math.round(total * 0.08), label: "Seal and depart", detail: "Trailer set point confirmed against the profile." },
      { at: Math.round(total * 0.52), label: "Driver break", detail: "Unit stays powered. Ambient rises, payload holds." },
      { at: Math.round(total * 0.94), label: "Receiving dock", detail: `${lane.destination}. Reading compared against the depot log.` },
      { at: total, label: "Release decision", detail: "QA reviewer signs against the full record." },
    ];
  }
  return [
    { at: 0, label: "Depot handover", detail: `${lane.origin}. Probes paired at pack out.` },
    { at: Math.round(total * 0.1), label: "Airline acceptance", detail: "Airway bill matched to the shipment record." },
    { at: Math.round(total * 0.18), label: "Ramp and uplift", detail: "The window that produces most out-of-band minutes." },
    { at: Math.round(total * 0.82), label: "Arrival handling", detail: `${lane.destination}. Offload to the bonded area.` },
    { at: Math.round(total * 0.92), label: "Customs", detail: "Power availability decides how this leg reads." },
    { at: total, label: "Release decision", detail: "QA reviewer signs against the full record." },
  ];
}

export default async function LaneDetailPage({ params }: Params) {
  const { slug } = await params;
  const data = await getLaneBySlug(slug);
  if (!data) notFound();

  const { lane, series, events, related } = data;
  const status = lane.status as LaneStatus;
  const points = series.map((r) => ({ minute: r.minute, tempC: r.tempC, ambientC: r.ambientC }));
  const temps = points.map((p) => p.tempC);
  const peak = temps.length > 0 ? Math.max(...temps) : 0;
  const trough = temps.length > 0 ? Math.min(...temps) : 0;
  const outMinutes = points.filter((p) => p.tempC > lane.bandMax || p.tempC < lane.bandMin).length * 20;

  return (
    <>
      <section className="border-b border-line py-10 md:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/lanes"
              className="group inline-flex items-center gap-2 font-mono text-2xs tracking-[0.12em] text-muted uppercase hover:text-ink"
            >
              <ArrowGlyph className="rotate-180 group-hover:-translate-x-0.5" />
              All lanes
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>{lane.code}</Eyebrow>
              <MaskedLines
                as="h1"
                trigger={false}
                className="display mt-4 text-4xl text-ink md:text-5xl"
                lines={[`${lane.originCode} → ${lane.destinationCode}`]}
              />
              <p className="mt-4 text-lg text-mutedfg">
                {lane.origin} to {lane.destination} · {MODE_LABEL[lane.mode as LaneMode]}
              </p>
              <p className="measure mt-6 text-base text-mutedfg">{lane.summary}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <StatusTag status={status} />
                <span className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                  {STATUS_META[status].note}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-line bg-line lg:col-span-5">
              {[
                ["Profile", lane.profile],
                ["Transit", `${lane.transitHours} h`],
                ["Distance", `${formatNumber(lane.distanceKm)} km`],
                ["Probes", String(lane.probes)],
                ["Carrier", lane.carrier],
                ["Shipments", formatNumber(lane.shipmentsYtd)],
              ].map(([label, value]) => (
                <div key={label} className="bg-canvas px-5 py-4">
                  <dt className="label-mono">{label}</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="rounded-lg border border-line bg-raised p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] md:p-6">
            <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl text-ink">Payload trace, last run</h2>
                <p className="mt-1 text-sm text-mutedfg">
                  {lane.payload} · departed {new Date(lane.lastDeparture).toISOString().slice(0, 10)}
                </p>
              </div>
              <dl className="flex flex-wrap gap-6">
                {[
                  ["Peak", `${peak.toFixed(1)} °C`],
                  ["Low", `${trough.toFixed(1)} °C`],
                  ["Out of band", outMinutes > 0 ? formatMinutes(outMinutes) : "None"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="label-mono">{label}</dt>
                    <dd className="mt-1 font-mono text-sm text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </header>

            <div className="rounded-md border border-line bg-surface p-3 md:p-4">
              <LaneChart
                laneCode={lane.code}
                points={points}
                bandMin={lane.bandMin}
                bandMax={lane.bandMax}
                events={events.map((e) => ({
                  startMinute: e.startMinute,
                  endMinute: e.endMinute,
                  peakTempC: e.peakTempC,
                }))}
                height={360}
              />
            </div>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="display text-2xl text-ink">Excursion log</h2>
              {events.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-linestrong bg-surface p-6">
                  <p className="text-base text-ink">No excursion logged on this lane.</p>
                  <p className="measure mt-2 text-sm text-mutedfg">
                    Every reading on the last run stayed inside {lane.profile}. The record still
                    carries the full trace, the probe certificates and the release signature.
                  </p>
                </div>
              ) : (
                <ol className="mt-6 space-y-6">
                  {events.map((event) => (
                    <Reveal key={event.id} y={14}>
                      <li className="rounded-lg border border-line bg-raised p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-mono text-sm text-accent">
                            T+{elapsedClock(event.startMinute)} → T+{elapsedClock(event.endMinute)}
                          </p>
                          <p className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                            {formatMinutes(event.endMinute - event.startMinute)} out of band
                          </p>
                        </div>
                        <h3 className="mt-3 text-lg text-ink">{event.stage}</h3>
                        <dl className="mt-5 space-y-4">
                          <div>
                            <dt className="label-mono">Cause</dt>
                            <dd className="mt-1.5 text-sm text-mutedfg">{event.cause}</dd>
                          </div>
                          <div>
                            <dt className="label-mono">Response</dt>
                            <dd className="mt-1.5 text-sm text-mutedfg">{event.response}</dd>
                          </div>
                        </dl>
                        <dl className="mt-6 border-t border-line pt-4">
                          <SpecRow label="Peak" value={`${event.peakTempC.toFixed(1)} °C`} />
                          <SpecRow label="MKT over the leg" value={`${event.mkt.toFixed(1)} °C`} />
                          <SpecRow label="Outcome" value={<span className="capitalize">{event.outcome}</span>} />
                        </dl>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              )}
            </div>

            <div className="lg:col-span-5">
              <h2 className="display text-2xl text-ink">Chain of custody</h2>
              <ol className="mt-6 border-l border-line pl-6">
                {custodySteps(lane).map((step) => (
                  <li key={step.label} className="relative pb-7 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[1.6rem] size-2 rounded-full border border-linestrong bg-canvas"
                    />
                    <p className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
                      T+{elapsedClock(step.at)}
                    </p>
                    <h3 className="mt-1.5 text-base text-ink">{step.label}</h3>
                    <p className="mt-1 text-sm text-mutedfg">{step.detail}</p>
                  </li>
                ))}
              </ol>

              <SampleNote className="mt-8">
                Timeline positions are derived from the lane transit time in the sample dataset.
              </SampleNote>
            </div>
          </div>

          {related.length > 0 ? (
            <div className="mt-20 border-t border-line pt-10">
              <div className="flex items-end justify-between gap-6">
                <h2 className="display text-xl text-ink">Other lanes</h2>
                <Link href="/lanes" className="group inline-flex items-center gap-2 text-sm text-mutedfg hover:text-ink">
                  All lanes
                  <ArrowGlyph />
                </Link>
              </div>
              <ul className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/lanes/${item.slug}`}
                      className="group flex h-full flex-col justify-between rounded-lg border border-line bg-raised p-5 transition-colors duration-[180ms] hover:border-linestrong"
                    >
                      <div>
                        <p className="font-mono text-sm text-ink group-hover:text-accent">{item.code}</p>
                        <p className="mt-1.5 text-sm text-mutedfg">
                          {item.origin} → {item.destination}
                        </p>
                      </div>
                      <div className="mt-6 flex items-end justify-between gap-3">
                        <StatusTag status={item.status as LaneStatus} />
                        <span className="font-mono text-2xs text-muted">Risk {item.riskScore}/100</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-16 flex flex-wrap gap-3">
            <ButtonLink href="/contact" size="lg" className="group">
              Book a walkthrough
              <ArrowGlyph />
            </ButtonLink>
            <ButtonLink href="/platform" variant="secondary" size="lg">
              How the record is built
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ClosingCta
        eyebrow="Compare with your own"
        lines={["Your lane, read the", "same way in 40 minutes."]}
        body="Send the origin, destination, profile and transit time. We will map where your current record would have gaps on this route."
      />
    </>
  );
}
