import {
  date,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** A monitored origin-to-destination route. */
export const lanes = pgTable(
  "lanes",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    code: text("code").notNull(),
    origin: text("origin").notNull(),
    originCode: text("origin_code").notNull(),
    destination: text("destination").notNull(),
    destinationCode: text("destination_code").notNull(),
    mode: text("mode").notNull(), // air | road | sea
    payload: text("payload").notNull(),
    profile: text("profile").notNull(), // human label for the temperature profile
    bandMin: real("band_min").notNull(),
    bandMax: real("band_max").notNull(),
    transitHours: integer("transit_hours").notNull(),
    distanceKm: integer("distance_km").notNull(),
    carrier: text("carrier").notNull(),
    status: text("status").notNull(), // in-band | watch | excursion
    riskScore: integer("risk_score").notNull(),
    shipmentsYtd: integer("shipments_ytd").notNull(),
    probes: integer("probes").notNull(),
    summary: text("summary").notNull(),
    lastDeparture: timestamp("last_departure", { withTimezone: true }).notNull(),
  },
  (table) => [uniqueIndex("lanes_slug_idx").on(table.slug)],
);

/** One probe reading, stored as a minute offset from departure. */
export const readings = pgTable(
  "readings",
  {
    id: serial("id").primaryKey(),
    laneId: integer("lane_id")
      .notNull()
      .references(() => lanes.id, { onDelete: "cascade" }),
    minute: integer("minute").notNull(),
    tempC: real("temp_c").notNull(),
    ambientC: real("ambient_c").notNull(),
  },
  (table) => [index("readings_lane_idx").on(table.laneId, table.minute)],
);

/** A logged out-of-band event with the response that closed it. */
export const excursions = pgTable(
  "excursions",
  {
    id: serial("id").primaryKey(),
    laneId: integer("lane_id")
      .notNull()
      .references(() => lanes.id, { onDelete: "cascade" }),
    startMinute: integer("start_minute").notNull(),
    endMinute: integer("end_minute").notNull(),
    peakTempC: real("peak_temp_c").notNull(),
    stage: text("stage").notNull(),
    cause: text("cause").notNull(),
    response: text("response").notNull(),
    outcome: text("outcome").notNull(), // released | quarantined | destroyed
    mkt: real("mkt").notNull(), // mean kinetic temperature over the leg
  },
  (table) => [index("excursions_lane_idx").on(table.laneId)],
);

/** Editorial articles. */
export const fieldNotes = pgTable(
  "field_notes",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    dek: text("dek").notNull(),
    topic: text("topic").notNull(),
    author: text("author").notNull(),
    authorRole: text("author_role").notNull(),
    readMinutes: integer("read_minutes").notNull(),
    publishedAt: date("published_at").notNull(),
    body: text("body").notNull(),
  },
  (table) => [uniqueIndex("field_notes_slug_idx").on(table.slug)],
);

/** Walkthrough requests captured by /contact. */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  shipmentVolume: text("shipment_volume").notNull(),
  lanesOfInterest: text("lanes_of_interest"),
  message: text("message").notNull(),
  source: text("source").notNull().default("contact"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Field notes subscribers. */
export const subscribers = pgTable(
  "subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("subscribers_email_idx").on(table.email)],
);

export type Lane = typeof lanes.$inferSelect;
export type Reading = typeof readings.$inferSelect;
export type Excursion = typeof excursions.$inferSelect;
export type FieldNote = typeof fieldNotes.$inferSelect;
