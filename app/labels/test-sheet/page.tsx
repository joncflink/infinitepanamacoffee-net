import type { Metadata } from "next";
import { getFeaturedCoffee, getFullName } from "@/data/coffees";
import PrintCanvas from "@/components/labels/print/PrintCanvas";
import FrontLabel from "@/components/labels/FrontLabel";
import BackLabel from "@/components/labels/BackLabel";
import { PAGE_HEIGHT_IN, PAGE_WIDTH_IN, inToCss } from "@/components/labels/print/printGeometry";

export const metadata: Metadata = {
  title: "Physical Test Sheet",
  robots: { index: false, follow: false },
};

const STEPS = [
  "Print on plain paper.",
  "Print at 100%.",
  "Cut on crop marks.",
  "Tape onto the actual Wantpack 8 oz bag.",
  "Position the top of the label approximately 0.75\" (19 mm) below the zipper to avoid the heat-seal area.",
];

const EVALUATE = [
  "Overall balance",
  "Logo size",
  "Coffee name readability",
  "Whitespace",
  "Edge spacing",
  "Fit on the kraft bag",
];

export default function TestSheetPage() {
  const coffee = getFeaturedCoffee();

  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-16 print:hidden">
        <p className="text-xs tracking-[0.3em] text-soft-gray">
          INTERNAL — PHYSICAL PRINT PROTOTYPE
        </p>
        <h1 className="mt-3 font-heading text-2xl text-forest">
          Test Sheet — {getFullName(coffee)}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-charcoal">
          This is a 3-page print job: page 1 is the front label, page 2 is
          the back label (each with crop marks and 0.125&Prime; bleed at
          exact 4&Prime;&nbsp;&times;&nbsp;5&Prime; trim size), page 3 is
          this evaluation checklist. Two labels at this size cannot fit
          side by side on one Letter sheet with proper crop-mark
          clearance, so they print as separate pages in the same job
          instead.
        </p>
        <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-5 py-4 text-sm leading-6 text-charcoal">
          <strong className="font-heading text-forest">
            This is a physical fit prototype, not a production label.
          </strong>{" "}
          Print on plain paper first. Do not purchase production waterproof
          labels until physical fit has been approved on the actual
          Wantpack bag.
        </div>
      </div>

      <PrintCanvas>
        <FrontLabel coffee={coffee} variant="print" />
      </PrintCanvas>

      <PrintCanvas>
        <BackLabel coffee={coffee} variant="print" />
      </PrintCanvas>

      <div
        className="print-page relative bg-white text-charcoal"
        style={{ width: inToCss(PAGE_WIDTH_IN), height: inToCss(PAGE_HEIGHT_IN) }}
      >
        <div className="p-12">
          <p className="text-xs tracking-[0.3em] text-soft-gray">
            INFINITE PANAMA COFFEE — PHYSICAL PRINT PROTOTYPE
          </p>
          <h1 className="mt-3 font-heading text-2xl text-forest">
            Test Sheet Instructions
          </h1>
          <p className="mt-2 text-sm text-soft-gray">{getFullName(coffee)}</p>

          <div className="mt-8 rounded-lg border-2 border-gold px-6 py-5 text-sm leading-6">
            <strong className="font-heading text-forest">
              This is a physical fit prototype, not the final production
              label.
            </strong>{" "}
            Do not purchase production waterproof labels until physical fit
            has been approved on the actual Wantpack bag.
          </div>

          <ol className="mt-8 list-decimal space-y-3 pl-6 text-sm leading-6">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
            <li>
              Evaluate:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                {EVALUATE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
