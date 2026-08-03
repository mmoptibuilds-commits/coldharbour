import type { Metadata } from "next";
import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/button";
import { SectionIndex } from "@/components/layout/section-index";
import { MaskedLines, Reveal } from "@/components/motion/primitives";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Container, Eyebrow, SampleNote, SpecRow, Tag } from "@/components/ui/primitives";
import { EVIDENCE_ITEMS, PLATFORM_SECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Probes, ingest, escalation, evidence, integrations and security. How a reading becomes a release decision, described in the detail an engineer needs.",
  alternates: { canonical: "/platform" },
};

const PROBE_SPECS: [string, string][] = [
  ["Range", "-80 °C to 60 °C"],
  ["Accuracy", "±0.3 °C from -30 to 30 °C"],
  ["Logging", "60 s, event triggered to 10 s"],
  ["Upload", "Cellular, 15 min cycle"],
  ["Buffer", "72 h on board"],
  ["Battery", "14 months at full cadence"],
  ["Ingress", "IP67, single use or reusable"],
  ["Position", "Cell tower and GNSS on upload"],
];

const ESCALATION = [
  ["Minute 0", "Reading crosses the profile limit. The record opens an event."],
  ["Minute 0 to 1", "On-call reviewer raised by push and SMS with lane, probe, value and slope."],
  ["Minute 5", "No acknowledgement. The backup reviewer is raised by voice call."],
  ["Minute 15", "Still open. The depot contact and the programme lead join the thread."],
  ["Close", "Reviewer records the response and the outcome against the shipment."],
];

const INTEGRATIONS = [
  ["Webhooks", "Signed with HMAC SHA-256, retried with backoff for 24 hours, replayable from the console."],
  ["REST API", "Cursor paginated reads for lanes, shipments, readings and events. Write access for shipment metadata."],
  ["Warehouse", "Scheduled CSV or Parquet to SFTP or S3, partitioned by shipment."],
  ["Systems", "SAP EWM, Veeva Vault, ServiceNow and Slack, each with a documented field mapping."],
];

const SECURITY = [
  ["Data residency", "EU or US region, chosen per tenant at onboarding."],
  ["Access", "SSO through SAML or OIDC, role based, with per-programme scoping."],
  ["Audit trail", "Append only. Readings cannot be edited or deleted, and every export is logged."],
  ["Retention", "3 to 12 years by plan, with legal hold on any shipment under review."],
  ["Backups", "Point in time recovery to 35 days, restore tested quarterly."],
  ["Certification", "Not claimed on this demonstration build. Ask for the current status."],
];

