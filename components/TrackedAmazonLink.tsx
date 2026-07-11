"use client";

import { getAmazonCta, type Coffee, type CoffeeSizeOption } from "@/data/coffees";
import { logReorderEvent } from "@/lib/supabase/track";

/**
 * The one place every Amazon CTA renders from — real listing or the
 * AMAZON_STOREFRONT_URL fallback, with the matching label, always
 * target="_blank" + rel="noopener noreferrer", always tracked. Never
 * hardcode an Amazon URL/label in a component; use this instead.
 */
export default function TrackedAmazonLink({
  coffee,
  size,
  lotId,
  className,
  onClick,
}: {
  /** Only passportNumber + sizeOptions are needed, so this also accepts CellarProvider's SavedCoffee. */
  coffee: Pick<Coffee, "passportNumber" | "sizeOptions">;
  /** Pass to check one specific size's listing; omit to check any size. */
  size?: CoffeeSizeOption;
  lotId: string;
  className: string;
  /** Fires alongside the built-in reorder_events tracking, e.g. for a caller that also logs a product_event. */
  onClick?: () => void;
}) {
  const cta = getAmazonCta(coffee, size);

  return (
    <a
      href={cta.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        logReorderEvent({
          lotId,
          passportNumber: coffee.passportNumber,
          action: cta.isExactListing ? "amazon_product" : "amazon_storefront_fallback",
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
