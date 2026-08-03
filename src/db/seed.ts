import { sql } from "drizzle-orm";
import { db } from "@/db";
import { excursions, fieldNotes, lanes, readings } from "@/db/schema";

/**
 * Synthetic dataset for the demonstration build.
 * Every value is generated from a fixed seed, so two runs produce the same
 * chart. Nothing here describes a real shipment, carrier or customer.
 */

type ExcursionSeed = {
  startMinute: number;
  endMinute: number;
  peakTempC: number;
  stage: string;
  cause: string;
  response: string;
  outcome: "released" | "quarantined" | "destroyed";
  mkt: number;
};

type LaneSeed = {
  slug: string;
  code: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  mode: "air" | "road" | "sea";
  payload: string;
  profile: string;
  bandMin: number;
  bandMax: number;
  transitHours: number;
  distanceKm: number;
  carrier: string;
  status: "in-band" | "watch" | "excursion";
  riskScore: number;
  shipmentsYtd: number;
  probes: number;
  summary: string;
  daysAgo: number;
  drift: number;
  excursions: ExcursionSeed[];
};

const LANE_SEEDS: LaneSeed[] = [
  {
    slug: "lhr-sin-04",
    code: "LHR-SIN-04",
    origin: "London Heathrow",
    originCode: "LHR",
    destination: "Singapore Changi",
    destinationCode: "SIN",
    mode: "air",
    payload: "Phase III oral solid, 12 pallets",
    profile: "2 to 8 °C",
    bandMin: 2,
    bandMax: 8,
    transitHours: 19,
    distanceKm: 10847,
    carrier: "Kestrel Air Cargo",
    status: "watch",
    riskScore: 62,
    shipmentsYtd: 148,
    probes: 6,
    summary:
      "Two transfers, both outdoors. The load sits on the Changi ramp for up to 70 minutes before it reaches the cold room, and that window drives every alert on this lane.",
    daysAgo: 2,
    drift: 0.55,
    excursions: [],
  },
  {
    slug: "bos-fra-11",
    code: "BOS-FRA-11",
    origin: "Boston Logan",
    originCode: "BOS",
    destination: "Frankfurt",
    destinationCode: "FRA",
    mode: "air",
    payload: "mRNA drug substance, 4 shippers",
    profile: "-20 °C ±5",
    bandMin: -25,
    bandMax: -15,
    transitHours: 14,
    distanceKm: 5942,
    carrier: "North Atlantic Freight",
    status: "in-band",
    riskScore: 21,
    shipmentsYtd: 96,
    probes: 8,
    summary:
      "Passive shippers with 96 hours of hold time on a 14 hour run. The margin is wide enough that only a handling failure would move the payload out of band.",
    daysAgo: 1,
    drift: 0.4,
    excursions: [],
  },
  {
    slug: "sin-syd-07",
    code: "SIN-SYD-07",
    origin: "Singapore Changi",
    originCode: "SIN",
    destination: "Sydney Kingsford Smith",
    destinationCode: "SYD",
    mode: "air",
    payload: "Comparator tablets, 8 cases",
    profile: "15 to 25 °C",
    bandMin: 15,
    bandMax: 25,
    transitHours: 12,
    distanceKm: 6300,
    carrier: "Coral Line Cargo",
    status: "excursion",
    riskScore: 78,
    shipmentsYtd: 61,
    probes: 4,
    summary:
      "Controlled ambient product moving through two tropical ramps. The August run hit 27.4 °C during a 41 minute hold on the apron at Changi.",
    daysAgo: 4,
    drift: 1.1,
    excursions: [
      {
        startMinute: 100,
        endMinute: 141,
        peakTempC: 27.4,
        stage: "Origin ramp, uplift delay",
        cause:
          "Aircraft swap pushed the load back 55 minutes. The cases stayed on an uncovered dolly in 33 °C ambient.",
        response:
          "Alert reached the duty coordinator at minute 104. She moved the dolly under the canopy and called for a chilled ULD.",
        outcome: "released",
        mkt: 23.8,
      },
    ],
  },
  {
    slug: "jfk-gru-09",
    code: "JFK-GRU-09",
    origin: "New York JFK",
    originCode: "JFK",
    destination: "São Paulo Guarulhos",
    destinationCode: "GRU",
    mode: "air",
    payload: "Biologic vials, 2 active containers",
    profile: "2 to 8 °C",
    bandMin: 2,
    bandMax: 8,
    transitHours: 16,
    distanceKm: 7681,
    carrier: "Southbound Air Logistics",
    status: "excursion",
    riskScore: 84,
    shipmentsYtd: 74,
    probes: 6,
    summary:
      "Active containers on battery through a long customs hold. Charge state matters more than ambient on this lane, and the November run proved it.",
    daysAgo: 6,
    drift: 0.7,
    excursions: [
      {
        startMinute: 705,
        endMinute: 792,
        peakTempC: 11.2,
        stage: "Destination customs, unpowered hold",
        cause:
          "Container battery reached cutoff during an 87 minute inspection queue with no ground power available in the bonded area.",
        response:
          "Escalation ran to the broker and the depot at the same time. A power cart reached the container at minute 792 and the payload recovered inside 20 minutes.",
        outcome: "quarantined",
        mkt: 6.9,
      },
    ],
  },
  {
    slug: "bsl-mil-02",
    code: "BSL-MIL-02",
    origin: "Basel",
    originCode: "BSL",
    destination: "Milan Linate",
    destinationCode: "LIN",
    mode: "road",
    payload: "Comparator kits, 22 totes",
    profile: "2 to 8 °C",
    bandMin: 2,
    bandMax: 8,
    transitHours: 8,
    distanceKm: 393,
    carrier: "Alpine Cold Road",
    status: "in-band",
    riskScore: 18,
    shipmentsYtd: 212,
    probes: 3,
    summary:
      "A short refrigerated road run with one driver break. The Gotthard climb shows up in the ambient trace and never touches the payload.",
    daysAgo: 1,
    drift: 0.3,
    excursions: [],
  },
  {
    slug: "lej-dxb-03",
    code: "LEJ-DXB-03",
    origin: "Leipzig Halle",
    originCode: "LEJ",
    destination: "Dubai World Central",
    destinationCode: "DWC",
    mode: "air",
    payload: "Autologous cell therapy, 1 dry shipper",
    profile: "Below -150 °C",
    bandMin: -196,
    bandMax: -150,
    transitHours: 11,
    distanceKm: 4652,
    carrier: "Halden Cryo",
    status: "watch",
    riskScore: 57,
    shipmentsYtd: 38,
    probes: 2,
    summary:
      "A vapour shipper with a 10 day static hold. Orientation is the risk, not time. Two tilt events on this run pushed the vapour temperature up by 9 °C.",
    daysAgo: 3,
    drift: 3.5,
    excursions: [],
  },
  {
    slug: "cph-rey-01",
    code: "CPH-REY-01",
    origin: "Copenhagen",
    originCode: "CPH",
    destination: "Reykjavík Keflavík",
    destinationCode: "KEF",
    mode: "air",
    payload: "Insulin analogue, 6 pallets",
    profile: "2 to 8 °C",
    bandMin: 2,
    bandMax: 8,
    transitHours: 7,
    distanceKm: 2110,
    carrier: "Nordisk Reefer",
    status: "in-band",
    riskScore: 14,
    shipmentsYtd: 130,
    probes: 4,
    summary:
      "Cold ambient at both ends. The only lane in the network where the risk runs low rather than high, and the winter trace shows why.",
    daysAgo: 2,
    drift: 0.35,
    excursions: [],
  },
  {
    slug: "nrt-icn-05",
    code: "NRT-ICN-05",
    origin: "Tokyo Narita",
    originCode: "NRT",
    destination: "Seoul Incheon",
    destinationCode: "ICN",
    mode: "air",
    payload: "Ophthalmic suspension, 5 cases",
    profile: "2 to 8 °C",
    bandMin: 2,
    bandMax: 8,
    transitHours: 6,
    distanceKm: 1258,
    carrier: "Pacific Node",
    status: "in-band",
    riskScore: 26,
    shipmentsYtd: 187,
    probes: 3,
    summary:
      "The shortest lane in the network and the busiest. Handling is the whole story: four touchpoints in six hours.",
    daysAgo: 1,
    drift: 0.45,
    excursions: [],
  },
];

