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
  if (!coffee) return {};

  return {
    title: coffee.metaTitle,
    description: coffee.metaDescription,
    alternates: {
      canonical: `/passport/${coffee.passportNumber}`,
    },
    openGraph: {
      title: coffee.metaTitle,
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
