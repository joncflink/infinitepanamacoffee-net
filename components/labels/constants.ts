/**
 * Print-specific palette for the label system. Deliberately distinct from
 * the site's --forest-green/--gold/--dark-gray/--cream CSS variables (web
 * and print reproduce color differently) — scoped only to components under
 * components/labels/ and app/labels/, never applied to the live site.
 */
export const LABEL_COLORS = {
  forest: "#255D2A",
  gold: "#D4B15A",
  charcoal: "#666666",
  ivory: "#F7F3EA",
} as const;

/**
 * Unmistakable "this field has no real data yet" placeholder — deliberately
 * looks like raw template syntax, not prose, so nobody can mistake it for
 * real copy and send it to print by accident. This is the ONLY fallback
 * style used anywhere in the label system (front, back, print) — no soft
 * "Pending ..." phrasing, which reads enough like plausible real copy
 * that an incomplete record could slip through unnoticed.
 */
export function fieldPlaceholder(fieldName: string): string {
  return `{{${fieldName}}}`;
}

export const OUR_PROMISE =
  "Every lot is sourced directly from Panama, packed at origin, and permanently linked to its Infinite Coffee Passport™ for complete provenance and traceability.";

export const TAGLINE_LINES = ["Selected with patience.", "Built for generations."];

export const UNROASTED_NOTICE_HEADING = "UNROASTED GREEN COFFEE BEANS";
export const UNROASTED_NOTICE_BODY =
  "These beans are intended for roasting before brewing. Not ready to drink.";

export const PRODUCT_OF_PANAMA = "Product of Panama";

export const PACKED_EXPORTED_BY = {
  name: "Casa Ruiz S.A.",
  address: "Boquete, Chiriquí, Panama 04053",
};

export const IMPORTED_DISTRIBUTED_BY = {
  name: "Infinite Wealth Management LLC",
  addressLine1: "690 Main Street #816",
  addressLine2: "Safety Harbor, FL 34695 USA",
};

export const WEBSITE_DISPLAY = "www.infinitepanamacoffee.com";
export const WEBSITE_URL = "https://www.infinitepanamacoffee.com";

/**
 * Which identifier the Amazon-bound back label shows as its primary
 * customer-facing reference. Locked interpretation: neither mode ever
 * shows a QR code, QR placeholder, external URL, or scan instruction —
 * that's settled. What's still pending Amazon's written response (Case
 * #21076327341 — see the vault's PROJECT_STATE.md Label Contingency Plans)
 * is only whether the static Passport Number itself may appear on the bag.
 * "passport": show "Infinite Coffee Passport™ / Passport No. [number]"
 * as a static, non-clickable identifier (Assumption A).
 * "lot": show only "Lot Number [number]" — the Infinite Coffee Passport™
 * still exists internally, the Amazon customer never sees it (Assumption
 * B, most conservative).
 * Default is "lot" — the Passport Number appears only when this is
 * explicitly set to "passport" (e.g. for a design-review pass), never by
 * default. Case 21076327341 is still open with no written approval, so
 * nothing that could reach print should default to showing it.
 */
export type AmazonLabelIdMode = "passport" | "lot";
export const AMAZON_LABEL_ID_MODE: AmazonLabelIdMode =
  process.env.AMAZON_LABEL_ID_MODE === "passport" ? "passport" : "lot";

/**
 * Separate from the Passport Number question above: a physical QR insert
 * (a card/slip inside the bag, not printed on the bag itself) has been
 * discussed but not built — no component or asset for it exists in this
 * codebase. It remains pending Amazon's written clarification under Case
 * 21076327341, same case as above. Do not build or print it as an
 * approved asset until that confirmation is in hand.
 */
