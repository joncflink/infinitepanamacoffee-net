export const WHATSAPP_NUMBER = "12072335784";
/**
 * Canonical Amazon storefront fallback — used whenever a coffee (or size)
 * has no confirmed Amazon listing of its own. This is a seller-search page,
 * not yet a branded Amazon Store page — Infinite Panama Coffee doesn't have
 * Brand Registry yet. Once it does, replace this one constant with the real
 * Amazon Store URL and every CTA that reads it (via getAmazonCta, never a
 * hardcoded copy) updates automatically. Never reference this directly from
 * a component — go through getAmazonCta so the fallback/exact-listing
 * decision and CTA label stay in one place.
 */
export const AMAZON_STOREFRONT_URL =
  "https://www.amazon.com/s?me=A3A3ULRCNZYQWC&marketplaceID=ATVPDKIKX0DER";

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
  | "sample"
  | "inventory_candidate";

export const STATUS_LABELS: Record<CoffeeStatus, string> = {
  available: "Available",
  reserve: "Reserve Collection",
  reserve_collection: "Reserve Collection",
  sold_out: "Currently Resting",
  archived: "Archived",
  sample: "Development Sample",
  inventory_candidate: "Inventory Candidate",
};

/**
 * Shared status vocabulary for `availabilityStatus` (what the supplier is
 * quoting/offering) and `inventoryStatus` (what Infinite Panama Coffee
 * physically has). Keep the two separate in data even though they share a
 * type — e.g. a lot can be `availabilityStatus: "available"` from the
 * supplier while `inventoryStatus: "planned"` (nothing purchased yet).
 * Distinct from `CoffeeStatus`, which is the public-facing display status
 * shown on the website — these two fields are never rendered publicly.
 */
export type InventoryStatusValue =
  | "available"
  | "unavailable"
  | "pending_confirmation"
  | "planned"
  | "ordered"
  | "inbound"
  | "received"
  | "sellable"
  | "sold_out"
  | "archived"
  | "legacy";

export type CoffeeSizeOption = {
  size: string;
  netWeight: string;
  /** Assigned independently per size/listing — never derived from the passport or lot number. */
  sku: string;
  /** Left empty until a per-size Amazon listing exists; falls back to WhatsApp reorder. */
  amazonUrl: string;
};

/**
 * The coarse, physical-goods journey a coffee moves through — from catalog
 * entry through to sale or archive. Distinct from `AmazonApprovalStatus`
 * below: this field is never a substitute for tracking approval detail, and
 * approval detail is never collapsed into this field. Some stages here
 * mark an Amazon-approval checkpoint being reached (e.g.
 * "amazon_approval_pending"), but the actual approval state, dates, case
 * ID, and denial reason live only on the dedicated `amazonApproval*`
 * fields on `Coffee`.
 */
export type ProductLifecycleStatus =
  | "catalog"
  | "pre_production"
  | "approval_lot_planned"
  | "approval_lot_ordered"
  | "invoice_received"
  | "amazon_application_ready"
  | "amazon_application_submitted"
  | "amazon_approval_pending"
  | "amazon_approved"
  | "amazon_denied"
  | "production_released"
  | "ordered"
  | "inbound"
  | "prep_center_received"
  | "fba_ready"
  | "fba_inbound"
  | "sellable"
  | "sold_out"
  | "alternate_channel"
  | "archived";

/**
 * Amazon Grocery & Gourmet Foods category-approval state — the fine-grained
 * companion to `ProductLifecycleStatus`. `not_started` and
 * `more_information_requested` are both "not yet approved" for every gate
 * check in this file; the distinction exists purely so the dashboard can
 * show you which one you're looking at.
 */
export type AmazonApprovalStatus =
  | "not_started"
  | "invoice_needed"
  | "application_ready"
  | "submitted"
  | "pending"
  | "approved"
  | "denied"
  | "more_information_requested";

/**
 * What happened to the small approval-lot's physical units once the
 * application invoice need is satisfied — never assume "held_for_full_launch"
 * by default; an unset disposition means genuinely undecided.
 */
