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

/** Fallback for a lot-specific fact (process/harvest/variety/elevation/etc.) that hasn't been selected yet — distinct from PENDING_CONFIRMATION, which is about a producer/exporter/farm not yet being named. */
export const PENDING_LOT_SELECTION = "Pending Final Lot Selection";

export const QR_PENDING_MESSAGE = "QR Pending Final Lot Selection";

export const UNROASTED_ROAST_BEFORE = "UNROASTED • ROAST BEFORE BREWING";

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
  name: "Infinite Wealth Management",
  addressLine1: "690 Main Street #816",
  addressLine2: "Safety Harbor, FL 34695 USA",
};

export const WEBSITE_DISPLAY = "www.infinitepanamacoffee.com";
export const WEBSITE_URL = "https://www.infinitepanamacoffee.com";
