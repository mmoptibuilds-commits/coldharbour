"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Container, Eyebrow, SampleNote, Tag } from "@/components/ui/primitives";
import { SCENARIOS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Sequential reading of three composite deployments. Autoplay does not exist. */
export function Scenarios() {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    duration: 22,
  });
  // Embla is an external store, so read it directly rather than mirroring it in state.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!embla) return () => {};
      embla.on("select", onChange).on("reInit", onChange).on("resize", onChange);
      return () => {
        embla.off("select", onChange).off("reInit", onChange).off("resize", onChange);
      };
    },
    [embla],
  );

  const selected = useSyncExternalStore(
    subscribe,
    () => embla?.selectedScrollSnap() ?? 0,
    () => 0,
  );
  const canPrev = useSyncExternalStore(
    subscribe,
    () => embla?.canScrollPrev() ?? false,
    () => false,
  );
  const canNext = useSyncExternalStore(
    subscribe,
    () => embla?.canScrollNext() ?? true,
    () => true,
  );

  return (
    <section className="border-t border-line py-24 md:py-32" aria-labelledby="scenarios-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>Deployment scenarios</Eyebrow>
            <h2 id="scenarios-title" className="display mt-4 text-3xl text-ink md:text-4xl">
              Three shapes this takes
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <CarouselButton
              label="Previous scenario"
              disabled={!canPrev}
              onClick={() => embla?.scrollPrev()}
              direction="prev"
            />
            <CarouselButton
              label="Next scenario"
              disabled={!canNext}
              onClick={() => embla?.scrollNext()}
              direction="next"
            />
          </div>
        </div>

        <div
          className="mt-12 overflow-hidden"
          ref={emblaRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Deployment scenarios"
        >
          <div className="flex gap-5">
            {SCENARIOS.map((scenario, index) => (
              <article
                key={scenario.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${SCENARIOS.length}: ${scenario.title}`}
                className={cn(
                  "min-w-0 flex-[0_0_88%] rounded-lg border border-line bg-raised p-6 transition-opacity duration-[360ms] md:flex-[0_0_46%] lg:flex-[0_0_38%]",
                  selected === index ? "opacity-100" : "opacity-[0.62]",
                )}
              >
                <div className="flex flex-wrap gap-2">
                  {scenario.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <h3 className="mt-5 text-xl text-ink">{scenario.title}</h3>
                <dl className="mt-5 space-y-4 border-t border-line pt-5">
                  <div>
                    <dt className="label-mono">Before</dt>
                    <dd className="mt-1.5 text-sm text-mutedfg">{scenario.situation}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">What changed</dt>
                    <dd className="mt-1.5 text-sm text-mutedfg">{scenario.change}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">Result</dt>
                    <dd className="mt-1.5 text-sm text-ink">{scenario.outcome}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <ol className="flex items-center gap-2">
            {SCENARIOS.map((scenario, index) => (
              <li key={scenario.id}>
                <button
                  type="button"
                  onClick={() => embla?.scrollTo(index)}
                  aria-label={`Show scenario ${index + 1}: ${scenario.title}`}
                  aria-current={selected === index ? "true" : undefined}
                  className="group flex h-11 w-8 items-center justify-center"
                >
                  <span
                    className={cn(
                      "h-0.5 w-6 rounded-full transition-colors duration-[180ms]",
                      selected === index ? "bg-accent" : "bg-linestrong group-hover:bg-mutedfg",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
          <SampleNote className="max-w-md">
            Composite scenarios written for this demonstration build. They describe patterns, not
            named customers.
          </SampleNote>
        </div>
      </Container>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  direction,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-raised text-ink transition-colors duration-[180ms] hover:border-linestrong hover:bg-overlay active:scale-[0.97] disabled:opacity-40 disabled:hover:border-line"
    >
      <svg viewBox="0 0 16 16" className={cn("size-4", direction === "prev" && "rotate-180")} fill="none" aria-hidden="true">
        <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
