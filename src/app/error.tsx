"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[coldharbour] route error", error);
  }, [error]);

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Something broke</Eyebrow>
          <h1 className="display mt-5 text-4xl text-ink md:text-5xl">
            This page did not load
          </h1>
          <p className="measure mt-6 text-lg text-mutedfg">
            The request failed on the server. Retrying usually works, and if it does not, the lane
            explorer and the field notes are unaffected.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-2xs tracking-[0.1em] text-muted uppercase">
              Reference {error.digest}
            </p>
          ) : null}
          <div className="mt-9 flex flex-wrap gap-3">
            <Button type="button" onClick={reset} size="lg">
              Try again
            </Button>
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-md border border-line bg-raised px-6 text-base text-ink transition-colors duration-[180ms] hover:border-linestrong hover:bg-overlay"
            >
              Back to the home page
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
