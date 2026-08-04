export const SITE = {
  name: "Coldharbour",
  tagline: "Temperature evidence for clinical shipments",
  description:
    "Coldharbour logs payload temperature every 60 seconds, escalates an excursion to a named reviewer, and assembles the release evidence your QA team signs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_GB",
  contact: {
    email: "mmoptibuilds@gmail.com",
    phone: "+91 78996 20405",
    address: "Sample address for this demonstration build",
    hours: "Monday to Friday, 08:00 to 18:00",
  },
} as const;

export const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/lanes", label: "Lanes" },
  { href: "/pricing", label: "Pricing" },
  { href: "/field-notes", label: "Field notes" },
] as const;

export const CAPABILITIES = [
  {
    index: "01",
    title: "Log the payload, not the room",
    lede: "Probes sit with the product and report every 60 seconds over cellular, with buffered readings uploaded once the shipment finds signal again.",
    specs: [
      ["Cadence", "60 s logging, 15 min upload"],
      ["Buffer", "72 h on board"],
      ["Accuracy", "±0.3 °C, -80 to 60 °C"],
      ["Battery", "14 months at full cadence"],
    ],
  },
  {
    index: "02",
    title: "Escalate to a person, on a rota",
    lede: "An out-of-band reading raises the on-call reviewer by phone and message with the lane, the probe, the current value and the rate of rise attached.",
    specs: [
      ["Median alert delivery", "38 s from reading"],
      ["Rota", "Follow-the-sun, two deep"],
      ["Acknowledgement", "Logged with timestamp"],
      ["Silence rules", "Per lane, approved by QA"],
    ],
  },
  {
    index: "03",
    title: "Assemble the release pack",
    lede: "Every shipment closes with a record an inspector can follow: raw readings, probe certificates, the mean kinetic temperature calculation, and who released it.",
    specs: [
      ["Raw export", "CSV and JSON, no edits"],
      ["Audit trail", "Append only, per reading"],
      ["MKT", "Reproducible from raw data"],
      ["Retention", "12 years, configurable"],
    ],
  },
  {
    index: "04",
    title: "Send it where the work happens",
    lede: "Readings and events push into the systems your teams already sit in, so nobody logs into another dashboard to find out a shipment is in trouble.",
    specs: [
      ["Webhooks", "Signed, retried for 24 h"],
      ["API", "REST, cursor paginated"],
      ["Connectors", "SAP EWM, Veeva, ServiceNow"],
      ["Exports", "Scheduled to SFTP or S3"],
    ],
  },
] as const;

export const FAILURE_STAGES = [
  {
    id: "acceptance",
    label: "Acceptance",
    minutes: "0 to 40 min",
    title: "The load leaves the depot in good order",
    body: "Probes pair with the shipment at pack out. The record starts before the doors close, which is the only way to prove the payload was in band when it left your control.",
  },
  {
    id: "ramp",
    label: "Uplift",
    minutes: "40 to 180 min",
    title: "Ramp time, where 71% of out-of-band minutes happen",
    body: "Uncovered dollies, aircraft swaps, and a queue nobody planned for. Ambient climbs first, then the payload follows about twenty minutes later.",
  },
  {
    id: "hold",
    label: "Customs hold",
    minutes: "9 to 14 h",
    title: "Power runs out before the inspection ends",
    body: "Active containers drain in bonded areas without ground power. The trace shows the battery cutoff long before anyone opens the box.",
  },
  {
    id: "release",
    label: "Release",
    minutes: "Arrival to sign off",
    title: "QA decides with the evidence in one place",
    body: "Raw readings, the excursion window, the response, the mean kinetic temperature and the stability reference. One record, one decision, one signature.",
  },
] as const;

export const EVIDENCE_ITEMS = [
  ["Raw readings", "Every logged value with probe ID, in CSV and JSON, unedited"],
  ["Probe calibration", "Certificate, date and tolerance attached to the shipment"],
  ["Placement record", "Pack-out photographs and the probe position in the load"],
  ["Alert trail", "Who was raised, when, and when they acknowledged"],
  ["Excursion analysis", "Window, peak, duration and mean kinetic temperature"],
  ["Release decision", "Reviewer, role, stability reference and signature time"],
] as const;

