import Mark from "@/components/Mark";
import { BRAND, getCollection, getProductType, getSizeOption, type Coffee } from "@/data/coffees";
import {
  LABEL_COLORS,
  TAGLINE_LINES,
  UNROASTED_NOTICE_HEADING,
  fieldPlaceholder,
} from "./constants";

function Divider({ compact }: { compact: boolean }) {
  return (
    <hr
      className={`mx-auto w-16 border-t ${compact ? "my-1" : "my-4"}`}
      style={{ borderColor: LABEL_COLORS.gold }}
    />
  );
}

/**
 * True only when the weight itself hasn't been determined yet. Deliberately
 * ignores sku — a record can have a real net weight worth showing on the
 * label while still having no SKU (e.g. a development sample never
 * intended to be sold), and those are different kinds of "not ready."
 */
function isPlaceholderSize(size: ReturnType<typeof getSizeOption>): boolean {
  return size.netWeight === "TBD";
}

export default function FrontLabel({
  coffee,
  variant = "card",
}: {
  coffee: Coffee;
  /**
   * "card" (default): the on-screen review card — capped width, rounded
   * corners, its own padding. Used by /front, /set.
   * "print": bare content that fills whatever exact-dimension container
   * the caller provides (see components/labels/print/PrintCanvas.tsx) —
   * no width cap, no rounded corners, no own padding. Same content, same
   * colors, same copy — only the outer chrome changes.
   */
  variant?: "card" | "print";
}) {
  const size = getSizeOption(coffee, "8 oz");
  const netWeightLine = isPlaceholderSize(size)
    ? `Net Wt. ${fieldPlaceholder("netWeight")}`
    : `Net Wt. ${size.size} (${size.netWeight})`;
  const processLine = coffee.process
    ? `${coffee.process} Process`
    : fieldPlaceholder("process");
  const isPrint = variant === "print";
  // Measured directly (Puppeteer getBoundingClientRect), not estimated:
  // Mark.tsx painted at this scale is ~182.7px tall. Only the print
  // variant needs this clamped — it's the only one with a fixed-height
  // container where transform:scale()'s unshrunk reserved flow height
  // would otherwise push content outside the 4"x5" box (the card variant
  // has room to spare and is left exactly as it was).
  const logoWrapperHeight = 183;

  return (
    <div
      className={
        isPrint
          ? "flex h-full w-full flex-col items-center justify-center gap-1.5 text-center"
          : "mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-lg px-10 py-14 text-center print:max-w-none print:rounded-none print:shadow-none"
      }
      style={{ backgroundColor: LABEL_COLORS.ivory }}
    >
      {/* Logo, ~12.5% larger again per the production-review pass — the
          primary visual anchor on the label. transform:scale() doesn't
          change the flow height it reserves, so the wrapper adds a bit of
          margin (or, on print, an explicit height clamp) to compensate
          (origin-top keeps growth pointing only downward). Same locked
          Mark.tsx, not redrawn, exact proportions preserved. */}
      <div
        className={isPrint ? "w-full shrink-0 overflow-hidden" : "mb-1"}
        style={isPrint ? { height: logoWrapperHeight } : undefined}
      >
        <div className="origin-top scale-[1.26]">
          <Mark variant="dark" />
        </div>
      </div>

      <Divider compact={isPrint} />

      <div>
        <p
          className="font-heading text-lg tracking-wide"
          style={{ color: LABEL_COLORS.forest }}
        >
          {getCollection(coffee)}
        </p>
        {/* Coffee name is the primary purchase decision — sized and
            weighted above the collection name, not the reverse. +12% over
            the prior 34px pass. text-wrap:balance lets the browser choose
            an elegant break if a longer name wraps, without ever hardcoding
            a line break for a specific coffee's text. */}
        <p
          className="mt-1 font-heading text-[38px] font-semibold leading-tight [text-wrap:balance]"
          style={{ color: LABEL_COLORS.forest }}
        >
          {coffee.coffeeName}
        </p>
      </div>

      <div className={`text-sm ${isPrint ? "space-y-0.5" : "space-y-1"}`} style={{ color: LABEL_COLORS.charcoal }}>
        <p>{getProductType(coffee)}</p>
        <p className="tracking-[0.15em]">{UNROASTED_NOTICE_HEADING}</p>
        <p>{BRAND.origin}</p>
        <p>{processLine}</p>
      </div>

      <Divider compact={isPrint} />

      <p
        className={`text-sm italic ${isPrint ? "leading-4" : "leading-6"}`}
        style={{ color: LABEL_COLORS.charcoal }}
      >
        {TAGLINE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <p
        className={`text-sm font-medium tracking-wide ${isPrint ? "mt-0" : "mt-2"}`}
        style={{ color: LABEL_COLORS.forest }}
      >
        {netWeightLine}
      </p>
    </div>
  );
}
