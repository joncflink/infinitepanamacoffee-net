export const WHATSAPP_NUMBER = "12072335784";
export const AMAZON_STORE_URL =
  "https://www.amazon.com/sp?ie=UTF8&seller=A3A3ULRCNZYQWC&isAmazonFulfilled=1&asin=0702052329&ref_=olp_merch_name_2";

/** Fixed brand-level facts, true for every coffee this brand will ever sell. Never per-record — do not add these to the Coffee type. */
export const BRAND = {
  name: "Infinite Panama Coffee™",
  collection: "Infinite Select™",
  productType: "Single-Origin Green Coffee Beans",
  origin: "Boquete, Chiriquí, Panama",
} as const;

export function whatsAppUrl(coffeeName: string, size?: string): string {
  const suffix = size ? ` (${size})` : "";
  const text = `Hi Jon, I am interested in Infinite Panama Coffee ${coffeeName}${suffix}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export type CoffeeStatus =
  | "available"
  | "reserve"
  | "reserve_collection"
  | "sold_out"
  | "archived"
  | "sample";

export const STATUS_LABELS: Record<CoffeeStatus, string> = {
  available: "Available",
  reserve: "Reserve Collection",
  reserve_collection: "Reserve Collection",
  sold_out: "Currently Resting",
  archived: "Archived",
  sample: "Development Sample",
};

export type CoffeeSizeOption = {
  size: string;
  netWeight: string;
  /** Assigned independently per size/listing — never derived from the passport or lot number. */
  sku: string;
  /** Left empty until a per-size Amazon listing exists; falls back to WhatsApp reorder. */
  amazonUrl: string;
};

/** Used as a `??` fallback for producer-style facts not yet confirmed — intentional, do not fill in specifics without a real source. */
export const PENDING_CONFIRMATION = "Pending Producer Confirmation";

export type Coffee = {
  /** Internal stable identifier. Never shown publicly, never used in a URL. */
  id: string;
  /**
   * Public, permanent passport identifier — the URL/QR/certificate key.
   * Once assigned it is never reassigned or reused. New coffees get the
   * next sequential number from getNextPassportNumber(), e.g. "IPC-000001".
   */
  passportNumber: string;
  /**
   * True only for passports assigned before the sequential-numbering
   * scheme existed (currently just Altura's "IPC-ALT-001"). Legacy
   * passport numbers are permanently grandfathered: never rewritten,
   * never redirected, and never used as a model for new numbers.
   */
  legacyPassport?: boolean;
  slug: string;
  /** The actual coffee's name, e.g. "Altura". Fully dynamic — never hardcode a coffee name in a template. */
  coffeeName: string;
  /**
   * Overrides BRAND.collection for this one record. Unset for every coffee
   * today — everything currently rolls up under "Infinite Select™". Exists
   * so a genuinely new collection (e.g. "Geisha Collection™") can be
   * introduced later as pure data, with zero template changes. Read via
   * getCollection(coffee), never coffee.collection directly.
   */
  collection?: string;
  /**
   * Overrides BRAND.productType for this one record — e.g. an Arabica lot
   * wants "Single-Origin Green Arabica Coffee Beans" without forcing every
   * other coffee (including legacy records) to change too. Read via
   * getProductType(coffee), never coffee.productType or BRAND.productType
   * directly.
   */
  productType?: string;
  /**
   * Producer/harvest-batch reference. Distinct from passportNumber: this
   * reflects internal lot/batch bookkeeping and, unlike the passport
   * number, is not a routing key and isn't guaranteed to be unique or permanent.
   * Unset for prelaunch placeholders that don't have a real lot yet.
   */
  lotNumber?: string;
  /** Unset fields are honestly omitted from the passport table rather than shown as a fabricated value — used for prelaunch placeholders with no confirmed lot yet. */
  process?: string;
  harvest?: string;
  variety?: string;
  elevation?: string;
  /** Only set once the producer/farm/exporter has approved being named publicly. */
  producer?: string;
  farm?: string;
  exporter?: string;
  packedOn?: string;
  bestBy?: string;
  /** Internal stock count — not rendered on the public passport page. */
  inventory?: number;
  status: CoffeeStatus;
  /** Purchasability gate, distinct from `status`. Undefined means available (true) — only set explicitly false for records (e.g. development samples) that must never appear purchasable anywhere. */
  available?: boolean;
  /** Selects which coffee the homepage hero/contact section spotlights. Exactly one coffee should be featured; falls back to the first entry if none is. */
  featured?: boolean;
  sizeOptions: CoffeeSizeOption[];
  story: string;
  storage: string;
  tastingNotes: string[];
  photos: string[];
  createdAt: string;
  metaDescription: string;
};

export const coffees: Coffee[] = [
  {
    id: "51edad89-a654-4178-94b2-757d4157cd79",
    passportNumber: "IPC-ALT-001",
    legacyPassport: true,
    slug: "altura",
    coffeeName: "Altura",
    lotNumber: "IPC-ALT-001",
    process: "Washed",
    harvest: "2025–2026",
    // variety/elevation deliberately unset, not fabricated — matches how
    // producer/farm/exporter already work on this record.
    status: "reserve",
    featured: false,
    sizeOptions: [
      { size: "8 oz", netWeight: "227 g", sku: "IPC-ALT-8OZ-001", amazonUrl: "" },
      { size: "1 lb", netWeight: "454 g", sku: "IPC-ALT-1LB-001", amazonUrl: "" },
      { size: "2 lb", netWeight: "907 g", sku: "IPC-ALT-2LB-001", amazonUrl: "" },
    ],
    story:
      "Altura is the first coffee in the Infinite Select™ collection — a washed-process lot grown in the highlands of Boquete, Chiriquí. It was chosen to open the collection because it represents what we value most: clean processing, honest origin, and the patient work of one of Panama's most respected growing regions. Producer and exporter details will be published here as they are confirmed.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-06",
    metaDescription:
      "Meet Infinite Select Altura, specialty green coffee beans from Boquete, Panama. Traceable, premium, and selected with care by Infinite Panama Coffee.",
  },
  {
    id: "a24aba96-909c-42a7-ba6f-49c4a550dcab",
    passportNumber: "IPC-000001",
    legacyPassport: false,
    slug: "boquete-shb-arabica-washed",
    // "Boquete SHB Arabica Washed" is a working/sample name for this
    // record, not yet Casa Ruiz's confirmed commercial product name.
    // Process and harvest season are real supplier facts and safe to
    // print; lotNumber/packedOn/bestBy are deliberately left unset —
    // never fabricate a lot number or pack/best-by date.
    coffeeName: "Boquete SHB Arabica Washed",
    productType: "Single-Origin Green Arabica Coffee Beans",
    process: "Washed",
    harvest: "2025–2026",
    exporter: "Casa Ruiz S.A.",
    status: "reserve_collection",
    featured: true,
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "Boquete SHB Arabica Washed is a sample record for the next release in the Infinite Select™ collection — a washed-process lot from Boquete, Chiriquí, exported by Casa Ruiz S.A. The commercial product name, final lot, and pack/best-by dates have not yet been confirmed by Casa Ruiz.",
    storage:
      "Store in a cool, dry place away from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Boquete SHB Arabica Washed, a sample record for the next release in the Infinite Select™ collection from Boquete, Panama. Final naming and lot details are pending Casa Ruiz confirmation.",
  },
];

/**
 * Development/sample fixtures used only to test the label system
 * (components/labels/, app/labels/). These are real Casa Ruiz lot names
 * pulled from actual supplier price lists, but the records themselves are
 * NOT commitments that any of these coffees will be available for sale —
 * status "sample" and available: false mark that explicitly. Deliberately
 * kept out of the `coffees` array: they must never be reachable via the
 * public /passport/[passportNumber] route, the /coffee/[slug] redirect,
 * the homepage featured-coffee lookup, or any other public-facing helper
 * that iterates `coffees`. Their passportNumbers use a "SAMPLE-" prefix
 * (not "IPC-") so they can never be confused with a real, permanent
 * passport number and never collide with the real sequential scheme.
 */
export const sampleCoffees: Coffee[] = [
  {
    id: "43cc1927-a8a5-4b12-acfd-ae8d29793eb3",
    passportNumber: "SAMPLE-001",
    slug: "boquete-shb-arabica-washed-altura",
    coffeeName: "Boquete SHB Arabica Washed Altura",
    process: "Washed",
    status: "sample",
    available: false,
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "This is a development sample record for Boquete SHB Arabica Washed Altura, used to test the Infinite Coffee Passport™ label system. It is not a confirmed product and is not available for sale.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Development sample record for Boquete SHB Arabica Washed Altura, used to test the Infinite Panama Coffee label system. Not a confirmed product.",
  },
  {
    id: "5e0d1fef-1988-4b65-bc16-521e4a510763",
    passportNumber: "SAMPLE-002",
    slug: "la-jungla-washed",
    coffeeName: "La Jungla Washed",
    process: "Washed",
    status: "sample",
    available: false,
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "This is a development sample record for La Jungla Washed, used to test the Infinite Coffee Passport™ label system. It is not a confirmed product and is not available for sale.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Development sample record for La Jungla Washed, used to test the Infinite Panama Coffee label system. Not a confirmed product.",
  },
  {
    id: "24bdc281-1a84-4479-a1a8-892e9e51a870",
    passportNumber: "SAMPLE-003",
    slug: "panama-shb-washed-premium",
    coffeeName: "Panama SHB Washed Premium",
    process: "Washed",
    status: "sample",
    available: false,
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "This is a development sample record for Panama SHB Washed Premium, used to test the Infinite Coffee Passport™ label system. It is not a confirmed product and is not available for sale.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Development sample record for Panama SHB Washed Premium, used to test the Infinite Panama Coffee label system. Not a confirmed product.",
  },
  {
    id: "8e7bcfc0-d96a-44cf-b69d-1928c53610d2",
    passportNumber: "SAMPLE-004",
    slug: "vanguardia-natural-geisha",
    coffeeName: "Vanguardia Natural Geisha",
    process: "Natural",
    status: "sample",
    available: false,
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "This is a development sample record for Vanguardia Natural Geisha, used to test the Infinite Coffee Passport™ label system. It is not a confirmed product and is not available for sale.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Development sample record for Vanguardia Natural Geisha, used to test the Infinite Panama Coffee label system. Not a confirmed product.",
  },
];

/** The collection this coffee belongs to — coffee.collection if set, else the brand-wide default. */
export function getCollection(coffee: Coffee): string {
  return coffee.collection ?? BRAND.collection;
}

/** This coffee's product-type statement — coffee.productType if set, else the brand-wide default. */
export function getProductType(coffee: Coffee): string {
  return coffee.productType ?? BRAND.productType;
}

export function getFullName(coffee: Coffee): string {
  return `${getCollection(coffee)} ${coffee.coffeeName}`;
}

/** The coffee the homepage hero/contact section spotlights. */
export function getFeaturedCoffee(): Coffee {
  return coffees.find((c) => c.featured) ?? coffees[0];
}

export function getCoffee(slug: string): Coffee | undefined {
  return coffees.find((c) => c.slug === slug);
}

export function getAllCoffeeSlugs(): string[] {
  return coffees.map((c) => c.slug);
}

export function getCoffeeByPassportNumber(passportNumber: string): Coffee | undefined {
  if (!passportNumber) return undefined;
  const normalized = passportNumber.trim().toUpperCase();
  if (!normalized) return undefined;
  return coffees.find((c) => c.passportNumber === normalized);
}

export function getAllPassportNumbers(): string[] {
  return coffees.map((c) => c.passportNumber);
}

/**
 * Next sequential public passport number for a new coffee, e.g. "IPC-000001".
 * Legacy passports (like "IPC-ALT-001") never participate in the sequence.
 */
export function getNextPassportNumber(): string {
  const sequential = coffees
    .filter((c) => !c.legacyPassport)
    .map((c) => parseInt(c.passportNumber.replace(/^IPC-/, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = sequential.length ? Math.max(...sequential) + 1 : 1;
  return `IPC-${String(next).padStart(6, "0")}`;
}

/** QR file paths for a coffee, derived from its permanent passport number. */
export function getQrPaths(coffee: Coffee) {
  return {
    plainSvg: `/qr/${coffee.passportNumber}.svg`,
    plainPng: `/qr/${coffee.passportNumber}-1024.png`,
    brandedSvg: `/qr/${coffee.passportNumber}-branded.svg`,
    brandedPng: `/qr/${coffee.passportNumber}-branded-1024.png`,
  };
}

/**
 * The size option matching `size` (default "8 oz"), case-insensitive.
 * Falls back to the first size option when there's no exact match — e.g.
 * a prelaunch placeholder coffee with a single "To be announced" entry.
 */
export function getSizeOption(coffee: Coffee, size = "8 oz"): CoffeeSizeOption {
  const normalized = size.trim().toLowerCase();
  return (
    coffee.sizeOptions.find((option) => option.size.trim().toLowerCase() === normalized) ??
    coffee.sizeOptions[0]
  );
}

/**
 * Every coffee the /labels preview system can show: the real public
 * catalog plus development samples. Never used by public-facing routes —
 * only app/labels/** should call these.
 */
export function getAllLabelCoffees(): Coffee[] {
  return [...coffees, ...sampleCoffees];
}

export function getLabelCoffeeByPassportNumber(passportNumber: string): Coffee | undefined {
  const normalized = passportNumber.toUpperCase();
  return getAllLabelCoffees().find((c) => c.passportNumber === normalized);
}

export function getAllLabelPassportNumbers(): string[] {
  return getAllLabelCoffees().map((c) => c.passportNumber);
}

/** Collectible display format for a passport number, e.g. "IPC-ALT-001" -> "IPC • ALT • 001", "IPC-000001" -> "IPC • 000001". */
export function formatPassportDisplay(coffee: Pick<Coffee, "passportNumber">): string {
  return coffee.passportNumber.split("-").join(" • ");
}

/** Compact serial-number format for the certificate, e.g. "IPC-ALT-001" -> "IPC•ALT•001". */
export function formatPassportDisplayCompact(coffee: Coffee): string {
  return coffee.passportNumber.split("-").join("•");
}
