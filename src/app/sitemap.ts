import type { MetadataRoute } from "next";
import { getFieldNotes, getLanesWithSeries } from "@/db/queries";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/platform`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/lanes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/field-notes`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [lanes, notes] = await Promise.all([getLanesWithSeries(), getFieldNotes()]);

  return [
    ...staticRoutes,
    ...lanes.map((lane) => ({
      url: `${base}/lanes/${lane.slug}`,
      lastModified: lane.lastDeparture ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...notes.map((note) => ({
      url: `${base}/field-notes/${note.slug}`,
      lastModified: new Date(note.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
