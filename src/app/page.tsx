import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { FailureNarrative } from "@/components/sections/failure-narrative";
import { Capabilities } from "@/components/sections/capabilities";
import { LaneReader } from "@/components/sections/lane-reader";
import { Evidence } from "@/components/sections/evidence";
import { Scenarios } from "@/components/sections/scenarios";
import { NotesTeaser } from "@/components/sections/notes-teaser";
import { ClosingCta } from "@/components/sections/closing-cta";
import { getFeaturedLane, getFieldNotes, getNetworkStats } from "@/db/queries";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [stats, featured, notes] = await Promise.all([
    getNetworkStats(),
    getFeaturedLane(),
    getFieldNotes(3),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.contact.email,
    telephone: SITE.contact.phone,
    disambiguatingDescription:
      "Demonstration build. Lanes, readings and field notes shown on this site are synthetic sample data.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        stats={stats}
        lane={
          featured
            ? {
                ...featured.lane,
                series: featured.series.map((r) => ({ minute: r.minute, tempC: r.tempC })),
              }
            : null
        }
      />
      <FailureNarrative />
      <Capabilities />
      {featured ? (
        <LaneReader lane={featured.lane} series={featured.series} events={featured.events} />
      ) : null}
      <Evidence />
      <Scenarios />
      <NotesTeaser notes={notes} />
      <ClosingCta />
    </>
  );
}
