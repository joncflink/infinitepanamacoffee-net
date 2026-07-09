import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BRAND,
  getAllPassportNumbers,
  getCoffeeByPassportNumber,
  getFullName,
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getFullName(coffee),
    description: coffee.metaDescription,
    sku: coffee.passportNumber,
    category: BRAND.productType,
    brand: {
      "@type": "Brand",
      name: "Infinite Panama Coffee",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Origin", value: BRAND.origin },
      { "@type": "PropertyValue", name: "Process", value: coffee.process },
      { "@type": "PropertyValue", name: "Harvest", value: coffee.harvest },
    ],
    offers: coffee.sizeOptions.map((option) => ({
      "@type": "Offer",
      sku: option.sku,
      availability:
        coffee.status === "sold_out"
          ? "https://schema.org/OutOfStock"
          : coffee.status === "reserve"
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
      <CoffeePage coffee={coffee} />
    </>
  );
}
