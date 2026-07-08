import { notFound, permanentRedirect } from "next/navigation";
import { getAllCoffeeSlugs, getCoffee } from "@/data/coffees";

export function generateStaticParams() {
  return getAllCoffeeSlugs().map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) notFound();

  permanentRedirect(`/passport/${coffee.lotId}`);
}