function mulberry32(seed: number) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CADENCE_MINUTES = 20;

function buildSeries(lane: LaneSeed, seedIndex: number) {
  const rand = mulberry32(1717 + seedIndex * 977);
  const totalMinutes = lane.transitHours * 60;
  const mid = (lane.bandMin + lane.bandMax) / 2;
  const span = lane.bandMax - lane.bandMin;
  const target = lane.status === "watch" ? mid + span * 0.22 : mid - span * 0.05;
  const rows: { minute: number; tempC: number; ambientC: number }[] = [];

  for (let minute = 0; minute <= totalMinutes; minute += CADENCE_MINUTES) {
    const progress = minute / totalMinutes;
    const wave = Math.sin(progress * Math.PI * 1.7) * lane.drift;
    const noise = (rand() - 0.5) * lane.drift * 0.55;
    let temp = target + wave * 0.7 + noise;

    // Ambient follows the ground phases: warm on the ramps, cold at altitude.
    const ramp = progress < 0.12 || progress > 0.86;
    const ambientBase = lane.mode === "road" ? 14 : ramp ? 27 : 9;
    let ambient = ambientBase + Math.sin(progress * Math.PI * 3.1) * 4 + (rand() - 0.5) * 2.4;

    for (const event of lane.excursions) {
      if (minute >= event.startMinute - CADENCE_MINUTES * 2 && minute <= event.endMinute + 120) {
        const width = event.endMinute - event.startMinute;
        const centre = event.startMinute + width * 0.6;
        const distance = Math.abs(minute - centre);
        const reach = width * 2.6;
        if (distance < reach) {
          const shape = Math.cos((distance / reach) * Math.PI * 0.5) ** 2;
          temp += (event.peakTempC - target) * shape;
          ambient += 6 * shape;
        }
      }
    }

    if (lane.status === "watch" && progress > 0.62 && progress < 0.78) {
      temp += span * 0.14;
    }

    rows.push({
      minute,
      tempC: Number(temp.toFixed(2)),
      ambientC: Number(ambient.toFixed(1)),
    });
  }

  return rows;
}

