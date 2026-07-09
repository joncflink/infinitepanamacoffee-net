import { BRAND, getSizeOption, type Coffee } from "@/data/coffees";
import { LABEL_COLORS } from "./constants";

/**
 * Internal Amazon/FBA-awareness checklist — not printed on the label
 * itself (print:hidden). Flags what's genuinely missing on a coffee
 * record so a prelaunch placeholder honestly shows gaps instead of
 * silently passing.
 */
function getChecklist(coffee: Coffee): Array<{ label: string; satisfied: boolean }> {
  const size = getSizeOption(coffee, "8 oz");
  const hasRealNetWeight = size.netWeight !== "TBD" && size.sku !== "";

  return [
    { label: "Brand name present", satisfied: Boolean(BRAND.name) },
    {
      label: "Statement of identity present",
      satisfied: Boolean(coffee.coffeeName && BRAND.productType),
    },
    { label: "Unroasted notice present", satisfied: true },
    { label: "Net weight present", satisfied: hasRealNetWeight },
    { label: "Product of Panama present", satisfied: true },
    { label: "Exporter present", satisfied: Boolean(coffee.exporter) },
    { label: "Importer/distributor present", satisfied: true },
    { label: "Lot code present", satisfied: Boolean(coffee.lotNumber) },
    { label: "Packed On field present", satisfied: Boolean(coffee.packedOn) },
    { label: "Best By field present", satisfied: Boolean(coffee.bestBy) },
    { label: "QR does not replace required label information", satisfied: true },
  ];
}

export default function ComplianceChecklist({ coffee }: { coffee: Coffee }) {
  const checklist = getChecklist(coffee);
  const allSatisfied = checklist.every((item) => item.satisfied);

  return (
    <div className="mx-auto mt-12 w-full max-w-sm print:hidden">
      <p className="text-xs font-medium tracking-[0.2em] text-soft-gray">
        AMAZON / FBA COMPLIANCE — INTERNAL REVIEW ONLY, NOT PRINTED
      </p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span style={{ color: item.satisfied ? LABEL_COLORS.forest : "#B3413B" }}>
              {item.satisfied ? "✓" : "✗"}
            </span>
            <span className={item.satisfied ? "text-charcoal" : "text-charcoal font-medium"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs italic text-soft-gray">
        {allSatisfied
          ? "All checks pass for this record."
          : "Not ready for final production labels — items above are unresolved."}
      </p>
    </div>
  );
}
