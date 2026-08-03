/**
 * Fills a fresh database with the demonstration dataset on server start.
 * Idempotent: it exits immediately when the lanes table already has rows, and
 * it never throws into the request path if the schema has not been pushed yet.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { seedIfEmpty } = await import("@/db/seed");
    const result = await seedIfEmpty();
    if (result.seeded) {
      console.info("[coldharbour] seeded demonstration dataset");
    }
  } catch (error) {
    console.warn(
      "[coldharbour] seed skipped:",
      error instanceof Error ? error.message : error,
    );
  }
}
