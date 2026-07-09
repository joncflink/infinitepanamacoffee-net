import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getAllLabelPassportNumbers, getLabelCoffeeByPassportNumber, getFullName, getQrPaths } from "@/data/coffees";
import FrontLabel from "@/components/labels/FrontLabel";
import BackLabel from "@/components/labels/BackLabel";
import ComplianceChecklist from "@/components/labels/ComplianceChecklist";

export function generateStaticParams() {
  return getAllLabelPassportNumbers().map((passportNumber) => ({ passportNumber }));
}

export const metadata: Metadata = {
  title: "Label Set Preview",
  robots: { index: false, follow: false },
};

export default async function LabelSetPage({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}) {
  const { passportNumber } = await params;
  const coffee = getLabelCoffeeByPassportNumber(passportNumber);
  if (!coffee) notFound();

  const qrPaths = getQrPaths(coffee);
  const qrExists = existsSync(path.join(process.cwd(), "public", "qr", `${coffee.passportNumber}.svg`));

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="print:hidden">
        <Link
          href="/labels"
          className="text-xs text-soft-gray underline underline-offset-4"
        >
          ← Back to Label Preview
        </Link>
        <p className="mt-4 text-xs tracking-[0.3em] text-soft-gray">
          INTERNAL PRINT PREVIEW — FULL LABEL SET (8 OZ)
        </p>
        <h1 className="mt-2 font-heading text-xl text-forest">
          {getFullName(coffee)}
        </h1>
        <p className="mt-1 text-xs text-soft-gray">
          To export: use your browser&rsquo;s Print → Save as PDF. No PDF
          generation tooling has been added yet.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-10 print:mt-0 print:gap-0">
        <div className="print:break-after-page">
          <p className="mb-3 text-center text-xs font-medium tracking-[0.2em] text-soft-gray print:hidden">
            FRONT
          </p>
          <FrontLabel coffee={coffee} />
        </div>
        <div>
          <p className="mb-3 text-center text-xs font-medium tracking-[0.2em] text-soft-gray print:hidden">
            BACK
          </p>
          <BackLabel coffee={coffee} qrSvgPath={qrPaths.plainSvg} qrExists={qrExists} />
        </div>
      </div>

      <ComplianceChecklist coffee={coffee} />
    </main>
  );
}
