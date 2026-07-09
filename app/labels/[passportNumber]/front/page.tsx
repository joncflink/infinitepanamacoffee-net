import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPassportNumbers, getCoffeeByPassportNumber, getFullName } from "@/data/coffees";
import FrontLabel from "@/components/labels/FrontLabel";

export function generateStaticParams() {
  return getAllPassportNumbers().map((passportNumber) => ({ passportNumber }));
}

export const metadata: Metadata = {
  title: "Front Label Preview",
  robots: { index: false, follow: false },
};

export default async function FrontLabelPage({
  params,
}: {
  params: Promise<{ passportNumber: string }>;
}) {
  const { passportNumber } = await params;
  const coffee = getCoffeeByPassportNumber(passportNumber);
  if (!coffee) notFound();

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
          INTERNAL PRINT PREVIEW — FRONT LABEL (8 OZ)
        </p>
        <h1 className="mt-2 font-heading text-xl text-forest">
          {getFullName(coffee)}
        </h1>
      </div>

      <div className="mt-8 print:mt-0">
        <FrontLabel coffee={coffee} />
      </div>
    </main>
  );
}