const NOTE_SEEDS = [
  {
    slug: "41-minute-excursion-singapore-lane",
    title: "A 41 minute excursion on the Singapore lane, and what it cost",
    dek: "An aircraft swap put eight cases of comparator tablets on an uncovered dolly in 33 °C ambient. Here is the timeline, the decision, and the paperwork that followed.",
    topic: "Case teardown",
    author: "Marta Vinke",
    authorRole: "Cold chain lead",
    readMinutes: 6,
    publishedAt: "2026-01-14",
    body: `The load left the depot at 06:10 with every reading sitting at 21 °C, comfortably inside a 15 to 25 °C profile. At minute 100 the carrier swapped the aircraft. Ground crew pulled the dolly off the loading queue and parked it on the apron, uncovered, in 33 °C ambient with no shade within forty metres.

The first probe crossed 25 °C at minute 103. The alert reached the duty coordinator one minute later, with the case ID, the probe number, the current reading and the rate of rise attached. She did not have to ask anyone what was happening or where the load was.

## What the rate of rise told us

A single reading over a limit says almost nothing. The slope says everything. These cases climbed at 0.9 °C every ten minutes, which put the payload at 30 °C inside an hour if nobody moved it. That number decided the response. A slow drift would have justified waiting for the next uplift. This one did not.

The coordinator moved the dolly under the canopy at minute 118 and called for a chilled ULD. The trace peaked at 27.4 °C at minute 141 and returned inside the band by minute 168.

## The cost

Forty one minutes out of band produced:

- 3 hours of QA review across two time zones
- One deviation record, opened and closed inside four days
- A mean kinetic temperature calculation over the full leg, which came out at 23.8 °C against a 25 °C limit
- Release, with the stability data supporting the decision

The product shipped. The cost landed on the quality team rather than the balance sheet, which is the outcome you want when handling goes wrong.

## What changed afterwards

We asked the carrier for a covered staging position for any pharma dolly held longer than fifteen minutes. They agreed for this station and refused for two others, which told us where to route product in July and August.

The wider point holds for any lane with outdoor transfers. You cannot prevent an aircraft swap. You can decide in advance what happens in the forty minutes that follow, and you can hold the evidence that shows what the payload actually experienced.`,
  },
  {
    slug: "dry-ice-maths-for-72-hour-lanes",
    title: "Dry ice maths for 72 hour lanes",
    dek: "Sublimation rate, box geometry and customs delay decide whether a shipment arrives frozen. The arithmetic is simple and most packing sheets still get it wrong.",
    topic: "Physics",
    author: "Tomas Reiner",
    authorRole: "Hardware",
    readMinutes: 5,
    publishedAt: "2025-11-27",
    body: `A well packed EPS shipper loses dry ice at roughly 4 to 6 kilograms per cubic metre of internal volume per day. Thicker walls slow it, poor lid seating speeds it up, and a warm dock doubles it for as long as the box sits there.

Take a 60 litre shipper carrying 18 kg of pellets. At 5 kg per day of loss you have 3.6 days of hold time before the last pellet goes. That sounds comfortable against a 72 hour lane. It stops sounding comfortable once you add a 14 hour customs hold, an 8 hour depot wait and a 4 hour final mile in an unrefrigerated van.

## Where the margin disappears

- Pellet surface area matters more than mass. Small pellets sublime faster than slabs at the same weight
- Every lid opening at the depot costs about 90 minutes of hold time
- Air freight pressure cycling pushes vapour out of the box, which speeds the loss
- A shipper stored on a sunlit dock loses ice two to three times faster than one in a 20 °C room

## Measure the vapour, not the box

Surface probes on the outside of a dry ice shipper tell you about the room. Put the probe in the payload cavity and you get the number that matters, which is the temperature the product experienced.

When the vapour temperature starts climbing off -78 °C, the ice is nearly gone. That climb is the only warning you get, and it arrives four to six hours before the payload crosses -20 °C. On a 72 hour lane with a live probe, four hours is enough time to re-ice at a station. Without a probe, the first evidence arrives when someone opens the box.

## A rule that works

Pack for the planned transit plus the longest customs hold recorded on that lane in the last twelve months, then add 24 hours. If the shipper cannot carry that, the lane needs a re-icing stop rather than a bigger box.`,
  },
  {
    slug: "excursion-sop-your-night-shift-will-follow",
    title: "Writing an excursion SOP your night shift will follow",
    dek: "Most excursion procedures fail at 02:00 in a language nobody on duty reads. Short, specific and reachable beats thorough.",
    topic: "Quality",
    author: "Priya Ramanathan",
    authorRole: "QA advisor",
    readMinutes: 7,
    publishedAt: "2025-10-09",
    body: `A depot supervisor in Guarulhos has 90 seconds to decide what to do with a container that has been off power for an hour. She will not open a 40 page SOP. She will call whoever answers.

Write for that moment.

## Put the decision first

The first page of the procedure should answer three questions: who do I call, what do I do with the load right now, and what do I write down. Everything else belongs behind that page. Reviewers read documents from the front. Operators read them from the incident.

## Name a person, not a mailbox

Escalation to a shared inbox works during office hours in one time zone. Name a rotating on-call reviewer with a phone number and a backup. Publish the rota where the depot can see it. Check quarterly that the number still reaches someone.

## Define the hold rule before you need it

The worst version of an excursion is the argument about whether to quarantine. Agree the rule in advance:

- Any reading outside the profile holds the shipment until QA releases it
- The depot photographs the packaging and the container display
- Nobody re-ices, re-packs or moves product between containers without a QA instruction
- The record stays with the shipment, in the same system, until release

## Write the language they speak

If your depot in Osaka runs in Japanese, the one page decision sheet ships in Japanese. Translation of the full SOP can wait. The decision sheet cannot.

## Rehearse it twice a year

Call the on-call number at 03:00 without warning. If nobody answers, you found a gap that a real excursion would have found later and more expensively. We run this drill in January and July, and it has failed twice in three years, both times after a staffing change nobody flagged to quality.

## Close the loop in the record

An SOP that ends at "notify QA" leaves the trail broken. State who writes the deviation, what evidence attaches to it, how the mean kinetic temperature gets calculated, and who signs the release. An inspector will follow that chain, and the chain is the product of the procedure.`,
  },
  {
    slug: "ramp-time-breaks-more-shipments-than-flight-time",
    title: "Ramp time breaks more shipments than flight time",
    dek: "Across eight monitored lanes, 71 percent of out-of-band minutes happened on the ground with the aircraft doors open or the truck parked.",
    topic: "Operations",
    author: "Marta Vinke",
    authorRole: "Cold chain lead",
    readMinutes: 6,
    publishedAt: "2025-09-18",
    body: `Cargo holds run cool and steady. The apron does not. When we tagged every out-of-band minute in the sample network by phase, ground handling took 71 percent of them, and the flight legs took 6 percent. Customs and depot holds took the rest.

That distribution changes where you spend money. A better container helps on the ground, which is where the heat is. A faster flight does almost nothing.

## The four windows that matter

- Uplift staging, from acceptance to loading. Outdoors at most stations
- Transfer between aircraft at a hub, often two ramp movements plus a warehouse
- Customs inspection, where power is rarely available
- Final mile, in a van that was not built for the profile

Each window has a different owner, and none of them owns the shipment end to end. The gap between owners is where the minutes accumulate.

## What to instrument

Put the probe with the product and log the position of the shipment at the same cadence. A temperature record without location tells you something went wrong. A record with location tells you where to send the corrective action.

We ask carriers for a covered staging bay at three stations. Two agreed. At the third, we changed the routing in summer instead of arguing. The trace made that decision easy to justify to the sponsor, because the data showed 41 out-of-band minutes at that station across six shipments and none at the alternative.

## The number to put in the review

Out-of-band minutes per shipment, split by phase, per station. It fits on one line, it points at a specific team, and it moves when someone fixes something. Most cold chain dashboards report excursion counts instead, which hides a 90 minute event behind the same tally mark as a 4 minute one.`,
  },
  {
    slug: "sensor-cadence-60-seconds-against-5-minutes",
    title: "Sensor cadence: 60 seconds against 5 minutes",
    dek: "Five minute logging misses the shape of a fast excursion. It also costs less battery. Here is where each one belongs.",
    topic: "Hardware",
    author: "Tomas Reiner",
    authorRole: "Hardware",
    readMinutes: 4,
    publishedAt: "2025-08-21",
    body: `A probe logging every five minutes will catch a four hour excursion. It will describe a fifteen minute one badly, and it will miss the peak by a wide margin when the rate of rise is steep.

On the Changi apron event we reconstructed both versions from the same 60 second data. The full trace peaked at 27.4 °C. Sampled at five minutes, the same event peaked at 26.1 °C and looked half an hour shorter. Neither number changes the release decision here, but the mean kinetic temperature calculation moved by 0.4 °C, and on a tighter profile that gap decides a quarantine.

## Battery is the real trade

At 60 second logging with a 15 minute upload cycle, our probes run about 14 months. Drop the logging to five minutes and you get past two years. For a probe that lives in a reusable container and gets serviced annually, 14 months is fine. For a probe glued inside a passive shipper that goes out and comes back three times a year, it is not.

## A cadence rule that holds up

- Active containers and anything on a ramp: 60 seconds
- Passive shippers with 96 hour hold time: 5 minutes
- Cryogenic dry shippers: 5 minutes, plus a tilt event trigger that logs at 10 seconds for two minutes
- Road lanes under 12 hours: 60 seconds, because handling dominates

Event driven logging beats a fixed high cadence in most cases. Log slowly while the payload sits mid band, and switch to fast logging the moment the slope steepens or the door opens. You keep the shape of the events that matter and you keep the battery.`,
  },
  {
    slug: "seven-questions-inspectors-ask-about-a-temperature-record",
    title: "Seven questions inspectors ask about a temperature record",
    dek: "Take these to your next audit rehearsal. If any answer needs a spreadsheet and an afternoon, fix the system rather than the answer.",
    topic: "Compliance",
    author: "Priya Ramanathan",
    authorRole: "QA advisor",
    readMinutes: 8,
    publishedAt: "2025-07-03",
    body: `These come up in nearly every inspection that touches distribution. None of them is unfair. All of them are easier to answer when the record was built to answer them.

## 1. Which probe produced this reading, and when was it calibrated

Serial number, calibration date, certificate, and the tolerance it was calibrated to. If the certificate lives in a supplier portal you cannot reach during the inspection, it does not exist.

## 2. How do you know the probe was with the product

Placement photographs and a packing record. A probe taped to the outside of a pallet wrap measures the warehouse.

## 3. What happened between the last logged reading and the release decision

Gaps invite questions. State the upload cadence, show the buffered readings, and show that the record is complete rather than sampled after the fact.

## 4. Who saw the alert, and when

Timestamped delivery and acknowledgement, not a claim that a mailbox received something. The gap between the reading and the human response is the number the inspector will write down.

## 5. Can you show the raw data

Not a chart image. The readings, with time, value and probe identity, exportable, with the audit trail that shows nobody edited them. Any system that lets a user delete a reading without leaving a trace will cost you the rest of the day.

## 6. How was the mean kinetic temperature calculated

State the formula, the activation energy used, the interval, and the software version that ran it. Then show it reproduces from the raw data.

## 7. Who released the shipment, on what evidence

Name, role, date, the stability data referenced, and the deviation record if one was opened. This chain is the product of everything above.

## The pattern

Every question asks the same thing in a different way: can you prove this record describes the product that reached the patient. Build the record so the proof is a link rather than a project.`,
  },
];

