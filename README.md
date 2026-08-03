<div align="center">
  <img src="./public/icon.svg" alt="Coldharbour mark" width="72" height="72" />

  <h1>Coldharbour</h1>

  <p><strong>Temperature evidence for clinical shipments.</strong></p>

  <p>
    An evidence-first cold-chain monitoring experience for clinical supply teams,
    built around live telemetry, human escalation, and inspection-ready release records.
  </p>

  <p>
    <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-111111?style=flat-square&logo=nextdotjs" />
    <img alt="React 19" src="https://img.shields.io/badge/React-19-111111?style=flat-square&logo=react" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-111111?style=flat-square&logo=typescript" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-111111?style=flat-square&logo=tailwindcss" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Drizzle-111111?style=flat-square&logo=postgresql" />
  </p>
</div>

---

## Overview

Coldharbour is a full-stack product website and operational data explorer for a fictional B2B clinical-shipment monitoring platform.

The experience follows a shipment from pack-out to QA release. It records payload temperature, surfaces excursions, routes alerts to a named reviewer, and assembles the evidence required for a release decision.

The visual direction is intentionally unlike a conventional SaaS landing page. It borrows from laboratory chart recorders, freight manifests, validation paperwork, and depot instrumentation: near-black surfaces, fine grid lines, dense telemetry, restrained typography, and a single ember-orange action colour.

> [!IMPORTANT]
> Coldharbour is a demonstration build. All lanes, readings, companies, field notes, outcomes, and operational statistics are synthetic.

## Experience highlights

- Live, scrubbable temperature traces with payload and ambient readings
- Searchable and filterable shipment-lane explorer
- Lane detail pages with excursion logs and custody timelines
- Evidence-pack breakdown for QA and inspection workflows
- Product platform, pricing, field notes, privacy, and contact routes
- Walkthrough and newsletter forms with shared client/server validation
- Deterministic PostgreSQL seed data for repeatable demonstrations
- Smooth scrolling, scroll-driven narratives, masked text, count-ups, and micro-interactions
- Keyboard-first interactions and a complete reduced-motion alternative
- Dynamic metadata, sitemap, robots rules, JSON-LD, loading states, and error boundaries

## Product flow

```text
Probe reading every 60 seconds
            ↓
Excursion detection
            ↓
Named reviewer escalation
            ↓
Acknowledgement and response trail
            ↓
Evidence pack and QA release decision
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product story, network ledger, failure narrative, lane reader, evidence, scenarios, and conversion |
| `/platform` | Hardware-to-evidence workflow and platform capabilities |
| `/lanes` | Searchable, sortable, and filterable lane explorer |
| `/lanes/[slug]` | Telemetry chart, excursion record, custody timeline, and related lanes |
| `/pricing` | Plan comparison and frequently asked questions |
| `/field-notes` | Editorial index |
| `/field-notes/[slug]` | Long-form field note |
| `/contact` | Technical walkthrough request |
| `/privacy` | Data-handling information for the demonstration |
| `/api/health` | Application and database health check |
| `/api/walkthrough` | Walkthrough lead endpoint |
| `/api/subscribe` | Field-note subscription endpoint |

## Technology

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 App Router, React 19 |
| Language | TypeScript in strict mode |
| Styling | Tailwind CSS 4, project-level design tokens |
| Motion | GSAP, ScrollTrigger, `@gsap/react`, Lenis, Motion |
| Data | PostgreSQL, Drizzle ORM, Drizzle Kit |
| Forms | React Hook Form, Zod |
| Interface primitives | Radix Dialog and Accordion |
| Carousel | Embla Carousel |
| Fonts | Archivo Variable and JetBrains Mono through `next/font` |

## Design system

Coldharbour uses a deliberate **60 / 30 / 10** colour hierarchy:

- **60%** near-black canvas and base surfaces
- **30%** raised surfaces, borders, and muted information
- **10%** ember orange for action and decision points

Telemetry uses separate semantic signal colours for in-band, watch, and error states. Status is never communicated by colour alone.

The design system, motion rules, page-specific deviations, and implementation decisions are documented in:

- [`design-system/MASTER.md`](./design-system/MASTER.md)
- [`design-system/pages/home.md`](./design-system/pages/home.md)
- [`design-system/pages/lanes.md`](./design-system/pages/lanes.md)
- [`MOTION_SYSTEM.md`](./MOTION_SYSTEM.md)
- [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md)
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)
- [`TASKS.md`](./TASKS.md)

## Project structure

```text
.
├── design-system/             # Visual rules and page-level deviations
├── public/                    # Static assets and brand mark
├── src/
│   ├── app/                   # App Router pages, metadata, APIs, and states
│   ├── components/
│   │   ├── forms/             # Validated forms and fields
│   │   ├── graphics/          # Telemetry chart, marks, and diagrams
│   │   ├── lanes/             # Lane explorer
│   │   ├── layout/            # Header, footer, and section navigation
│   │   ├── motion/            # Smooth scroll and animation primitives
│   │   ├── notes/             # Field-note renderer
│   │   ├── sections/          # Product-page sections
│   │   └── ui/                # Reusable interface primitives
│   ├── db/                    # Schema, query layer, and deterministic seed
│   └── lib/                   # Site data, validation, GSAP, rate limit, helpers
├── drizzle.config.json
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Local development