export type ApprovalLotDisposition =
  | "held_for_full_launch"
  | "sold_direct"
  | "sold_wholesale"
  | "local_sale"
  | "used_for_photography"
  | "used_for_quality_testing"
  | "repacked"
  | "credited_to_full_order"
  | "other";

/**
 * Tracks the smallest legitimate commercial purchase made solely to
 * produce Amazon's required qualifying invoice — deliberately separate
 * from the full production order. `proposedQuantity` must never be
 * hardcoded; it only ever reflects a quantity Jon has actually supplied.
 */
export type ApprovalLotWorkflow = {
  proposedQuantity?: number;
  unitFormat?: string;
  supplierConfirmed?: boolean;
  invoiceRequirementsNotes?: string;
  paymentStatus?: "not_paid" | "paid" | "partial";
  invoiceReceived?: boolean;
  applicationSubmitted?: boolean;
  approvalOutcome?: "pending" | "approved" | "denied";
  disposition?: ApprovalLotDisposition;
  dispositionNotes?: string;
};

export type AlternateChannelName =
  | "infinitepanamacoffee_com"
  | "local_panama_sales"
  | "us_direct_sales"
  | "wholesale"
  | "cafes"
  | "home_roaster_communities"
  | "specialty_retailers"
  | "events"
  | "corporate_gifts";

/** No channel activates itself — moving past "not_planned" is always a deliberate, separate action. */
export type AlternateChannelStatus = "not_planned" | "planned" | "in_progress" | "ready" | "active";

export type AlternateChannelPlan = {
  channel: AlternateChannelName;
  status: AlternateChannelStatus;
  /** What's actually needed before this channel could go "ready" — never assumed, only what's been identified. */
  readinessChecklist: string[];
  notes?: string;
};

/**
 * Risk-model inputs, one set per coffee. Every field is optional and
 * unitless-by-omission on purpose — calculateFinancialRisk() below only
 * computes an output when every input it depends on is actually present,
 * so a missing cost never turns into a silently wrong number.
 */
export type FinancialRiskInputs = {
  approvalLotCost?: number;
  packagingCost?: number;
  labelCost?: number;
  exportImportCost?: number;
  prepCenterCost?: number;
  totalFullProductionCost?: number;
  directSaleRecoveryPct?: number;
  wholesaleRecoveryPct?: number;
  liquidationRecoveryPct?: number;
};

