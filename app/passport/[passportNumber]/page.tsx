import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import {
  BRAND,
  getAllPassportNumbers,
  getCoffeeByPassportNumber,
  getFullName,
  getProductType,
} from "@/data/coffees";
import CoffeePage from "@/components/CoffeePage";

export function generateStaticParams() {
  return getAllPassportNumbers().map((passportNumber) => ({ passportNumber }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}): Promise<Metadata> {
  const { passportNumber } = await params;
  const coffee = getCoffeeByPassportNumber(passportNumber);
  if (!coffee) {
    // notFound() below renders app/passport/[passportNumber]/not-found.tsx,
    // but that segment's own metadata export isn't reliably applied when
    // reached via a programmatic notFound() call from an already-matched
    // dynamic route (this one always matches — [passportNumber] is a
    // single required segment, so not-found.tsx is never reached any other
    // way). Set it here instead, where it actually takes effect.
    return { title: "Passport Not Found", robots: { index: false, follow: true } };
  }

  // Dynamic, derived from the coffee name — never a stored/editable field,
  // so it can't drift out of the "[Coffee Name] Coffee Passport™" format.
  // Only the public passportNumber is ever used here or in the canonical
  // URL below — never coffee.id (the internal uuid).
  const title = `${coffee.coffeeName} Coffee Passport™`;

  return {
    title,
    description: coffee.metaDescription,
    alternates: {
      canonical: `/passport/${coffee.passportNumber}`,
    },
    openGraph: {
      title,
      description: coffee.metaDescription,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}) {
  const { passportNumber } = await params;
  const coffee = getCoffeeByPassportNumber(passportNumber);
  if (!coffee) notFound();

  // The print-only certificate shouldn't ever try to render a QR image
  // that doesn't exist yet — check once here rather than in the client
  // component, same pattern as app/labels/[passportNumber]/back/page.tsx.
  const qrExists = existsSync(
    path.join(process.cwd(), "public", "qr", `${coffee.passportNumber}.svg`)
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getFullName(coffee),
    description: coffee.metaDescription,
    sku: coffee.passportNumber,
    category: getProductType(coffee),
    brand: {
      "@type": "Brand",
      name: "Infinite Panama Coffee",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Origin", value: BRAND.origin },
      coffee.process
        ? { "@type": "PropertyValue", name: "Process", value: coffee.process }
        : null,
      coffee.harvest
        ? { "@type": "PropertyValue", name: "Harvest", value: coffee.harvest }
        : null,
    ].filter((property) => property !== null),
    offers: coffee.sizeOptions.map((option) => ({
      "@type": "Offer",
      sku: option.sku,
      availability:
        coffee.status === "sold_out"
          ? "https://schema.org/OutOfStock"
          : coffee.status === "reserve" || coffee.status === "reserve_collection"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
      url:
        option.amazonUrl ||
        `https://infinitepanamacoffee.com/passport/${coffee.passportNumber}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <CoffeePage coffee={coffee} qrExists={qrExists} />
    </>
  );
}
