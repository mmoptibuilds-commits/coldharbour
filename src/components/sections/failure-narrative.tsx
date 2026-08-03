"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { MaskedLines } from "@/components/motion/primitives";
import { FAILURE_STAGES } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked narrative. The diagram sticks on large screens while the four
 * stages scroll past; below `lg` the same content reads as four stacked blocks.
 * ScrollTrigger only reports which stage is active, so React renders four times
 * across the whole section rather than on every frame.
 */
export function FailureNarrative() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-stage]");
        steps.forEach((step, index) => {
          gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 62%",
              end: "bottom 55%",
              onEnter: () => setActive(index),
              onEnterBack: () => setActive(index),
            },
          });
        });

        if (rootRef.current && progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 60%",
                end: "bottom 70%",
                scrub: 0.5,
              },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const stage = FAILURE_STAGES[active] ?? FAILURE_STAGES[0];

  return (
    <section ref={rootRef} className="relative py-24 md:py-32" aria-label="Where lanes fail">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>Where lanes fail</Eyebrow>
          <MaskedLines
            as="h2"
            className="display mt-4 text-3xl text-ink md:text-4xl"
            lines={["Cargo holds run cold and steady.", "The ground does not."]}
          />
          <p className="measure mt-6 text-lg text-mutedfg">
            Across the eight lanes in this sample network, 71% of out-of-band minutes happened while
            the shipment sat still. Four windows produce nearly all of them.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-5">
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-0 hidden w-px bg-line lg:block">
              <span
                ref={progressRef}
                className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-accent"
              />
            </div>

            <ol className="lg:pl-8">
              {FAILURE_STAGES.map((item, index) => (
                <li
                  key={item.id}
                  data-stage={index}
                  className={cn(
                    "border-b border-line py-8 transition-opacity duration-[360ms] first:pt-0 last:border-b-0",
                    "lg:opacity-45",
                    index === active && "lg:opacity-100",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xs tracking-[0.14em] text-accent uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="label-mono">{item.label}</span>
                    <span className="ml-auto font-mono text-2xs text-muted">{item.minutes}</span>
                  </div>
                  <h3 className="mt-4 text-xl text-ink">{item.title}</h3>
                  <p className="measure mt-3 text-base text-mutedfg">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <StageDiagram active={active} />
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-4">
                <p className="font-mono text-xs text-mutedfg">
                  <span className="text-muted">Stage {String(active + 1).padStart(2, "0")} /</span>{" "}
                  {stage.label}
                </p>
                <p className="font-mono text-2xs tracking-[0.1em] text-muted uppercase">
                  {stage.minutes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const NODES = [
  { x: 60, label: "Depot" },
  { x: 200, label: "Ramp" },
  { x: 340, label: "Hold" },
  { x: 480, label: "Release" },
];

/** Layered schematic: grid plane, route plane, readout plane. */
function StageDiagram({ active }: { active: number }) {
  const risk = [12, 71, 22, 6];

  return (
    <figure className="relative overflow-hidden rounded-lg border border-line bg-raised p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] md:p-7">
      <div aria-hidden="true" className="grid-field pointer-events-none absolute inset-0 opacity-60" />
      <figcaption className="relative label-mono">Chain of custody, one shipment</figcaption>

      <svg
        viewBox="0 0 540 240"
        className="relative mt-6 w-full"
        role="img"
        aria-label={`Route schematic. Stage ${active + 1} of 4 highlighted: ${NODES[active]?.label ?? ""}.`}
      >
        {/* background plane: ambient band */}
        <path
          d="M20 150 C 90 150, 120 96, 200 96 S 300 148, 340 140 S 440 160, 520 158"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* route rail */}
        <line x1="20" y1="196" x2="520" y2="196" stroke="var(--border)" strokeWidth="2" />
        <line
          x1="20"
          y1="196"
          x2={NODES[active]?.x ?? 60}
          y2="196"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-[x2] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />

        {/* risk columns */}
        {NODES.map((node, index) => {
          const height = 12 + risk[index]! * 1.1;
          const on = index === active;
          return (
            <g key={node.label}>
              <rect
                x={node.x - 26}
                y={186 - height}
                width="52"
                height={height}
                rx="3"
                fill={on ? "var(--accent)" : "var(--border)"}
                fillOpacity={on ? 0.22 : 0.5}
                stroke={on ? "var(--accent)" : "var(--border-strong)"}
                strokeOpacity={on ? 0.6 : 0.5}
                className="transition-all duration-[360ms]"
              />
              <text
                x={node.x}
                y={178 - height}
                textAnchor="middle"
                fontSize="11"
                className="font-mono"
                fill={on ? "var(--accent)" : "var(--muted)"}
              >
                {risk[index]}%
              </text>
              <circle
                cx={node.x}
                cy="196"
                r={on ? 6 : 4}
                fill={on ? "var(--accent)" : "var(--surface)"}
                stroke={on ? "var(--accent)" : "var(--border-strong)"}
                strokeWidth="2"
                className="transition-all duration-[360ms]"
              />
              <text
                x={node.x}
                y="222"
                textAnchor="middle"
                fontSize="11"
                className="font-mono"
                fill={on ? "var(--foreground)" : "var(--muted)"}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* foreground readout */}
        <g transform="translate(384, 24)">
          <rect width="136" height="54" rx="8" fill="var(--surface)" stroke="var(--border)" />
          <text x="12" y="22" fontSize="10" className="font-mono" fill="var(--muted)">
            OUT OF BAND
          </text>
          <text x="12" y="42" fontSize="16" className="font-mono" fill="var(--accent)">
            {risk[active]}% of minutes
          </text>
        </g>
      </svg>
    </figure>
  );
}