export default function PlatformPage() {
  return (
    <>
      <section className="field-top relative overflow-hidden border-b border-line pt-16 pb-16 md:pt-24">
        <div
          aria-hidden="true"
          className="grid-field pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <Eyebrow>Platform</Eyebrow>
          <MaskedLines
            as="h1"
            trigger={false}
            className="display mt-5 max-w-4xl text-4xl text-ink md:text-5xl"
            lines={["From one reading", "to a signed release."]}
          />
          <p className="measure mt-6 text-lg text-mutedfg">
            Six parts, each with a job. Read them in order and you have the whole path a temperature
            value travels, from the probe in the box to the record an inspector opens two years later.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <SectionIndex sections={PLATFORM_SECTIONS} />
            </div>

            <div className="space-y-24 lg:col-span-9">
              <article id="hardware" className="scroll-mt-28">
                <Eyebrow>01 · Hardware</Eyebrow>
                <h2 className="display mt-4 text-3xl text-ink">Probes that travel with the product</h2>
                <p className="measure mt-5 text-base text-mutedfg">
                  A probe taped to the outside of a pallet wrap measures the warehouse. Ours sit in the
                  payload cavity, paired to the shipment at pack out, with the placement photographed
                  into the record. Bring your own loggers if you prefer; the ingest API accepts any
                  device that can post JSON.
                </p>
                <Reveal y={14}>
                  <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
                    {PROBE_SPECS.map(([label, value]) => (
                      <SpecRow key={label} label={label} value={value} />
                    ))}
                  </dl>
                </Reveal>
              </article>

              <article id="ingest" className="scroll-mt-28">
                <Eyebrow>02 · Ingest</Eyebrow>
                <h2 className="display mt-4 text-3xl text-ink">Gaps are recorded, not hidden</h2>
                <p className="measure mt-5 text-base text-mutedfg">
                  Shipments lose signal in holds, in bonded areas and over water. The probe keeps
                  logging to on-board memory and uploads the buffer on reconnect. The record shows the
                  reading time and the upload time side by side, so a gap in coverage never looks like
                  a gap in the data.
                </p>
                <div className="mt-8 overflow-hidden rounded-lg border border-line bg-raised">
                  <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
                    <p className="font-mono text-2xs tracking-[0.14em] text-mutedfg uppercase">
                      POST /v1/readings
                    </p>
                    <Tag>Sample payload</Tag>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed text-mutedfg">
{`{
  "shipment": "SHP-4471",
  "probe": "MK4-00918",
  "readings": [
    { "at": "2026-01-14T06:32:00Z", "temp_c": 4.8, "ambient_c": 19.2 },
    { "at": "2026-01-14T06:33:00Z", "temp_c": 4.9, "ambient_c": 19.6 }
  ],
  "buffered": true
}`}
                  </pre>
                </div>
              </article>

              <article id="alerting" className="scroll-mt-28">
                <Eyebrow>03 · Alerting</Eyebrow>
                <h2 className="display mt-4 text-3xl text-ink">A rota, not a mailbox</h2>
                <p className="measure mt-5 text-base text-mutedfg">
                  Escalation runs to a named reviewer with a backup. Every raise and every
                  acknowledgement lands in the shipment record with a timestamp, which is the number
                  an inspector writes down.
                </p>
                <ol className="mt-8 border-t border-line">
                  {ESCALATION.map(([when, what]) => (
                    <li key={when} className="grid gap-2 border-b border-line py-4 sm:grid-cols-12 sm:gap-6">
                      <p className="font-mono text-2xs tracking-[0.12em] text-accent uppercase sm:col-span-3">
                        {when}
                      </p>
                      <p className="text-sm text-mutedfg sm:col-span-9">{what}</p>
                    </li>
                  ))}
                </ol>
                <p className="measure mt-6 text-sm text-mutedfg">
                  Silence rules exist for lanes where a known ambient spike is not a payload risk. QA
                  approves each rule, and the record shows which rule suppressed which alert.
                </p>
              </article>

              <article id="evidence" className="scroll-mt-28">
                <Eyebrow>04 · Evidence</Eyebrow>
                <h2 className="display mt-4 text-3xl text-ink">The pack closes with the shipment</h2>
                <p className="measure mt-5 text-base text-mutedfg">
                  Nothing is assembled after the fact. Each element attaches while the shipment moves,
                  so release is a review rather than a reconstruction.
                </p>
                <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                  {EVIDENCE_ITEMS.map(([title, detail], index) => (
                    <li key={title} className="bg-raised p-5">
                      <p className="font-mono text-2xs text-muted">{String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-2 text-base text-ink">{title}</h3>
                      <p className="mt-1.5 text-sm text-mutedfg">{detail}</p>
                    </li>
                  ))}
                </ol>
                <SampleNote className="mt-6">
                  Coldharbour supplies documentation and evidence. Validating the system inside your
                  quality framework stays with your organisation.
                </SampleNote>
              </article>

              <article id="integrations" className="scroll-mt-28">
                <Eyebrow>05 · Integrations</Eyebrow>
                <h2 className="display mt-4 text-3xl text-ink">Send it where the work happens</h2>
                <dl className="mt-8 border-t border-line">
                  {INTEGRATIONS.map(([title, detail]) => (
                    <div key={title} className="grid gap-2 border-b border-line py-5 sm:grid-cols-12 sm:gap-6">
                      <dt className="text-base text-ink sm:col-span-3">{title}</dt>
                      <dd className="text-sm text-mutedfg sm:col-span-9">{detail}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              <article id="security" className="scroll-mt-28">
                <Eyebrow>06 · Security and data</Eyebrow>
                <h2 className="display mt-4 text-3xl text-ink">Boring on purpose</h2>
                <dl className="mt-8 border-t border-line">
                  {SECURITY.map(([title, detail]) => (
                    <div key={title} className="grid gap-2 border-b border-line py-5 sm:grid-cols-12 sm:gap-6">
                      <dt className="text-base text-ink sm:col-span-3">{title}</dt>
                      <dd className="text-sm text-mutedfg sm:col-span-9">{detail}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8 text-sm text-mutedfg">
                  Reading the data first?{" "}
                  <Link href="/lanes" className="group inline-flex items-center gap-1.5 text-ink underline underline-offset-4 hover:text-accent">
                    Open the lane explorer
                    <ArrowGlyph />
                  </Link>
                </p>
              </article>
            </div>
          </div>
        </Container>
      </section>

      <ClosingCta
        eyebrow="Walk it through"
        lines={["Read the whole path", "against one of your lanes."]}
        body="Forty minutes with an engineer and a quality lead. Bring a lane, a profile and whatever you use for logging today."
      />
    </>
  );
}
