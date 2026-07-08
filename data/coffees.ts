export const WHATSAPP_NUMBER = "12072335784";
export const AMAZON_STORE_URL =
  "https://www.amazon.com/sp?ie=UTF8&seller=A3A3ULRCNZYQWC&isAmazonFulfilled=1&asin=0702052329&ref_=olp_merch_name_2";

export function whatsAppUrl(coffeeName: string, size?: string): string {
  const suffix = size ? ` (${size})` : "";
  const text = `Hi Jon, I am interested in Infinite Panama Coffee ${coffeeName}${suffix}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export type CoffeeStatus = "available" | "reserve" | "sold_out" | "archived";

export const STATUS_LABELS: Record<CoffeeStatus, string> = {
  available: "Available",
  reserve: "Reserve Collection",
  sold_out: "Currently Resting",
  archived: "Archived",
};

export type CoffeeSizeOption = {
  size: string;
  netWeight: string;
  sku: string;
  /** Left empty until a per-size Amazon listing exists; falls back to WhatsApp reorder. */
  amazonUrl: string;
  qrCodePath: string;
};

/** "Pending Producer Confirmation" placeholders are intentional — do not fill in specifics without a real source. */
const TBC = "Pending Producer Confirmation";

export type Coffee = {
  lotId: string;
  slug: string;
  collection: string;
  productName: string;
  fullName: string;
  origin: string;
  productType: string;
  process: string;
  harvest: string;
  variety: string;
  elevation: string;
  /** Only set once the producer/exporter has approved being named publicly. */
  producer?: string;
  exporter?: string;
  status: CoffeeStatus;
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
    lotId: "IPC-ALT-001",
    slug: "altura",
    collection: "Infinite Select™",
    productName: "Altura",
    fullName: "Infinite Select™ Altura",
    origin: "Boquete, Chiriquí, Panama",
    productType: "Specialty Green Coffee Beans",
    process: "Washed",
    harvest: "2025–2026",
    variety: TBC,
    elevation: TBC,
    status: "reserve",
    sizeOptions: [
      {
        size: "8 oz",
        netWeight: "227 g",
        sku: "IPC-ALT-8OZ-001",
        amazonUrl: "",
        qrCodePath: "/qr/IPC-ALT-001.svg",
      },
      {
        size: "1 lb",
        netWeight: "454 g",
        sku: "IPC-ALT-1LB-001",
        amazonUrl: "",
        qrCodePath: "/qr/IPC-ALT-001.svg",
      },
      {
        size: "2 lb",
        netWeight: "907 g",
        sku: "IPC-ALT-2LB-001",
        amazonUrl: "",
        qrCodePath: "/qr/IPC-ALT-001.svg",
      },
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
];

export function getCoffee(slug: string): Coffee | undefined {
  return coffees.find((c) => c.slug === slug);
}

export function getAllCoffeeSlugs(): string[] {
  return coffees.map((c) => c.slug);
}

export function getCoffeeByLot(lotId: string): Coffee | undefined {
  const normalized = lotId.toUpperCase();
  return coffees.find((c) => c.lotId === normalized);
}

export function getAllLotIds(): string[] {
  return coffees.map((c) => c.lotId);
}

/** Collectible display format for a lot number, e.g. "IPC-ALT-001" -> "IPC • 2025 • ALT • 001". The raw lotId stays the machine-readable ID used in URLs, QR codes, and WhatsApp messages. */
export function formatLotDisplay(coffee: Coffee): string {
  const parts = coffee.lotId.split("-");
  const year = coffee.harvest.match(/\d{4}/)?.[0];
  return [parts[0], year, parts[1], parts[2]].filter(Boolean).join(" • ");
}
