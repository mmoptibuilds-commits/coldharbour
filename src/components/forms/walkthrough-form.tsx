"use client";

import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RequirementList, SelectField, TextAreaField, TextField } from "@/components/forms/fields";
import {
  FIELD_LABELS,
  VOLUME_OPTIONS,
  messageChecks,
  walkthroughSchema,
  type WalkthroughValues,
} from "@/lib/validation";

type Result =
  | { kind: "idle" }
  | { kind: "sent"; reference: string }
  | { kind: "failed"; message: string };

const EMPTY: WalkthroughValues = {
  name: "",
  email: "",
  company: "",
  role: "",
  shipmentVolume: "" as WalkthroughValues["shipmentVolume"],
  lanesOfInterest: "",
  message: "",
  website: "",
};

export function WalkthroughForm() {
  const uid = useId().replace(/:/g, "");
  const [result, setResult] = useState<Result>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitted, dirtyFields },
  } = useForm<WalkthroughValues>({
    resolver: zodResolver(walkthroughSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: EMPTY,
  });

  const message = useWatch({ control, name: "message", defaultValue: "" }) ?? "";
  const checks = messageChecks(message);

  const missing = (Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[]).filter(
    (key) => key !== "lanesOfInterest" && Boolean(errors[key as keyof WalkthroughValues]),
  );

  async function onSubmit(values: WalkthroughValues) {
    setResult({ kind: "idle" });
    try {
      const response = await fetch("/api/walkthrough", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reference?: string;
        message?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          const entries = Object.entries(data.fieldErrors);
          entries.forEach(([field, text], index) => {
            setError(field as keyof WalkthroughValues, { message: text }, { shouldFocus: index === 0 });
          });
        }
        setResult({
          kind: "failed",
          message: data.message ?? "The request did not send. Your answers are still here.",
        });
        return;
      }

      setResult({ kind: "sent", reference: data.reference ?? "CH-0000" });
      reset(EMPTY);
    } catch {
      setResult({
        kind: "failed",
        message: "No connection to the server. Your answers are still here, so try again.",
      });
    }
  }

  if (result.kind === "sent") {
    return (
      <div className="rounded-lg border border-line bg-raised p-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
        <p className="label-mono">Request logged</p>
        <h2 className="display mt-4 text-2xl text-ink">Reference {result.reference}</h2>
        <p className="measure mt-4 text-base text-mutedfg">
          Saved to the demonstration database. In production this would route to the solutions
          engineer covering your region, who replies within one working day with two or three times
          for a 40 minute call.
        </p>
        <ol className="mt-6 space-y-3 border-t border-line pt-6">
          {[
            "You send the lane that worries you, with its profile and transit times.",
            "We read the lane together and mark where the record would have gaps.",
            "You get a written summary, including anything Coldharbour would not solve.",
          ].map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-mutedfg">
              <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="mt-8"
          onClick={() => setResult({ kind: "idle" })}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-lg border border-line bg-raised p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] md:p-8"
    >
      <div className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
        <TextField
          id={`${uid}-name`}
          label={FIELD_LABELS.name!}
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          id={`${uid}-email`}
          label={FIELD_LABELS.email!}
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id={`${uid}-company`}
          label={FIELD_LABELS.company!}
          autoComplete="organization"
          error={errors.company?.message}
          {...register("company")}
        />
        <TextField
          id={`${uid}-role`}
          label={FIELD_LABELS.role!}
          autoComplete="organization-title"
          error={errors.role?.message}
          {...register("role")}
        />
        <SelectField
          id={`${uid}-volume`}
          label={FIELD_LABELS.shipmentVolume!}
          options={VOLUME_OPTIONS}
          error={errors.shipmentVolume?.message}
          {...register("shipmentVolume")}
        />
        <TextField
          id={`${uid}-lanes`}
          label={FIELD_LABELS.lanesOfInterest!}
          optional
          hint="For example LHR to Singapore, 2 to 8 °C"
          error={errors.lanesOfInterest?.message}
          {...register("lanesOfInterest")}
        />
      </div>

      <div className="mt-2">
        <TextAreaField
          id={`${uid}-message`}
          label={FIELD_LABELS.message!}
          rows={5}
          error={errors.message?.message}
          aria-describedby={`${uid}-message-reqs`}
          {...register("message")}
        />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <RequirementList id={`${uid}-message-reqs`} items={checks} />
          <p className="font-mono text-2xs text-muted tabular-nums">{message.trim().length}/1200</p>
        </div>
      </div>

      {/* Honeypot: positioned off screen, hidden from assistive technology */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" size="lg" loading={isSubmitting} loadingLabel="Sending">
          Request a walkthrough
        </Button>
        <p className="font-mono text-2xs leading-relaxed tracking-[0.08em] text-muted uppercase">
          No newsletter signup attached. One reply, from a person.
        </p>
      </div>

      <div aria-live="polite" className="mt-4 space-y-2">
        {isSubmitted && missing.length > 0 ? (
          <p className="text-sm text-[var(--danger)]">
            {missing.length} field{missing.length > 1 ? "s need" : " needs"} attention:{" "}
            {missing.map((key) => FIELD_LABELS[key]).join(", ")}.
          </p>
        ) : null}
        {result.kind === "failed" ? (
          <p className="text-sm text-[var(--danger)]">{result.message}</p>
        ) : null}
        {!isSubmitted && Object.keys(dirtyFields).length === 0 ? (
          <p className="sr-only">All fields except lanes of interest are required.</p>
        ) : null}
      </div>
    </form>
  );
}
