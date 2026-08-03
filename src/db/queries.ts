import { asc, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { excursions, fieldNotes, lanes, readings } from "@/db/schema";
import type { Excursion, FieldNote, Lane, Reading } from "@/db/schema";

export type { Excursion, FieldNote, Lane, Reading };

export type LaneWithSeries = Lane & {
  series: { minute: number; tempC: number; ambientC: number }[];
  excursionCount: number;
};

const EMPTY_STATS = {
  lanes: 0,
  countries: 0,
  shipments: 0,
  readings: 0,
  probes: 0,
  excursions: 0,
};

export async function getNetworkStats() {
  try {
    const [row] = await db
      .select({
        lanes: sql<number>`count(*)::int`,
        shipments: sql<number>`coalesce(sum(${lanes.shipmentsYtd}), 0)::int`,
        probes: sql<number>`coalesce(sum(${lanes.probes}), 0)::int`,
        countries: sql<number>`count(distinct ${lanes.destinationCode})::int`,
      })
      .from(lanes);

    const [readingRow] = await db
      .select({ readings: sql<number>`count(*)::int` })
      .from(readings);

    const [excursionRow] = await db
      .select({ excursions: sql<number>`count(*)::int` })
      .from(excursions);

    return {
      lanes: row?.lanes ?? 0,
      countries: row?.countries ?? 0,
      shipments: row?.shipments ?? 0,
      probes: row?.probes ?? 0,
      readings: readingRow?.readings ?? 0,
      excursions: excursionRow?.excursions ?? 0,
    };
  } catch {
    return EMPTY_STATS;
  }
}

/** Every lane plus a downsampled trace, small enough to filter on the client. */
export async function getLanesWithSeries(): Promise<LaneWithSeries[]> {
  try {
    const laneRows = await db.select().from(lanes).orderBy(desc(lanes.riskScore));
    if (laneRows.length === 0) return [];

    const readingRows = await db
      .select()
      .from(readings)
      .orderBy(asc(readings.laneId), asc(readings.minute));

    const excursionRows = await db.select().from(excursions);

    const byLane = new Map<number, Reading[]>();
    for (const row of readingRows) {
      const list = byLane.get(row.laneId);
      if (list) list.push(row);
      else byLane.set(row.laneId, [row]);
    }

    return laneRows.map((lane) => {
      const series = byLane.get(lane.id) ?? [];
      return {
        ...lane,
        series: series.map((r) => ({
          minute: r.minute,
          tempC: r.tempC,
          ambientC: r.ambientC,
        })),
        excursionCount: excursionRows.filter((e) => e.laneId === lane.id).length,
      };
    });
  } catch {
    return [];
  }
}

export async function getLaneBySlug(slug: string) {
  try {
    const [lane] = await db.select().from(lanes).where(eq(lanes.slug, slug)).limit(1);
    if (!lane) return null;

    const series = await db
      .select()
      .from(readings)
      .where(eq(readings.laneId, lane.id))
      .orderBy(asc(readings.minute));

    const events = await db
      .select()
      .from(excursions)
      .where(eq(excursions.laneId, lane.id))
      .orderBy(asc(excursions.startMinute));

    const related = await db
      .select()
      .from(lanes)
      .where(ne(lanes.id, lane.id))
      .orderBy(desc(lanes.riskScore))
      .limit(3);

    return { lane, series, events, related };
  } catch {
    return null;
  }
}

/** The lane used for the home page reader: highest risk with a logged event. */
export async function getFeaturedLane() {
  try {
    const [lane] = await db
      .select()
      .from(lanes)
      .where(eq(lanes.status, "excursion"))
      .orderBy(desc(lanes.riskScore))
      .limit(1);
    if (!lane) return null;

    const series = await db
      .select()
      .from(readings)
      .where(eq(readings.laneId, lane.id))
      .orderBy(asc(readings.minute));

    const events = await db
      .select()
      .from(excursions)
      .where(eq(excursions.laneId, lane.id))
      .orderBy(asc(excursions.startMinute));

    return { lane, series, events };
  } catch {
    return null;
  }
}

export async function getFieldNotes(limit?: number) {
  try {
    const query = db.select().from(fieldNotes).orderBy(desc(fieldNotes.publishedAt));
    return limit ? await query.limit(limit) : await query;
  } catch {
    return [] as FieldNote[];
  }
}

export async function getFieldNote(slug: string) {
  try {
    const [note] = await db
      .select()
      .from(fieldNotes)
      .where(eq(fieldNotes.slug, slug))
      .limit(1);
    if (!note) return null;

    const more = await db
      .select()
      .from(fieldNotes)
      .where(ne(fieldNotes.slug, slug))
      .orderBy(desc(fieldNotes.publishedAt))
      .limit(2);

    return { note, more };
  } catch {
    return null;
  }
}
