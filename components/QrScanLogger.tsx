"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

function detectDeviceType(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android/i.test(ua)) return "mobile";
  return "desktop";
}

/** Invisible — logs one qr_scan_events row per passport page view. Fire-and-forget, never blocks render. */
export default function QrScanLogger({ lotId }: { lotId: string }) {
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
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          device_type: detectDeviceType(navigator.userAgent),
        })
        .then(({ error }) => {
          if (error) console.error("qr_scan_event log failed:", error.message);
        });
    } catch (err) {
      // createClient() throws synchronously if env vars are missing/invalid —
      // catch that too, not just the insert's promise rejection.
      console.error("qr_scan_event log failed:", err);
    }
  }, [lotId]);

  return null;
}
