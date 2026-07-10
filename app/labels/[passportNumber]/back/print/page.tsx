import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLabelPassportNumbers, getLabelCoffeeByPassportNumber } from "@/data/coffees";
import PrintCanvas from "@/components/labels/print/PrintCanvas";
import BackLabel from "@/components/labels/BackLabel";

export function generateStaticParams() {
  return getAllLabelPassportNumbers().map((passportNumber) => ({ passportNumber }));
}

export const metadata: Metadata = {
  title: "Back Label — Print",
  robots: { index: false, follow: false },
};

// No chrome of any kind here — no nav, no heading, no buttons. This is the
// physical print artwork itself, not a reviewable preview page.
export default async function BackLabelPrintPage({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}) {
  const { passportNumber } = await params;
  const coffee = getLabelCoffeeByPassportNumber(passportNumber);
  if (!coffee) notFound();

  return (
    <PrintCanvas>
      <BackLabel coffee={coffee} variant="print" />
    </PrintCanvas>
  );
}