export const PLANS = [
  {
    id: "lane",
    name: "Lane",
    price: "£1,900",
    cadence: "per month",
    summary: "One programme, up to 25 active lanes, run by a small quality team.",
    cta: "Book a walkthrough",
    highlight: false,
    features: {
      "Active lanes": "Up to 25",
      "Probes included": "40",
      "Logging cadence": "60 s",
      "Alert routing": "Email, SMS, webhook",
      "On-call rota": "Single rota",
      "Evidence pack": "Standard",
      "Data retention": "3 years",
      "API and exports": "REST + scheduled CSV",
      "Integrations": "Webhooks",
      "Validation support": "Documentation only",
      "Support": "Next business day",
    },
  },
  {
    id: "programme",
    name: "Programme",
    price: "£4,800",
    cadence: "per month",
    summary: "Multi-country studies with depot handovers and a follow-the-sun rota.",
    cta: "Book a walkthrough",
    highlight: true,
    features: {
      "Active lanes": "Up to 120",
      "Probes included": "220",
      "Logging cadence": "60 s, event triggered to 10 s",
      "Alert routing": "Email, SMS, voice, webhook",
      "On-call rota": "Follow-the-sun, two deep",
      "Evidence pack": "Standard + MKT and deviation link",
      "Data retention": "7 years",
      "API and exports": "REST + SFTP + S3",
      "Integrations": "SAP EWM, Veeva, ServiceNow",
      "Validation support": "IQ/OQ templates, review workshop",
      "Support": "4 h response, 24/5",
    },
  },
  {
    id: "validated",
    name: "Validated",
    price: "Quoted",
    cadence: "annual agreement",
    summary: "Sponsors running validated systems under a quality agreement.",
    cta: "Request a scoping call",
    highlight: false,
    features: {
      "Active lanes": "Unlimited",
      "Probes included": "Priced per programme",
      "Logging cadence": "Configurable per lane",
      "Alert routing": "Custom routing rules",
      "On-call rota": "Custom, with escalation SLAs",
      "Evidence pack": "Custom templates per sponsor",
      "Data retention": "12 years",
      "API and exports": "Dedicated tenancy",
      "Integrations": "Custom, with change control",
      "Validation support": "IQ/OQ/PQ execution support",
      "Support": "1 h response, 24/7",
    },
  },
] as const;

export const FEATURE_ROWS = Object.keys(PLANS[0].features) as (keyof (typeof PLANS)[0]["features"])[];

export const FAQS = [
  {
    q: "Do you sell the probes or do we bring our own?",
    a: "Both. Probes ship with the plan, and the ingest API accepts readings from most loggers that can post JSON. Bring your own hardware and you keep the escalation, the evidence pack and the audit trail.",
  },
  {
    q: "How does this fit a validated environment?",
    a: "Coldharbour runs as a GxP-relevant system on your side of the quality agreement. Plans above Lane include IQ and OQ templates, a change control log, and a review workshop with your validation lead. We do not claim your system is validated. You validate it, and we supply the documentation and the evidence to do so.",
  },
  {
    q: "What happens when a shipment loses signal?",
    a: "The probe keeps logging to on-board memory for 72 hours and uploads the buffer when it reconnects. Gaps in coverage appear in the record as buffered rather than missing, with the upload time recorded next to the reading time.",
  },
  {
    q: "Who gets called at 03:00?",
    a: "Whoever your rota says. Escalation runs through a named on-call reviewer with a backup, and every raise and acknowledgement lands in the shipment record with a timestamp.",
  },
  {
    q: "Can we start with one lane?",
    a: "Yes. Most teams start with the lane that keeps them awake, run it for a quarter alongside their existing loggers, and compare the two records before moving anything else.",
  },
  {
    q: "What does onboarding involve?",
    a: "A lane review, a probe placement plan, one test shipment, and a rota setup session. Teams that already know their lanes are usually live on the first real shipment within three weeks.",
  },
] as const;

export const SCENARIOS = [
  {
    id: "phase-iii",
    title: "Phase III oral solid, 14 countries",
    situation:
      "A sponsor running comparator supply into tropical depots kept losing hours to paper temperature records that arrived a week after the shipment.",
    change:
      "Probes at pack out, one rota across two time zones, and a release pack that closes with the shipment rather than after it.",
    outcome: "Release decisions moved from 6 days to under 24 hours on the same lanes.",
    tags: ["Air", "2 to 8 °C", "120 lanes"],
  },
  {
    id: "cell-therapy",
    title: "Autologous cell therapy, single patient doses",
    situation:
      "Each dry shipper carries one patient's material. A tilt event or a slow vapour climb cannot wait for the next scheduled check.",
    change:
      "Tilt triggers switch logging to 10 second intervals and raise the courier directly, with the clinical site copied.",
    outcome: "Two shipments recovered at a transit hub in the first quarter, both released.",
    tags: ["Cryo", "Below -150 °C", "38 lanes"],
  },
  {
    id: "road-network",
    title: "European road network, comparator kits",
    situation:
      "Twenty two totes a week across four countries, monitored by loggers read at the receiving depot.",
    change:
      "Live readings on the road plus a hold rule agreed with the depots before the first shipment moved.",
    outcome: "Zero disputed receipts in nine months, and two carrier claims settled with the raw record.",
    tags: ["Road", "2 to 8 °C", "212 shipments"],
  },
] as const;

export const PLATFORM_SECTIONS = [
  { id: "hardware", label: "Hardware" },
  { id: "ingest", label: "Ingest" },
  { id: "alerting", label: "Alerting" },
  { id: "evidence", label: "Evidence" },
  { id: "integrations", label: "Integrations" },
  { id: "security", label: "Security" },
] as const;