export async function seedIfEmpty() {
  const [existing] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(lanes);

  if (existing && existing.count > 0) return { seeded: false };

  const now = Date.now();

  for (const [index, seed] of LANE_SEEDS.entries()) {
    const [inserted] = await db
      .insert(lanes)
      .values({
        slug: seed.slug,
        code: seed.code,
        origin: seed.origin,
        originCode: seed.originCode,
        destination: seed.destination,
        destinationCode: seed.destinationCode,
        mode: seed.mode,
        payload: seed.payload,
        profile: seed.profile,
        bandMin: seed.bandMin,
        bandMax: seed.bandMax,
        transitHours: seed.transitHours,
        distanceKm: seed.distanceKm,
        carrier: seed.carrier,
        status: seed.status,
        riskScore: seed.riskScore,
        shipmentsYtd: seed.shipmentsYtd,
        probes: seed.probes,
        summary: seed.summary,
        lastDeparture: new Date(now - seed.daysAgo * 86_400_000),
      })
      .returning({ id: lanes.id });

    if (!inserted) continue;

    const series = buildSeries(seed, index);
    await db.insert(readings).values(
      series.map((row) => ({
        laneId: inserted.id,
        minute: row.minute,
        tempC: row.tempC,
        ambientC: row.ambientC,
      })),
    );

    if (seed.excursions.length > 0) {
      await db.insert(excursions).values(
        seed.excursions.map((event) => ({
          laneId: inserted.id,
          startMinute: event.startMinute,
          endMinute: event.endMinute,
          peakTempC: event.peakTempC,
          stage: event.stage,
          cause: event.cause,
          response: event.response,
          outcome: event.outcome,
          mkt: event.mkt,
        })),
      );
    }
  }

  await db.insert(fieldNotes).values(NOTE_SEEDS).onConflictDoNothing();

  return { seeded: true, lanes: LANE_SEEDS.length, notes: NOTE_SEEDS.length };
}
