"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { detectDeviceType } from "@/lib/supabase/track";

/**
 * The printed QR itself encodes a bare canonical URL with no query string
 * (a param can never be added retroactively to already-printed labels), so
 * 'qr' only fires if a future QR revision or another channel adds
 * ?source=qr explicitly. 'legacy_redirect' is set by our own
 * /coffee/[slug] redirect. Anything else — including today's real QR
 * scans — is indistinguishable from a typed/bookmarked visit and reported
 * honestly as 'direct'.
 */
function detectSource(): string {
  const param = new URLSearchParams(window.location.search).get("source");
  if (param === "qr") return "qr";
  if (param === "legacy_redirect") return "legacy_redirect";
  return "direct";
}

/** Invisible — logs one qr_scan_events row per passport page view. Fire-and-forget, never blocks render. */
export default function QrScanLogger({
  lotId,
  passportNumber,
}: {
  lotId: string;
  passportNumber: string;
}) {
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    try {
      const supabase = createClient();
      supabase
        .from("qr_scan_events")
        .insert({
          lot_id: lotId,
          passport_number: passportNumber,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          device_type: detectDeviceType(navigator.userAgent),
          source: detectSource(),
        })
        .then(({ error }) => {
          if (error) console.error("qr_scan_event log failed:", error.message);
        });
    } catch (err) {
      // createClient() throws synchronously if env vars are missing/invalid —
      // catch that too, not just the insert's promise rejection.
      console.error("qr_scan_event log failed:", err);
    }
  }, [lotId, passportNumber]);

  return null;
}
