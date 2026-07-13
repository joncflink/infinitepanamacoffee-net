import { createClient } from "@/lib/supabase/client";

/** Shared with QrScanLogger, which also needs this to fill in device_type. */
export function detectDeviceType(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Must match the `action` check constraint on reorder_events (migrations
 * 001, 010, 013, 014). "amazon_product"/"amazon_storefront_fallback"/
 * "amazon_launch_list_clicked" are the only actions TrackedAmazonLink fires
 * (see getAmazonCta) — "amazon_clicked" stays listed here for historical
 * rows only, nothing fires it anymore.
 */
export type ReorderAction =
  | "reserve_clicked"
  | "reorder_clicked"
  | "join_next_harvest_clicked"
  | "amazon_clicked"
  | "whatsapp_clicked"
  | "amazon_product"
  | "amazon_storefront_fallback"
  | "amazon_launch_list_clicked";

/**
 * Fire-and-forget CTA tracking. Never call `.select()` here — reorder_events
 * has no public SELECT policy, so requesting the row back would fail RLS on
 * the RETURNING clause (see migration 009). Errors are logged, not thrown,
 * so a tracking failure can never block the underlying WhatsApp/Amazon link.
 */
export function logReorderEvent(params: {
  lotId: string;
  passportNumber: string;
  action: ReorderAction;
  destinationUrl: string;
}): void {
  try {
    const supabase = createClient();
    supabase
      .from("reorder_events")
      .insert({
        lot_id: params.lotId,
        passport_number: params.passportNumber,
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

/**
 * Must match the `event` check constraint on product_events (proposed
 * migration 012, not yet applied — see that file). Covers the
 * passport-discovery / Cellar journey; separate from the CTA-click
 * tracking above (reorder_events) and the QR-scan tracking in
 * QrScanLogger.tsx (qr_scan_events).
 */
export type ProductEvent =
  | "passport_lookup_started"
  | "passport_lookup_success"
  | "passport_lookup_not_found"
  | "cellar_item_added"
  | "cellar_item_removed"
  | "cellar_viewed"
  | "passport_reorder_clicked"
  | "find_another_passport_clicked";

/**
 * Fire-and-forget anonymous event tracking. No personal data — just the
 * event name, the Passport Number involved (when there is one), where in
 * the app it happened, and device type. Until migration 012 is applied,
 * every call here fails silently (logged, not thrown) and never blocks
 * the action it's attached to — same contract as logReorderEvent.
 */
export function logProductEvent(params: {
  event: ProductEvent;
  passportNumber?: string;
  source?: string;
}): void {
  try {
    const supabase = createClient();
    supabase
      .from("product_events")
      .insert({
        event: params.event,
        passport_number: params.passportNumber ?? null,
        source: params.source ?? null,
        device_type:
          typeof navigator === "undefined" ? null : detectDeviceType(navigator.userAgent),
      })
      .then(({ error }) => {
        if (error) console.error(`product_event (${params.event}) log failed:`, error.message);
      });
  } catch (err) {
    console.error(`product_event (${params.event}) log failed:`, err);
  }
}
