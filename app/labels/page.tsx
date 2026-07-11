import type { Metadata } from "next";
import Link from "next/link";
import { coffees, inventoryCandidates, getFullName, STATUS_LABELS, type Coffee } from "@/data/coffees";

export const metadata: Metadata = {
  title: "Label Preview",
  robots: { index: false, follow: false },
};

function CoffeeCard({ coffee }: { coffee: Coffee }) {
  return (
    <div className="rounded-lg border border-gold/25 px-6 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-heading text-lg text-forest">{getFullName(coffee)}</p>
        {(coffee.status === "sample" || coffee.status === "inventory_candidate") && (
          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-forest">
            {coffee.status === "sample" ? "DEVELOPMENT SAMPLE" : "INVENTORY CANDIDATE"}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-soft-gray">
        {coffee.passportNumber} &middot; {STATUS_LABELS[coffee.status]}
        {coffee.legacyPassport ? " · Legacy passport" : ""}
        {coffee.sellable === false ? " · Not sellable" : ""}
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
  );
}

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
        hardcoded per coffee. Switch between any coffee below to confirm the
        same layout, typography, QR placement, and compliance checklist work
        identically regardless of which record is selected.
      </p>

      <div className="mt-10">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          PRODUCTION CATALOG
        </p>
        <div className="mt-4 space-y-4">
          {coffees.map((coffee) => (
            <CoffeeCard key={coffee.passportNumber} coffee={coffee} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
          INVENTORY CANDIDATES — NOT PURCHASED, NOT SELLABLE
        </p>
        <p className="mt-2 text-xs italic text-soft-gray">
          Real Casa Ruiz coffees under evaluation for inventory. See{" "}
          <Link href="/inventory" className="underline underline-offset-4">
            /inventory
          </Link>{" "}
          for sourcing status. Never reachable via the public passport route
          — no final Passport Number is assigned until a lot is purchased
          and received.
        </p>
        <div className="mt-4 space-y-4">
          {inventoryCandidates.map((coffee) => (
            <CoffeeCard key={coffee.passportNumber} coffee={coffee} />
          ))}
        </div>
      </div>
    </main>
  );
}
