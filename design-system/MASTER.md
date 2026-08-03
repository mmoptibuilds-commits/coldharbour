# Coldharbour design system — master

Single source of truth. Page files under `design-system/pages/` record deviations only.

## Art direction
A cold instrument reading a warm problem. The canvas is near-black with a green-blue bias, the way
a chart recorder looks in a depot at night. One warm accent, ember orange, carries every action and
every out-of-band reading, so the eye learns that orange means "something needs a decision".
Structure comes from hairlines and a visible grid, not from stacked rounded cards.

Density 5/10, variance 7/10, motion 8/10 at the hero and narrative, 3/10 everywhere else.

## Colour — 60 / 30 / 10
- 60% canvas `#07090A` and surface `#0E1113`
- 30% raised surfaces `#14181B` / `#191E22`, borders `#1E2429` / `#2B3339`, muted text `#96A2A8`
- 10% ember accent `#FF6A2B`, plus data-only signal colours

Tokens (defined in `src/app/globals.css`):
```
--canvas --surface --surface-raised --surface-overlay
--foreground --muted --muted-foreground
--border --border-strong
--accent --accent-hover --accent-foreground
--cold  (in-band telemetry only)
--warn  (watch state)
--danger (form and system errors)
--focus-ring
```
Rules: accent never used as a large fill except the primary button and the active chart band.
In-band cyan and watch amber appear only inside data components, status dots and legends. Status is
always carried by a label as well as a colour.

Contrast checks performed against `#07090A`: foreground 15.9:1, muted-foreground 7.4:1,
accent 6.9:1, cold 9.8:1, warn 9.4:1. Accent foreground on accent 6.8:1.

## Typography
- Archivo variable (`wght` 100–900, `wdth` 62–125) for display and interface. Display uses
  `wdth 108–112` with tight tracking; interface text uses the normal width.
- JetBrains Mono for anything read off an instrument: lane codes, temperatures, timestamps,
  eyebrows, table headers, form hints.

Scale, ratio 1.25, fluid where it matters:
```
--text-2xs 11px  --text-xs 12.8px  --text-sm 14px  --text-base 16px
--text-lg 20px   --text-xl 25px    --text-2xl 31px --text-3xl 39px
--text-4xl 49px  --text-5xl clamp(2.75rem, 6vw, 4.25rem)
--text-6xl clamp(3.25rem, 8vw, 5.75rem)
```
Body measure 62–72ch. Display tracking −0.03em at 4xl and above. No thin weights below 16px.

## Spacing and grid
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128. Eyebrow to heading 12px, heading to lede 20px,
lede to actions 32px, section head to body 48px, section to section 96–128px (64–96px on mobile).

Container 1280px with 20px gutters at 320px growing to 48px at 1440px. Layout uses a 12-column grid
at `lg` and above; below that content stacks in priority order, never by mechanical shrink.
Breakpoints exercised: 320, 375, 430, 768, 1024, 1280, 1440, 1920.

## Radius
4 dots and chips · 6 inputs and small controls · 10 buttons and rows · 14 panels · 20 large frames ·
999 only for genuine dots. Nested surfaces drop one step.

## Depth
```
plane 0  environmental field gradient, grid lines           z 0
plane 1  page content                                        z 10
plane 2  raised panels: surface-raised + hairline            z 20
plane 3  floating: chart tooltip, hover preview              z 30
plane 4  sticky header, scroll progress                      z 40
plane 5  dialog, drawer, toast                               z 50
```
Light comes from the top left. Shadows are cold and low-alpha; a 1px top inner highlight
(`inset 0 1px 0 rgb(255 255 255 / 0.04)`) marks a raised plane. No glass on flat backgrounds.

## Gradients
Three sanctioned uses only:
1. Field gradient behind the hero and the closing band, radial, centre outside the frame.
2. Scroll fades on horizontal overflow and long tables.
3. Chart band fills, which encode data.
No gradient text on body copy, no mesh, no purple.

## Motion
See `MOTION_SYSTEM.md`. Durations 80/140/180/260/360/520/760ms with four eases. Lenis owns scroll
interpolation, GSAP owns scroll-linked sequences, Motion owns component enter and exit, CSS owns
hover, focus and colour.

## Component inventory
`SiteHeader` (Radix drawer) - `SiteFooter` - `SectionIndex` - `Container` - `Eyebrow` -
`Button` / `ButtonLink` (ripple + press) - `StatusDot` - `StatusTag` - `Tag` - `SpecRow` -
`SampleNote` - `EmptyState` - `Skeleton` - `LaneChart` - `Sparkline` - `RiskRing` - `BandGlyph` -
`StageDiagram` - `Reveal` - `MaskedLines` - `StaggerGroup` - `ParallaxLayer` - `CountUp` -
`ScrollProgress` - `SmoothScrollProvider` - `TextField` / `TextAreaField` / `SelectField` -
`RequirementList` - `WalkthroughForm` - `SubscribeForm` - `LaneExplorer` - `Scenarios` (Embla) -
`Faq` (Radix accordion) - `NoteBody`.

Every interactive component defines default, hover, focus-visible, pressed, disabled, loading and
error appearance, plus touch and reduced-motion behaviour.
