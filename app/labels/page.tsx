import type { Metadata } from "next";
import Link from "next/link";
import { coffees, getFullName, STATUS_LABELS } from "@/data/coffees";

export const metadata: Metadata = {
  title: "Label Preview",
  robots: { index: false, follow: false },
};

export default function LabelsIndexPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-dark-gray">
      <p className="text-xs tracking-[0.3em] text-soft-gray">
        INTERNAL DESIGN / PRINT PREVIEW
      </p>
      <h1 className="mt-3 font-heading text-2xl text-forest">Label Preview</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-charcoal">
        Not linked from site navigation, not indexed by search engines. Every
        label here reads live from <code>data/coffees.ts</code> — nothing is
        hardcoded per coffee.
      </p>

      <div className="mt-10 space-y-4">
        {coffees.map((coffee) => (
          <div
            key={coffee.passportNumber}
            className="rounded-lg border border-gold/25 px-6 py-5"
          >
            <p className="font-heading text-lg text-forest">{getFullName(coffee)}</p>
            <p className="mt-1 text-xs text-soft-gray">
              {coffee.passportNumber} &middot; {STATUS_LABELS[coffee.status]}
              {coffee.legacyPassport ? " · Legacy passport" : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link
                href={`/labels/${coffee.passportNumber}/front`}
                className="text-forest underline underline-offset-4"
              >
                Front Label
              </Link>
              <Link
                href={`/labels/${coffee.passportNumber}/back`}
                className="text-forest underline underline-offset-4"
              >
                Back Label
              </Link>
              <Link
                href={`/labels/${coffee.passportNumber}/set`}
                className="text-forest underline underline-offset-4"
              >
                Full Set + Compliance
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