### Prerequisites

- Node.js 22 or a compatible newer release
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/coldharbour.git
cd coldharbour
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create `.env.local` in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env.local` or real database credentials.

### 4. Create the database schema

The included `drizzle.config.json` currently points to a local PostgreSQL database. Update its connection string when necessary, then run:

```bash
npx drizzle-kit push --config=drizzle.config.json
```

When the application starts against an empty schema, `src/instrumentation.ts` invokes the deterministic seed process and fills the database with sample lanes, readings, excursions, and field notes.

### 5. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint across the project |
| `npm run typecheck` | Run TypeScript without emitting files |

## Verification

Before deployment, run:

```bash
npm run lint
npm run typecheck
npm run build
```

After starting the production server, verify the health endpoint:

```text
GET /api/health
```

A healthy application returns:

```json
{
  "ok": true
}
```

## Deployment

Coldharbour requires a Node.js deployment target and a reachable PostgreSQL database.

For Vercel or Netlify:

1. Push the repository to GitHub.
2. Import the repository into the hosting provider.
3. Add `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` as environment variables.
4. Push the Drizzle schema to the production database.
5. Deploy using the standard `npm run build` command.
6. Confirm that `/api/health` returns `{ "ok": true }`.

Do not deploy this project as a plain static folder. It contains server-rendered pages, API routes, database queries, and form handlers.

## Accessibility and motion

The interface targets WCAG 2.2 AA and includes:

- Visible focus states
- Skip navigation
- Keyboard-operable charts and controls
- Status labels in addition to colour
- Live regions for form feedback
- Reduced-motion handling as an alternative experience
- Responsive layouts tested from narrow phones to large desktop displays

## Data model

The PostgreSQL schema contains six tables:

- `lanes`
- `readings`
- `excursions`
- `field_notes`
- `leads`
- `subscribers`

The seed process is deterministic, so repeated fresh installations produce the same demonstration data and chart shapes.

## Repository metadata

**Suggested description**

> Evidence-first cold-chain monitoring for clinical shipments, built with Next.js, PostgreSQL, Drizzle, GSAP, Lenis, and Tailwind CSS.

**Suggested topics**

```text
nextjs typescript react postgresql drizzle-orm tailwindcss gsap lenis
cold-chain clinical-trials data-visualization accessibility
```

## License

No licence has been selected yet. Add a `LICENSE` file before publishing the project for reuse or accepting external contributions.
