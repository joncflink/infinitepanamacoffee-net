"use client";

import type { ReactNode } from "react";
import { logReorderEvent } from "@/lib/supabase/track";

export default function TrackedAmazonLink({
  lotId,
  href,
  className,
  children,
}: {
  lotId: string;
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        logReorderEvent({ lotId, action: "amazon_clicked", destinationUrl: href })
      }
      className={className}
    >
      {children}
    </a>
  );
}
