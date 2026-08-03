"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { subscribeSchema } from "@/lib/validation";

type State = { kind: "idle" | "loading" | "done" | "error"; message?: string };

export function SubscribeForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  const parsed = subscribeSchema.safeParse({ email });
  const fieldError = touched && !parsed.success ? "Enter a valid email address" : undefined;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!parsed.success) {
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    if (state.kind === "loading") return;

    setState({ kind: "loading" });
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setState({ kind: "error", message: data.message ?? "That did not save. Try again in a moment." });
        return;
      }
      setState({ kind: "done", message: data.message ?? "You are on the list." });
      setEmail("");
      setTouched(false);
    } catch {
      setState({ kind: "error", message: "No connection to the server. Try again in a moment." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm">
      <label htmlFor={`${id}-email`} className="label-mono">
        Field notes, roughly monthly
      </label>
      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (state.kind !== "idle") setState({ kind: "idle" });
            }}
            onBlur={() => setTouched(true)}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? `${id}-error` : `${id}-hint`}
            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] aria-[invalid=true]:border-[var(--danger)]"
          />
        </div>
        <Button type="submit" variant="secondary" size="md" loading={state.kind === "loading"} loadingLabel="Saving">
          Subscribe
        </Button>
      </div>

      <p id={`${id}-hint`} className="mt-2 font-mono text-2xs tracking-[0.06em] text-muted uppercase">
        Sample build. Addresses are stored in the demo database and nothing is sent.
      </p>

      <div aria-live="polite" className="mt-2 min-h-[1.25rem]">
        {fieldError ? (
          <p id={`${id}-error`} className="text-xs text-[var(--danger)]">
            {fieldError}
          </p>
        ) : null}
        {state.kind === "done" ? <p className="text-xs text-cold">{state.message}</p> : null}
        {state.kind === "error" ? (
          <p className="text-xs text-[var(--danger)]">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
