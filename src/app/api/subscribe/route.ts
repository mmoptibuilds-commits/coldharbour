import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { clientKey, rateLimit, sweep } from "@/lib/rate-limit";
import { subscribeSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  sweep();
  const limit = rateLimit(clientKey(request, "subscribe"), 8);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, message: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "The request body was not valid JSON." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Check the address and try again." },
      { status: 422 },
    );
  }

  try {
    await db.insert(subscribers).values({ email: parsed.data.email }).onConflictDoNothing();
    // A repeat address is a success from the reader's point of view.
    return Response.json({ ok: true, message: "Saved. Field notes go out roughly monthly." });
  } catch {
    return Response.json(
      { ok: false, message: "That did not save. Try again in a moment." },
      { status: 500 },
    );
  }
}
