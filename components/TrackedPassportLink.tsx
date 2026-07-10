"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { logProductEvent, type ProductEvent } from "@/lib/supabase/track";

/**
 * Same idea as TrackedLink, but for internal navigation (next/link, not a
 * bare <a>) firing a product_events row instead of a reorder_events one.
 */
export default function TrackedPassportLink({
  href,
  event,
  passportNumber,
  source,
  className,
  children,
}: {
  href: string;
  event: ProductEvent;
  passportNumber?: string;
  source?: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => logProductEvent({ event, passportNumber, source })}
      className={className}
    >
      {children}
    </Link>
  );
}
