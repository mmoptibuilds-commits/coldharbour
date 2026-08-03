# Motion system

## Ownership
| System | Owns |
| --- | --- |
| Lenis | Scroll interpolation only. One provider at the app root. Disabled under reduced motion |
| GSAP + ScrollTrigger | Hero timeline, masked line reveals, pinned failure narrative, trace draw, parallax planes, count-ups, scroll progress |
| Motion (Framer) | Mobile drawer, chart tooltip, form state changes, list filtering, page entrance |
| CSS | Colour, border, opacity hovers, focus-visible rings, reduced-motion overrides |

No element is animated on the same property by two systems. Where both are needed, the outer
wrapper belongs to GSAP and the inner element to Motion.

## Tokens
```
--dur-instant 80ms    --dur-fast 140ms    --dur-control 180ms
--dur-standard 260ms  --dur-layout 360ms  --dur-section 520ms  --dur-cinematic 760ms

--ease-out       cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out    cubic-bezier(0.65, 0, 0.35, 1)
--ease-emphasis  cubic-bezier(0.16, 1, 0.3, 1)
--ease-snap      cubic-bezier(0.34, 1.4, 0.64, 1)
```
Spring feel comes from `--ease-snap` on release, never on entrance of large surfaces.

## Patterns
- **Masked lines**: headline lines sit in `overflow: hidden` wrappers, translate from 105% with a
  70ms stagger. Text stays in the DOM and is readable before animation runs.
- **Trace draw**: chart paths animate `stroke-dashoffset` once on entry, 760ms, ease-out.
- **Pinned narrative**: one ScrollTrigger with `scrub: 0.6` drives a four-step timeline. Pinning is
  created inside `gsap.matchMedia()` for `(min-width: 1024px)` only. Below that the steps stack.
- **Parallax planes**: max 40px travel, transform only, `scrub: true`.
- **Press**: 0.97 scale, 80ms down, spring release. Ripple starts at the pointer coordinate, clipped
  to the component radius, removed on animation end.
- **Route entrance**: 260ms opacity and 8px rise on the main region, once per navigation.

## Reduced motion
`gsap.matchMedia()` registers a `(prefers-reduced-motion: reduce)` context that sets every animated
element to its final state and creates no ScrollTriggers. Lenis is never constructed. Ripples fade
in place without scaling. Count-ups jump to the final number. Carousel autoplay never existed.

## Cleanup
Every GSAP call runs inside `useGSAP` with a `scope`, so contexts revert on unmount. Lenis is
destroyed and removed from `gsap.ticker` on unmount. `ScrollTrigger.refresh()` runs after fonts
resolve and after the lane list filters.

## Performance rules
Transforms and opacity only. No animated blur regions larger than 200px. No box-shadow animation on
large panels. Scroll progress writes to a CSS variable through a ref, never through React state.
