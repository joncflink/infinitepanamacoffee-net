import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLabelPassportNumbers, getLabelCoffeeByPassportNumber } from "@/data/coffees";
import PrintCanvas from "@/components/labels/print/PrintCanvas";
import FrontLabel from "@/components/labels/FrontLabel";

export function generateStaticParams() {
  return getAllLabelPassportNumbers().map((passportNumber) => ({ passportNumber }));
}

export const metadata: Metadata = {
  title: "Front Label — Print",
  robots: { index: false, follow: false },
};

// No chrome of any kind here — no nav, no heading, no buttons. This is the
// physical print artwork itself, not a reviewable preview page.
export default async function FrontLabelPrintPage({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}) {
  const { passportNumber } = await params;
  const coffee = getLabelCoffeeByPassportNumber(passportNumber);
  if (!coffee) notFound();

  return (
    <PrintCanvas>
      <FrontLabel coffee={coffee} variant="print" />
    </PrintCanvas>
  );
}
