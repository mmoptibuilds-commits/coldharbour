import { z } from "zod";

/** Collapse runs of whitespace. People paste from spreadsheets and emails. */
export const tidy = (value: string) => value.replace(/\s+/g, " ").trim();

export const VOLUME_OPTIONS = [
  { value: "under-10", label: "Under 10 shipments a month" },
  { value: "10-50", label: "10 to 50 shipments a month" },
  { value: "50-250", label: "50 to 250 shipments a month" },
  { value: "250-plus", label: "More than 250 a month" },
  { value: "planning", label: "Not shipping yet, planning a study" },
] as const;

const VOLUME_VALUES = VOLUME_OPTIONS.map((option) => option.value) as [string, ...string[]];

/**
 * One schema for the browser and the route handler. Every rule is string in,
 * string out, so React Hook Form and the server agree on the shape.
 */
export const walkthroughSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter the name we should ask for")
    .max(80, "Keep this under 80 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter a work email we can reply to")
    .email("That address is missing something. Check it and try again"),
  company: z
    .string()
    .trim()
    .min(2, "Enter your organisation")
    .max(120, "Keep this under 120 characters"),
  role: z
    .string()
    .trim()
    .min(2, "Enter your role, for example QA lead")
    .max(120, "Keep this under 120 characters"),
  shipmentVolume: z.enum(VOLUME_VALUES, { message: "Choose the closest shipping volume" }),
  lanesOfInterest: z.string().trim().max(200, "Keep this under 200 characters").optional(),
  message: z
    .string()
    .trim()
    .min(20, "Twenty characters or more, so the call starts in the right place")
    .max(1200, "Keep this under 1200 characters"),
  /** Honeypot. Hidden from people, so anything here came from a bot. */
  website: z.string().max(0).optional(),
});

export type WalkthroughValues = z.infer<typeof walkthroughSchema>;

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Enter your email").email("Enter a valid email address"),
});

/** Requirements shown live under the message field. */
export function messageChecks(value: string) {
  const trimmed = value.trim();
  return [
    { id: "length", label: "20 characters or more", met: trimmed.length >= 20 },
    {
      id: "context",
      label: "Names a lane, product or temperature profile",
      met: /(lane|°c|celsius|cold|froz|ambient|cryo|vaccine|biologic|kit|depot|study|phase|shipment|probe)/i.test(
        trimmed,
      ),
    },
  ];
}

export const FIELD_LABELS: Record<string, string> = {
  name: "Your name",
  email: "Work email",
  company: "Organisation",
  role: "Your role",
  shipmentVolume: "Shipping volume",
  lanesOfInterest: "Lanes of interest",
  message: "What you want to look at",
};
