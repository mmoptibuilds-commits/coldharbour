import { db } from "@/db";
import { leads } from "@/db/schema";
import { clientKey, rateLimit, sweep } from "@/lib/rate-limit";
import { tidy, walkthroughSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  sweep();
  const limit = rateLimit(clientKey(request, "walkthrough"), 5);
  if (!limit.allowed) {
    return Response.json(
      {
        ok: false,
        message: `Too many requests from this address. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes, or email hello@coldharbour.example.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "The request body was not valid JSON." }, { status: 400 });
  }

  const parsed = walkthroughSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return Response.json(
      { ok: false, message: "Some answers need another look.", fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot filled means a bot. Answer as if it worked and store nothing.
  if (parsed.data.website) {
    return Response.json({ ok: true, message: "Request received." });
  }

  try {
    const [row] = await db
      .insert(leads)
      .values({
        // Collapse the whitespace people paste in from spreadsheets and signatures.
        name: tidy(parsed.data.name),
        email: parsed.data.email,
        company: tidy(parsed.data.company),
        role: tidy(parsed.data.role),
        shipmentVolume: parsed.data.shipmentVolume,
        lanesOfInterest: parsed.data.lanesOfInterest ? tidy(parsed.data.lanesOfInterest) : null,
        message: parsed.data.message,
        source: "contact",
      })
      .returning({ id: leads.id });

    return Response.json({
      ok: true,
      reference: row ? `CH-${String(row.id).padStart(4, "0")}` : "CH-0000",
      message: "Request received.",
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message:
          "The request did not save. Nothing was lost on this page, so try again, or email hello@coldharbour.example.",
      },
      { status: 500 },
    );
  }
}