export type FinancialRiskOutputs = {
  cashAtRiskBeforeApproval?: number;
  maxLossIfDenied?: number;
  recoverableValueByChannel?: {
    directSale?: number;
    wholesale?: number;
    liquidation?: number;
  };
  /** Requires a per-unit price/cost, which isn't one of the given inputs — always undefined until that input exists. Never fabricated. */
  breakEvenUnitsApprovalLot?: number;
  fullOrderExposurePrevented?: number;
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
  /** Purchasability gate, distinct from `status`. Undefined means sellable (true) — only set explicitly false for records (e.g. inventory candidates not yet purchased/received) that must never appear purchasable anywhere. */
  sellable?: boolean;
  /** Selects which coffee the homepage hero/contact section spotlights. Exactly one coffee should be featured; falls back to the first entry if none is. */
  featured?: boolean;
  /**
   * Sourcing/inventory-tracking fields. Never rendered on any public page —
   * internal only (see app/inventory). All optional: a candidate record may
   * only have a subset confirmed at any given time, and an unset field is
   * shown as genuinely absent (never "Pending"/"N/A"/a fabricated value) on
   * the internal views, same honesty rule as the public passport fields.
   */
  supplier?: string;
  requestedQuantityLb?: number;
  purchasedQuantityLb?: number;
  receivedQuantityLb?: number;
  availableQuantityLb?: number;
  reservedQuantityLb?: number;
  soldQuantityLb?: number;
  quotedPricePerLb?: number;
  actualCostPerLb?: number;
  /** What the supplier is quoting/offering — keep separate from inventoryStatus (what we physically have). */
  availabilityStatus?: InventoryStatusValue;
  /** What Infinite Panama Coffee physically has — keep separate from availabilityStatus (what the supplier is offering). */
  inventoryStatus?: InventoryStatusValue;
  /** Free-text internal note — e.g. why a lot is unavailable, or what it substitutes for. Never shown publicly. */
  notes?: string;
  /**
   * Amazon category-approval gate (Grocery & Gourmet Foods). All optional —
   * left the shared Coffee type instead of `required: boolean` as the
   * original brief specified, since most coffees (e.g. Altura, the
   * PENDING- candidates) have no Amazon exposure at all yet and forcing
   * these fields onto every record would be boilerplate, not honesty.
   * `undefined` reads as "not applicable / not yet known" everywhere these
   * are checked, same honest-omission rule as the rest of this type. Only
   * ever read/write these through canReleaseFullProduction(), getAmazonCta(),
   * and the internal dashboard — never re-derive the gate logic elsewhere.
   */
  asin?: string;
  amazonSku?: string;
  amazonCategory?: string;
  amazonListingStatus?: "inactive" | "active";
  amazonApprovalRequired?: boolean;
  amazonApprovalStatus?: AmazonApprovalStatus;
  amazonApplicationSubmittedAt?: string;
  amazonApprovalReceivedAt?: string;
  amazonApplicationCaseId?: string;
  amazonDenialReason?: string;
  approvalInvoiceReference?: string;
  approvalInvoiceDate?: string;
  approvalInvoiceUnitCount?: number;
  lifecycleStatus?: ProductLifecycleStatus;
  approvalLot?: ApprovalLotWorkflow;
  alternateChannels?: AlternateChannelPlan[];
  financialRisk?: FinancialRiskInputs;
  /**
   * Full production-release gate inputs — see canReleaseFullProduction().
   * Each is a distinct human sign-off; none is inferred from any other
   * field on this record.
   */
  realCoffeeAvailabilityConfirmed?: boolean;
  coffeeNameConfirmed?: boolean;
  lotInfoConfirmedWhereRequired?: boolean;
  packagingSpecApproved?: boolean;
  labelModeApproved?: boolean;
  buyerImporterDataConfirmed?: boolean;
  exporterDataConfirmed?: boolean;
  fundingApproved?: boolean;
  /** Jon's explicit sign-off to proceed on a non-Amazon channel instead of waiting for Amazon approval — never inferred, only ever set true by a direct instruction. */
  alternateChannelProductionStrategyApproved?: boolean;
  fullProductionReleaseApproved?: boolean;
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
    // Confirmed Amazon facts: ASIN B0H8PXF3D2 / SKU IPC-BOQ-SHB-WASHED-8OZ
    // exist; the listing is Inactive pending Grocery & Gourmet Foods
    // category approval, which requires a qualifying purchase invoice
    // (>=10 units, dated within 180 days) as evidence — not a guarantee.
    // Every gate field below is left at its honest current state (mostly
    // unconfirmed/false) rather than assumed — see canReleaseFullProduction().
    asin: "B0H8PXF3D2",
    amazonSku: "IPC-BOQ-SHB-WASHED-8OZ",
    amazonCategory: "Grocery & Gourmet Foods",
    amazonListingStatus: "inactive",
    amazonApprovalRequired: true,
    amazonApprovalStatus: "invoice_needed",
    lifecycleStatus: "approval_lot_planned",
    approvalLot: {
      // proposedQuantity intentionally unset — never hardcode a quantity
      // Jon hasn't supplied. Amazon's stated minimum is a combined 10 units.
      supplierConfirmed: false,
      invoiceRequirementsNotes:
        "Amazon requires: invoice dated within the stated 180-day window; " +
        "buyer name/address matching the Amazon selling account; " +
        "manufacturer/distributor name and address; combined purchase of " +
        "at least 10 units; supplier may be contacted for verification; " +
        "pricing may be omitted from the uploaded copy; a normal supplier " +
        "invoice is preferred over an Amazon order confirmation.",
      paymentStatus: "not_paid",
      invoiceReceived: false,
      applicationSubmitted: false,
      approvalOutcome: "pending",
    },
    alternateChannels: [
      { channel: "infinitepanamacoffee_com", status: "not_planned", readinessChecklist: [] },
      { channel: "local_panama_sales", status: "not_planned", readinessChecklist: [] },
      { channel: "us_direct_sales", status: "not_planned", readinessChecklist: [] },
      { channel: "wholesale", status: "not_planned", readinessChecklist: [] },
      { channel: "cafes", status: "not_planned", readinessChecklist: [] },
      { channel: "home_roaster_communities", status: "not_planned", readinessChecklist: [] },
      { channel: "specialty_retailers", status: "not_planned", readinessChecklist: [] },
      { channel: "events", status: "not_planned", readinessChecklist: [] },
      { channel: "corporate_gifts", status: "not_planned", readinessChecklist: [] },
    ],
    // No cost/recovery figures supplied yet — left empty rather than
    // populated with placeholder numbers. See calculateFinancialRisk().
    financialRisk: {},
    realCoffeeAvailabilityConfirmed: false,
    coffeeNameConfirmed: false,
    lotInfoConfirmedWhereRequired: false,
    packagingSpecApproved: false,
    labelModeApproved: false,
    buyerImporterDataConfirmed: false,
    exporterDataConfirmed: false,
    fundingApproved: false,
    alternateChannelProductionStrategyApproved: false,
    fullProductionReleaseApproved: false,
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "IPC-BOQ-SHB-WASHED-8OZ", amazonUrl: "" }],
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
 * Real Casa Ruiz coffees under evaluation for inventory — not yet
 * purchased, not yet received, not confirmed sellable. `sellable: false`
 * on every record here enforces that regardless of any other field.
 * Deliberately kept out of the `coffees` array: they must never be
 * reachable via the public /passport/[passportNumber] route, the
 * /coffee/[slug] redirect, the homepage featured-coffee lookup, or any
 * other public-facing helper that iterates `coffees`. No final production
 * Passport Number is assigned until a lot is actually purchased and
 * received — their passportNumbers use a "PENDING-" prefix (not "IPC-")
 * so they can never be confused with a real, permanent passport number,
 * can never collide with the real sequential scheme, and can never
 * accidentally satisfy the label system's "confirmed Passport Number"
 * requirement for production label proofs (see components/labels).
 */
