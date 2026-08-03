# Implementation plan

## Stack
Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Drizzle ORM on PostgreSQL,
GSAP 3 + ScrollTrigger + `@gsap/react`, Lenis, Motion, React Hook Form + Zod, Embla, Radix Dialog
and Accordion. Fonts through `next/font/google`.

## Data
Six tables in `src/db/schema.ts`: `lanes`, `readings`, `excursions`, `field_notes`, `leads`,
`subscribers`. `src/db/seed.ts` generates a deterministic synthetic dataset (seeded PRNG, no
randomness between runs) and is invoked from `src/instrumentation.ts` when the tables are empty, so
a fresh database fills itself on server start. Query helpers live in `src/db/queries.ts`.

Pages that read the database render dynamically, which keeps the production build independent of
database state.

## Server / client split
Server components fetch and render everything by default. Client components: header and mobile
drawer, smooth scroll provider, scroll-driven sections, lane chart, lane explorer filters, forms,
carousel, accordion, count-ups. Data flows down as plain props.

## Routes and states
Each route ships content, responsive layout, motion, focus handling, and where relevant a loading
skeleton (`loading.tsx`), an empty state, and an error boundary (`error.tsx`, `global-error.tsx`,
`not-found.tsx`).

## Forms
`/contact` posts to `/api/walkthrough`. Zod schema shared between client and server
(`src/lib/validation.ts`), input normalised before validation (trimmed email lowercased, phone and
company whitespace collapsed). Server applies its own validation plus a per-IP token bucket. The
client focuses the first invalid field, keeps values after a server error, blocks duplicate
submissions while in flight, and announces results through a live region. Footer subscribe posts to
`/api/subscribe` and treats a repeat address as success.

## Verification
`npx next typegen`, `npm exec tsc --noEmit`, `npm run build`, then the platform build-and-start
healthcheck against `/api/health`.
