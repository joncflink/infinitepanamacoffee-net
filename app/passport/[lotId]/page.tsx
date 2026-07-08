import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLotIds, getCoffeeByLot } from "@/data/coffees";
import CoffeePage from "@/components/CoffeePage";

export function generateStaticParams() {
  return getAllLotIds().map((lotId) => ({ lotId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lotId: string }>;
}): Promise<Metadata> {
  const { lotId } = await params;
  const coffee = getCoffeeByLot(lotId);
  if (!coffee) return {};

  return {
    title: coffee.metaTitle,
    description: coffee.metaDescription,
    alternates: {
      canonical: `/passport/${coffee.lotId}`,
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
  params: Promise<{ lotId: string }>;
}) {
  const { lotId } = await params;
  const coffee = getCoffeeByLot(lotId);
  if (!coffee) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: coffee.fullName,
    description: coffee.metaDescription,
    sku: coffee.lotId,
    category: coffee.productType,
    brand: {
      "@type": "Brand",
      name: "Infinite Panama Coffee",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Origin", value: coffee.origin },
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
      url: option.amazonUrl || `https://infinitepanamacoffee.com/passport/${coffee.lotId}`,
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
