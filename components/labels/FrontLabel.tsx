import Mark from "@/components/Mark";
import { BRAND, getSizeOption, type Coffee } from "@/data/coffees";
import {
  LABEL_COLORS,
  PENDING_LOT_SELECTION,
  TAGLINE_LINES,
  UNROASTED_ROAST_BEFORE,
} from "./constants";

function Divider() {
  return (
    <hr
      className="mx-auto my-4 w-16 border-t"
      style={{ borderColor: LABEL_COLORS.gold }}
    />
  );
}

/** True for a sizeOption that's itself a placeholder (no real SKU/weight assigned yet). */
function isPlaceholderSize(size: ReturnType<typeof getSizeOption>): boolean {
  return size.sku === "" || size.netWeight === "TBD";
}

export default function FrontLabel({ coffee }: { coffee: Coffee }) {
  const size = getSizeOption(coffee, "8 oz");
  const netWeightLine = isPlaceholderSize(size)
    ? `Net Wt. ${PENDING_LOT_SELECTION}`
    : `Net Wt. ${size.size} (${size.netWeight})`;
  const processLine = coffee.process ? `${coffee.process} Process` : PENDING_LOT_SELECTION;

  return (
    <div
      className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-lg px-10 py-14 text-center print:max-w-none print:rounded-none print:shadow-none"
      style={{ backgroundColor: LABEL_COLORS.ivory }}
    >
      <Mark variant="dark" />

      <Divider />

      <div>
        <p
          className="font-heading text-lg tracking-wide"
          style={{ color: LABEL_COLORS.forest }}
        >
          {BRAND.collection}
        </p>
        <p
          className="mt-1 font-heading text-3xl font-semibold leading-tight"
          style={{ color: LABEL_COLORS.forest }}
        >
          {coffee.coffeeName}
        </p>
      </div>

      <div className="space-y-1 text-sm" style={{ color: LABEL_COLORS.charcoal }}>
        <p>{BRAND.productType}</p>
        <p className="tracking-[0.15em]">{UNROASTED_ROAST_BEFORE}</p>
        <p>{BRAND.origin}</p>
        <p>{processLine}</p>
      </div>

      <Divider />

      <p
        className="text-sm italic leading-6"
        style={{ color: LABEL_COLORS.charcoal }}
      >
        {TAGLINE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <p
        className="mt-2 text-sm font-medium tracking-wide"
        style={{ color: LABEL_COLORS.forest }}
      >
        {netWeightLine}
      </p>
    </div>
  );
}
