import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getAllLabelPassportNumbers, getLabelCoffeeByPassportNumber, getFullName, getQrPaths } from "@/data/coffees";
import BackLabel from "@/components/labels/BackLabel";

export function generateStaticParams() {
  return getAllLabelPassportNumbers().map((passportNumber) => ({ passportNumber }));
}

export const metadata: Metadata = {
  title: "Back Label Preview",
  robots: { index: false, follow: false },
};

export default async function BackLabelPage({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}) {
  const { passportNumber } = await params;
  const coffee = getLabelCoffeeByPassportNumber(passportNumber);
  if (!coffee) notFound();

  const qrPaths = getQrPaths(coffee);
  // Never let a missing QR file error the preview — it's expected for any
  // coffee that hasn't had its final lot/QR generated yet.
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
          INTERNAL PRINT PREVIEW — BACK LABEL (8 OZ)
        </p>
        <h1 className="mt-2 font-heading text-xl text-forest">
          {getFullName(coffee)}
        </h1>
      </div>

      <div className="mt-8 print:mt-0">
        <BackLabel coffee={coffee} qrSvgPath={qrPaths.plainSvg} qrExists={qrExists} />
      </div>
    </main>
  );
}
