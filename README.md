<div align="center">

<img src="./public/icon.svg" alt="Coldharbour mark" width="84" height="84" />

# Coldharbour

**Temperature evidence for clinical shipments.**

An evidence-first cold-chain monitoring experience for clinical supply teams, built around live telemetry, human escalation, and inspection-ready release records.

<p>
  <a href="https://coldharbour-mm.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-coldharbour--mm.vercel.app-EA5A2A?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo" />
  </a>
</p>

<p>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16.2.6-111111?style=flat-square&logo=nextdotjs" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19.2.6-111111?style=flat-square&logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-111111?style=flat-square&logo=typescript" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4.1-111111?style=flat-square&logo=tailwindcss" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Drizzle-111111?style=flat-square&logo=postgresql" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed_on-Vercel-111111?style=flat-square&logo=vercel" />
</p>

</div>

---

## Live deployment

| Destination | URL |
| --- | --- |
| Website | [coldharbour-mm.vercel.app](https://coldharbour-mm.vercel.app) |
| Lane explorer | [coldharbour-mm.vercel.app/lanes](https://coldharbour-mm.vercel.app/lanes) |
| Field notes | [coldharbour-mm.vercel.app/field-notes](https://coldharbour-mm.vercel.app/field-notes) |
| Health check | [coldharbour-mm.vercel.app/api/health](https://coldharbour-mm.vercel.app/api/health) |

---

## Overview

Coldharbour is a full-stack product website and operational data explorer for a fictional B2B clinical-shipment monitoring platform.

The experience follows a shipment from pack-out to QA release. It records payload temperature, surfaces excursions, routes alerts to a named reviewer, and assembles the evidence required for a release decision.

The visual direction avoids the usual SaaS-dashboard look. It draws from laboratory chart recorders, freight manifests, validation paperwork, depot instrumentation, and chain-of-custody records: near-black surfaces, fine grid lines, dense telemetry, restrained typography, and a single ember-orange action colour.

> [!IMPORTANT]
> Coldharbour is a demonstration project. All lanes, companies, readings, field notes, outcomes, and operational statistics are synthetic.

## Experience highlights

- Live, scrubbable temperature traces with payload and ambient readings
- Searchable, sortable, and filterable shipment-lane explorer
- Lane detail pages with excursion logs and custody timelines
- Evidence-pack breakdowns for QA and inspection workflows
- Platform, pricing, field notes, privacy, and contact routes
- Walkthrough and newsletter forms with shared client/server validation
- PostgreSQL-backed data with deterministic demonstration records
- Smooth scrolling, scroll narratives, masked text, count-ups, and micro-interactions
- Keyboard-first interactions and reduced-motion alternatives
- Dynamic metadata, sitemap, robots rules, JSON-LD, loading states, and error boundaries
- Responsive layouts for phones, tablets, laptops, and large desktop displays

## Product flow

```mermaid
flowchart TD
    A[Probe reading every 60 seconds] --> B[Excursion detection]
    B --> C[Named reviewer escalation]
    C --> D[Acknowledgement and response trail]
    D --> E[Evidence pack]
    E --> F[QA release decision]
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
| UI primitives | Radix Dialog and Accordion |
| Carousel | Embla Carousel |
| Fonts | Archivo Variable and JetBrains Mono through `next/font` |
| Deployment | Vercel |
| Database hosting | Managed PostgreSQL-compatible service such as Neon |

## Design system

Coldharbour uses a deliberate **60 / 30 / 10** visual hierarchy:

- **60%** near-black canvas and base surfaces
- **30%** raised surfaces, borders, and muted information
- **10%** ember orange for action and decision points

Telemetry uses separate semantic signal colours for in-band, watch, and error states. Status is never communicated by colour alone.

Detailed design and implementation notes live in:

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
│   │   ├── forms/             # Validated forms and form fields
│   │   ├── graphics/          # Telemetry chart, marks, and diagrams
│   │   ├── lanes/             # Lane explorer
│   │   ├── layout/            # Header, footer, and section navigation
│   │   ├── motion/            # Smooth-scroll and animation primitives
│   │   ├── notes/             # Field-note renderer
│   │   ├── sections/          # Product-page sections
│   │   └── ui/                # Reusable interface primitives
│   ├── db/                    # Schema, queries, and deterministic seed logic
│   └── lib/                   # Site data, validation, GSAP, rate limit, and helpers
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Local development

### Prerequisites

- Node.js 22 or newer
- npm
- A reachable PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/mmoptibuilds-commits/coldharbour.git
cd coldharbour
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env`, `.env.local`, database credentials, API keys, or tokens.

### 4. Apply the database schema

```bash
npm run db:push
```

The project uses [`drizzle.config.ts`](./drizzle.config.ts), which reads `DATABASE_URL` from the environment.

### 5. Seed a fresh database

The repository includes deterministic seed logic in [`src/db/seed.ts`](./src/db/seed.ts).

A fresh database must be seeded once through a trusted server-side runner or a temporary protected route. Do not expose an unauthenticated seed endpoint in production.

The live deployment is already seeded.

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

> [!NOTE]
> The project uses Webpack for local development and production builds. This also keeps development compatible with Android/Termux, where Turbopack native bindings are unavailable.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server with Webpack |
| `npm run build` | Create a production build with Webpack |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint across the project |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run db:push` | Apply the Drizzle schema to PostgreSQL |
| `npm run db:studio` | Open Drizzle Studio |

## Verification

Before deployment, run:

```bash
npm run lint
npm run typecheck
npm run build
```

After starting the application, verify:

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

Coldharbour requires a Node.js deployment target and a reachable PostgreSQL database. It must not be deployed as a plain static folder.

### Vercel

1. Push the repository to GitHub.
2. Import `mmoptibuilds-commits/coldharbour` into Vercel.
3. Keep the framework preset set to **Next.js**.
4. Add the required environment variables.
5. Deploy with the default install command and `npm run build`.
6. Confirm that `/api/health` returns `{ "ok": true }`.

### Required environment variables

| Variable | Sensitive | Example |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | No | `https://coldharbour-mm.vercel.app` |

`NEXT_PUBLIC_SITE_URL` is intentionally public because Next.js may embed variables prefixed with `NEXT_PUBLIC_` into browser-facing code.

## Accessibility and motion

The interface targets WCAG 2.2 AA and includes:

- Visible focus states
- Skip navigation
- Keyboard-operable charts and controls
- Status labels in addition to colour
- Live regions for form feedback
- Reduced-motion handling as an alternative experience
- Responsive layouts from narrow phones to large displays

## Data model

The PostgreSQL schema contains six main tables:

- `lanes`
- `readings`
- `excursions`
- `field_notes`
- `leads`
- `subscribers`

The seed process is deterministic, allowing repeatable demonstration data and chart shapes across fresh environments.

## Repository metadata

**Description**

> Evidence-first cold-chain monitoring for clinical shipments, built with Next.js, PostgreSQL, Drizzle, GSAP, Lenis, and Tailwind CSS.

**Suggested topics**

```text
nextjs
typescript
react
postgresql
drizzle-orm
tailwindcss
gsap
lenis
cold-chain
clinical-trials
data-visualization
accessibility
vercel
```

## License

No licence has been selected. Add a `LICENSE` file before allowing reuse, redistribution, or external contributions.

---

<div align="center">

Built as a full-stack product-design and engineering demonstration.

[Live site](https://coldharbour-mm.vercel.app) ·
[Lane explorer](https://coldharbour-mm.vercel.app/lanes) ·
[Field notes](https://coldharbour-mm.vercel.app/field-notes)

</div>
