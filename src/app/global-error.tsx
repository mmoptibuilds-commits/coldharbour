"use client";

import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body className="bg-canvas text-ink">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
          <p className="font-mono text-2xs tracking-[0.14em] text-muted uppercase">
            Application error
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">The application stopped</h1>
          <p className="mt-5 text-base text-mutedfg">
            A failure escaped the page boundary, so the whole interface reloaded to this screen.
            Reloading usually clears it.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-muted">Reference {error.digest}</p>
          ) : null}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="h-12 rounded-md bg-accent px-6 text-base text-accentfg transition-colors hover:bg-accenthover active:scale-[0.98]"
            >
              Reload the page
            </button>
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-md border border-line bg-raised px-6 text-base text-ink hover:border-linestrong"
            >
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
