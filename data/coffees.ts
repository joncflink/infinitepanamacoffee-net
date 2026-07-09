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
  | "archived";

export const STATUS_LABELS: Record<CoffeeStatus, string> = {
  available: "Available",
  reserve: "Reserve Collection",
  reserve_collection: "Reserve Collection",
  sold_out: "Currently Resting",
  archived: "Archived",
};

export type CoffeeSizeOption = {
  size: string;
  netWeight: string;
  /** Assigned independently per size/listing — never derived from the passport or lot number. */
  sku: string;
  /** Left empty until a per-size Amazon listing exists; falls back to WhatsApp reorder. */
  amazonUrl: string;
};

/** "Pending Producer Confirmation" placeholders are intentional — do not fill in specifics without a real source. */
export const PENDING_CONFIRMATION = "Pending Producer Confirmation";
const TBC = PENDING_CONFIRMATION;

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
  /** Selects which coffee the homepage hero/contact section spotlights. Exactly one coffee should be featured; falls back to the first entry if none is. */
  featured?: boolean;
  sizeOptions: CoffeeSizeOption[];
  story: string;
  storage: string;
  tastingNotes: string[];
  photos: string[];
  createdAt: string;
  metaTitle: string;
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
    variety: TBC,
    elevation: TBC,
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
    metaTitle: "Infinite Select Altura",
    metaDescription:
      "Meet Infinite Select Altura, specialty green coffee beans from Boquete, Panama. Traceable, premium, and selected with care by Infinite Panama Coffee.",
  },
  {
    id: "a24aba96-909c-42a7-ba6f-49c4a550dcab",
    passportNumber: "IPC-000001",
    legacyPassport: false,
    slug: "boquete-reserve",
    coffeeName: "Boquete Reserve",
    // Prelaunch placeholder: lotNumber/process/harvest/variety/elevation are
    // deliberately left unset rather than fabricated. None of this is
    // confirmed until Casa Ruiz's actual lot is selected.
    status: "reserve_collection",
    featured: true,
    sizeOptions: [
      { size: "To be announced", netWeight: "TBD", sku: "", amazonUrl: "" },
    ],
    story:
      "Boquete Reserve is the next release in the Infinite Select™ collection. The final Casa Ruiz lot has not yet been selected — origin details, process, and harvest information will be published here once confirmed.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaTitle: "Infinite Select Boquete Reserve",
    metaDescription:
      "Boquete Reserve, the next release in the Infinite Select™ collection from Boquete, Panama. The final lot is being selected — details coming soon from Infinite Panama Coffee.",
  },
];

export function getFullName(coffee: Coffee): string {
  return `${BRAND.collection} ${coffee.coffeeName}`;
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
  const normalized = passportNumber.toUpperCase();
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

/** Collectible display format for a passport number, e.g. "IPC-ALT-001" -> "IPC • ALT • 001", "IPC-000001" -> "IPC • 000001". */
export function formatPassportDisplay(coffee: Coffee): string {
  return coffee.passportNumber.split("-").join(" • ");
}

/** Compact serial-number format for the certificate, e.g. "IPC-ALT-001" -> "IPC•ALT•001". */
export function formatPassportDisplayCompact(coffee: Coffee): string {
  return coffee.passportNumber.split("-").join("•");
}
