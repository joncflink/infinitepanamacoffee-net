import { createClient } from "@/lib/supabase/client";

/** Must match the `action` check constraint on reorder_events (migration 001). */
export type ReorderAction =
  | "reserve_clicked"
  | "reorder_clicked"
  | "join_next_harvest_clicked"
  | "amazon_clicked";

/**
 * Fire-and-forget CTA tracking. Never call `.select()` here — reorder_events
 * has no public SELECT policy, so requesting the row back would fail RLS on
 * the RETURNING clause (see migration 009). Errors are logged, not thrown,
 * so a tracking failure can never block the underlying WhatsApp/Amazon link.
 */
export function logReorderEvent(params: {
  lotId: string;
  action: ReorderAction;
  destinationUrl: string;
}): void {
  try {
    const supabase = createClient();
    supabase
      .from("reorder_events")
      .insert({
        lot_id: params.lotId,
        action: params.action,
        destination_url: params.destinationUrl,
      })
      .then(({ error }) => {
        if (error) console.error("reorder_event log failed:", error.message);
      });
  } catch (err) {
    // createClient() throws synchronously if env vars are missing/invalid —
    // catch that too, not just the insert's promise rejection.
    console.error("reorder_event log failed:", err);
  }
}