export const inventoryCandidates: Coffee[] = [
  {
    id: "43cc1927-a8a5-4b12-acfd-ae8d29793eb3",
    passportNumber: "PENDING-001",
    slug: "boquete-shb-arabica-washed-altura",
    coffeeName: "Boquete SHB Arabica Washed Altura",
    process: "Washed",
    supplier: "Casa Ruiz S.A.",
    quotedPricePerLb: 6.0,
    availabilityStatus: "available",
    requestedQuantityLb: 100,
    inventoryStatus: "planned",
    sellable: false,
    status: "inventory_candidate",
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "Boquete SHB Arabica Washed Altura is under evaluation for the Infinite Select™ collection — a washed-process lot quoted by Casa Ruiz S.A. at $6.00/lb, with 100 lb requested. Available from the supplier; not yet purchased or received.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Boquete SHB Arabica Washed Altura, a candidate lot from Casa Ruiz S.A. under evaluation for the Infinite Select™ collection. Not yet purchased.",
  },
  {
    id: "5e0d1fef-1988-4b65-bc16-521e4a510763",
    passportNumber: "PENDING-002",
    slug: "la-jungla-washed",
    coffeeName: "La Jungla Washed",
    process: "Washed",
    supplier: "Casa Ruiz S.A.",
    availabilityStatus: "unavailable",
    requestedQuantityLb: 40,
    inventoryStatus: "unavailable",
    sellable: false,
    status: "inventory_candidate",
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "La Jungla Washed was evaluated for the Infinite Select™ collection at a requested 40 lb, but is currently unavailable from Casa Ruiz S.A.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "La Jungla Washed, a candidate lot from Casa Ruiz S.A. currently unavailable. Requested for the Infinite Select™ collection, not purchased.",
    notes: "Currently unavailable from Casa Ruiz S.A. No substitute has been offered for this lot.",
  },
  {
    id: "24bdc281-1a84-4479-a1a8-892e9e51a870",
    passportNumber: "PENDING-003",
    slug: "panama-shb-washed-premium",
    coffeeName: "Panama SHB Washed Premium",
    process: "Washed",
    supplier: "Casa Ruiz S.A.",
    availabilityStatus: "unavailable",
    requestedQuantityLb: 20,
    inventoryStatus: "unavailable",
    sellable: false,
    status: "inventory_candidate",
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "Panama SHB Washed Premium was evaluated for the Infinite Select™ collection at a requested 20 lb, but is currently unavailable from Casa Ruiz S.A.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Panama SHB Washed Premium, a candidate lot from Casa Ruiz S.A. currently unavailable. Requested for the Infinite Select™ collection, not purchased.",
    notes: "Currently unavailable from Casa Ruiz S.A. No substitute has been offered for this lot.",
  },
  {
    id: "8e7bcfc0-d96a-44cf-b69d-1928c53610d2",
    passportNumber: "PENDING-004",
    slug: "vanguardia-natural-geisha",
    coffeeName: "Vanguardia Natural Geisha",
    process: "Natural",
    supplier: "Casa Ruiz S.A.",
    availabilityStatus: "available",
    requestedQuantityLb: 40,
    inventoryStatus: "planned",
    sellable: false,
    status: "inventory_candidate",
    sizeOptions: [{ size: "8 oz", netWeight: "227 g", sku: "", amazonUrl: "" }],
    story:
      "Vanguardia Natural Geisha is under evaluation for the Infinite Select™ collection — a natural-process Geisha lot offered by Casa Ruiz S.A. as the substitute for the unavailable Bromelias Geisha Natural, at the same price and with a mostly similar cup profile. Available from the supplier; not yet purchased or received.",
    storage:
      "Store green coffee in a cool, dry place. Protect from heat, moisture, direct sunlight, and strong odors.",
    tastingNotes: [],
    photos: [],
    createdAt: "2026-07-09",
    metaDescription:
      "Vanguardia Natural Geisha, a candidate lot from Casa Ruiz S.A. under evaluation for the Infinite Select™ collection. Not yet purchased.",
    notes:
      "Offered by Casa Ruiz S.A. as the substitute for unavailable Bromelias Geisha Natural, at the same price and with a mostly similar cup profile. No specific per-lb price was given for this substitute — do not invent one.",
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

export type AmazonCta = {
  href: string;
  label: string;
  /** True when `href` is a real listing for this coffee, false when it's the AMAZON_STOREFRONT_URL fallback or the pre-approval launch-list link. */
  isExactListing: boolean;
  /** True when this coffee is Amazon-approval-gated and not yet approved — href/label never claim purchasability in this state. */
  isApprovalGated: boolean;
};

/**
 * The single source of truth for "which Amazon URL, which label" — every
 * Amazon CTA in the app should go through this rather than re-deriving it.
 * Pass `size` when the CTA is for one specific size option; omit it to ask
 * "does this coffee have an Amazon listing at all" (any size). Pass
 * `context: "reorder"` for a saved/previously-purchased coffee (e.g. My
 * Infinite Cellar™) to get "Reorder on Amazon" instead of "Buy on Amazon"
 * once a real listing exists — the gated and fallback states are unaffected
 * by context, since there's nothing to "reorder" before an offer exists.
 *
 * Approval gate: while `amazonApprovalRequired` is true and
 * `amazonApprovalStatus` isn't yet "approved", this coffee must never show
 * an Amazon purchase link at all (an inactive listing is not purchasable,
 * and implying otherwise misrepresents availability) — it links to a
 * WhatsApp launch-list signup instead. Takes only the fields it actually
 * needs (not the full Coffee) so it also works with CellarProvider's
 * SavedCoffee projection.
 */
export function getAmazonCta(
  coffee: Pick<
    Coffee,
    "sizeOptions" | "coffeeName" | "amazonApprovalRequired" | "amazonApprovalStatus"
  >,
  size?: CoffeeSizeOption,
  context: "buy" | "reorder" = "buy"
): AmazonCta {
  const approvalGated =
    coffee.amazonApprovalRequired === true && coffee.amazonApprovalStatus !== "approved";

  if (approvalGated) {
    return {
      href: whatsAppUrl(coffee.coffeeName, "Amazon Launch List"),
      label: "Join the Launch List",
      isExactListing: false,
      isApprovalGated: true,
    };
  }

  const amazonUrl = size?.amazonUrl || coffee.sizeOptions.find((s) => s.amazonUrl)?.amazonUrl;
  if (amazonUrl) {
    return {
      href: amazonUrl,
      label: context === "reorder" ? "Reorder on Amazon" : "Buy on Amazon",
      isExactListing: true,
      isApprovalGated: false,
    };
  }
  return {
    href: AMAZON_STOREFRONT_URL,
    label: "Visit Our Amazon Store",
    isExactListing: false,
    isApprovalGated: false,
  };
}

export type ProductionGateResult = {
  canRelease: boolean;
  missingConditions: string[];
};

/**
 * The one authoritative guard for "can full production inventory be
 * purchased, shipped to the prep center, or sent to FBA for this coffee
 * yet?" Every condition must be explicitly true — an unset (undefined)
 * field is treated exactly like false, so this never silently passes on an
 * assumption. Call this instead of re-deriving any part of this logic
 * elsewhere (the internal dashboard, any future purchasing/shipping tool).
 */
export function canReleaseFullProduction(coffee: Coffee): ProductionGateResult {
  const missing: string[] = [];

  const amazonRouteApproved = coffee.amazonApprovalStatus === "approved";
  const alternateRouteApproved = coffee.alternateChannelProductionStrategyApproved === true;
  if (!amazonRouteApproved && !alternateRouteApproved) {
    missing.push(
      "Amazon approval status is not 'approved', and no alternate-channel production strategy has been explicitly approved."
    );
  }
  if (!coffee.realCoffeeAvailabilityConfirmed) missing.push("Real coffee availability is not confirmed.");
  if (!coffee.coffeeNameConfirmed) missing.push("Coffee name is not confirmed.");
  if (!coffee.lotInfoConfirmedWhereRequired) missing.push("Lot information is not confirmed where required.");
  if (!coffee.packagingSpecApproved) missing.push("Packaging specification is not approved.");
  if (!coffee.labelModeApproved) missing.push("Label mode is not approved.");
  if (!coffee.buyerImporterDataConfirmed) missing.push("Buyer/importer data is not confirmed.");
  if (!coffee.exporterDataConfirmed) missing.push("Exporter data is not confirmed.");
  if (!coffee.fundingApproved) missing.push("Funding is not approved.");
  if (!coffee.fullProductionReleaseApproved) missing.push("Full production release has not been explicitly authorized.");

  return { canRelease: missing.length === 0, missingConditions: missing };
}

/** True once Amazon has denied the category application for this coffee. */
export function isAmazonDenied(coffee: Coffee): boolean {
  return coffee.amazonApprovalStatus === "denied";
}

/**
 * FBA shipment creation must never proceed without an approved category
 * application — denial, pending, or any other non-"approved" state blocks
 * it, same as canReleaseFullProduction's Amazon-route check.
 */
export function canCreateFbaShipment(coffee: Coffee): boolean {
  return coffee.amazonApprovalStatus === "approved";
}

/**
 * Computes risk outputs strictly from whatever inputs are actually
 * supplied. An output that depends on a missing input comes back
 * `undefined` rather than a guessed number — e.g. break-even units needs a
 * per-unit price/cost that isn't one of the tracked inputs, so it's always
 * undefined until that figure exists elsewhere.
 */
export function calculateFinancialRisk(inputs: FinancialRiskInputs): FinancialRiskOutputs {
  const {
    approvalLotCost, packagingCost, labelCost, exportImportCost, prepCenterCost,
    totalFullProductionCost, directSaleRecoveryPct, wholesaleRecoveryPct, liquidationRecoveryPct,
  } = inputs;

  const approvalLotComponents = [approvalLotCost, packagingCost, labelCost, exportImportCost, prepCenterCost];
  const cashAtRiskBeforeApproval = approvalLotComponents.every((v) => v !== undefined)
    ? approvalLotComponents.reduce<number>((sum, v) => sum + (v as number), 0)
    : undefined;

  // If the approval lot is denied and has zero alternate-channel recovery,
  // the full cash committed to it is the maximum loss.
  const maxLossIfDenied = cashAtRiskBeforeApproval;

  const recoverableValueByChannel =
    cashAtRiskBeforeApproval === undefined
      ? undefined
      : {
          directSale:
            directSaleRecoveryPct !== undefined ? cashAtRiskBeforeApproval * directSaleRecoveryPct : undefined,
          wholesale:
            wholesaleRecoveryPct !== undefined ? cashAtRiskBeforeApproval * wholesaleRecoveryPct : undefined,
          liquidation:
            liquidationRecoveryPct !== undefined ? cashAtRiskBeforeApproval * liquidationRecoveryPct : undefined,
        };

  const fullOrderExposurePrevented =
    totalFullProductionCost !== undefined && cashAtRiskBeforeApproval !== undefined
      ? totalFullProductionCost - cashAtRiskBeforeApproval
      : undefined;

  return {
    cashAtRiskBeforeApproval,
    maxLossIfDenied,
    recoverableValueByChannel,
    breakEvenUnitsApprovalLot: undefined,
    fullOrderExposurePrevented,
  };
}

/** Coffees that carry the Amazon approval gate at all — currently only ones with amazonApprovalRequired set. Drives the internal dashboard's Amazon Approval section. */
export function getAmazonApprovalTracked(): Coffee[] {
  return coffees.filter((c) => c.amazonApprovalRequired === true);
}

/**
 * Every coffee the /labels preview system can show: the real public
 * catalog plus inventory candidates. Never used by public-facing routes —
 * only app/labels/** should call these. This is always preview-only —
 * nothing under /labels/** is the actual production artifact (that's a
 * human printing/exporting a PDF outside the app), so a candidate record
 * showing up here is never "generating a production label," regardless of
 * its sellable/inventoryStatus.
 */
export function getAllLabelCoffees(): Coffee[] {
  return [...coffees, ...inventoryCandidates];
}

/**
 * Internal inventory views (see app/inventory) — never used by
 * public-facing routes. Each reads only `inventoryCandidates` except
 * getSellableInventory, which reads the real public catalog: only a coffee
 * that made it into `coffees` (i.e. already has a real assigned Passport
 * Number) can ever be sellable.
 */

/** Requested quantity, quoted price, availability — coffees not yet purchased. */
export function getPlannedInventory(): Coffee[] {
  return inventoryCandidates.filter((c) => c.inventoryStatus === "planned");
}

/** Ordered/inbound coffees — none yet; this will start returning records once a candidate is actually ordered. */
export function getInboundInventory(): Coffee[] {
  return inventoryCandidates.filter(
    (c) => c.inventoryStatus === "ordered" || c.inventoryStatus === "inbound"
  );
}

/** Received, reserved, and available-to-sell quantities — the real public catalog only. */
export function getSellableInventory(): Coffee[] {
  return coffees.filter((c) => c.sellable !== false);
}

/** Candidates the supplier can't currently fulfill. */
export function getUnavailableCoffees(): Coffee[] {
  return inventoryCandidates.filter((c) => c.availabilityStatus === "unavailable");
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
