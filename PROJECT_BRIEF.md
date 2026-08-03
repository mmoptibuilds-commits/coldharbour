# Coldharbour — Project Brief

## Assumptions recorded
The supplied brief arrived as an empty template. Every field below is an inferred, documented
assumption. Change this file first if the real brief differs.

| Field | Decision |
| --- | --- |
| Project name | Coldharbour |
| Project type | Product site for a B2B monitoring platform, with a live data explorer |
| Product | Temperature and custody monitoring for clinical trial shipments. Probes report every 60 seconds, the platform detects excursions, escalates to the on-call QA reviewer, and assembles the release evidence pack |
| Primary audience | Clinical supply chain managers, QA and GxP leads, and logistics operations staff at biotech sponsors and CROs |
| Secondary audience | Depot and courier operations teams, and IT staff reviewing integrations |
| Primary user goal | Judge whether the system produces evidence their QA function can act on, then talk to someone technical |
| Primary business goal | Qualified walkthrough requests from teams shipping temperature-controlled product |
| Primary CTA | Book a walkthrough |
| Secondary CTAs | Open a sample lane, compare plans, read a field note, subscribe to field notes |
| Brand personality | Technical, instrument-grade, cold, calm, evidence-first. No hype |
| Content | Sample content written for this build. Lanes, readings, excursions, field notes and scenarios are synthetic and labelled as such on every page that shows them |
| Brand assets | None supplied. Wordmark, band glyph, colour system and type system created here |
| Deployment target | Node runtime on the platform sandbox (Next.js standalone server + PostgreSQL) |
| Constraints | WCAG 2.2 AA target, keyboard first, reduced motion is a complete alternative experience, no fake functionality |

## Reference thinking
No reference sites were supplied. Art direction pulls from instrumentation UI conventions rather
than SaaS landing pages: laboratory chart recorders, freight manifests, and validation paperwork.
That means hairlines instead of cards, monospace for anything a person would read off a device,
and a single warm accent on an otherwise cold monochrome canvas.

## Experience map

| Section | Purpose | User question | Interaction | Next action |
| --- | --- | --- | --- | --- |
| Hero | State what the product records and for whom | "What is this?" | Line-masked headline, live trace draw | Book a walkthrough / open a lane |
| Ledger strip | Prove scale with real numbers from the database | "Is this operating anywhere?" | Count-up on view | Scroll |
| Failure narrative | Show where cold chains actually break | "Do they understand my problem?" | Pinned four-stage diagram, scrubbed | Continue |
| Capability rows | Explain the four jobs the platform does | "What does it do concretely?" | Hover-linked spec rows | Platform page |
| Lane reader | Let the visitor read real telemetry | "Can I trust the data?" | Scrubbable chart, keyboard cursor | Lanes explorer |
| Evidence pack | Show the QA output | "What do I hand an inspector?" | Static spec sheet | Pricing |
| Scenarios | Composite deployments, labelled sample | "Who is this for?" | Carousel, autoplay off | Contact |
| Close | Convert | "How do I start?" | Form entry point | Book a walkthrough |

## Journeys
1. QA lead: home → lane reader → lane detail → evidence pack → contact.
2. Supply chain manager: home → platform → pricing → contact.
3. Practitioner: field notes → note detail → lanes → contact.

## Sitemap
```
/                     home
/platform             how the system works, hardware to evidence
/lanes                lane explorer (filter, sort, search)
/lanes/[slug]         lane detail: chart, excursion log, custody timeline
/pricing              plan comparison + FAQ
/field-notes          index
/field-notes/[slug]   article
/contact              walkthrough request form
/privacy              data handling for this demonstration build
/api/health           liveness + database check
/api/walkthrough      POST lead
/api/subscribe        POST subscriber
sitemap.xml, robots.txt
```
