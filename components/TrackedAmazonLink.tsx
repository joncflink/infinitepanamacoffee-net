"use client";

import { getAmazonCta, type Coffee, type CoffeeSizeOption } from "@/data/coffees";
import { logReorderEvent } from "@/lib/supabase/track";

/**
 * The one place every Amazon CTA renders from — real listing, the
 * AMAZON_STOREFRONT_URL fallback, or (while Amazon approval is pending) a
 * WhatsApp launch-list link, with the matching label, always
 * target="_blank" + rel="noopener noreferrer", always tracked. Never
 * hardcode an Amazon URL/label in a component; use this instead.
 */
export default function TrackedAmazonLink({
  coffee,
  size,
  context = "buy",
  lotId,
  className,
  onClick,
}: {
  /** Only the fields getAmazonCta needs, so this also accepts CellarProvider's SavedCoffee. */
  coffee: Pick<
    Coffee,
    "passportNumber" | "sizeOptions" | "coffeeName" | "amazonApprovalRequired" | "amazonApprovalStatus"
  >;
  /** Pass to check one specific size's listing; omit to check any size. */
  size?: CoffeeSizeOption;
  /** "reorder" shows "Reorder on Amazon" instead of "Buy on Amazon" once a real listing exists — e.g. My Infinite Cellar™. */
  context?: "buy" | "reorder";
  lotId: string;
  className: string;
  /** Fires alongside the built-in reorder_events tracking, e.g. for a caller that also logs a product_event. */
  onClick?: () => void;
}) {
  const cta = getAmazonCta(coffee, size, context);

  return (
    <a
      href={cta.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        logReorderEvent({
          lotId,
          passportNumber: coffee.passportNumber,
          action: cta.isApprovalGated
            ? "amazon_launch_list_clicked"
            : cta.isExactListing
              ? "amazon_product"
              : "amazon_storefront_fallback",
          destinationUrl: cta.href,
        });
        onClick?.();
      }}
      className={className}
    >
      {cta.label}
    </a>
  );
}
