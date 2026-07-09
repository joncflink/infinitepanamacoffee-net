"use client";

import type { ReactNode } from "react";
import { logReorderEvent, type ReorderAction } from "@/lib/supabase/track";

export default function TrackedLink({
  lotId,
  passportNumber,
  action,
  href,
  className,
  children,
}: {
  lotId: string;
  passportNumber: string;
  action: ReorderAction;
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
        logReorderEvent({ lotId, passportNumber, action, destinationUrl: href })
      }
      className={className}
    >
      {children}
    </a>
  );
}
