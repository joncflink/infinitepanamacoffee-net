import Mark from "@/components/Mark";
import {
  BRAND,
  formatPassportDisplay,
  getCollection,
  getProductType,
  type Coffee,
} from "@/data/coffees";
import {
  AMAZON_LABEL_ID_MODE,
  IMPORTED_DISTRIBUTED_BY,
  LABEL_COLORS,
  OUR_PROMISE,
  PACKED_EXPORTED_BY,
  PRODUCT_OF_PANAMA,
  UNROASTED_NOTICE_BODY,
  UNROASTED_NOTICE_HEADING,
  WEBSITE_DISPLAY,
  WEBSITE_URL,
  fieldPlaceholder,
} from "./constants";

function Divider({ compact }: { compact: boolean }) {
  return (
    <hr
      className={`w-full border-t ${compact ? "my-1" : "my-4"}`}
      style={{ borderColor: LABEL_COLORS.gold }}
    />
  );
}

/** A fill-in-later date field — blank rather than a fallback phrase, matching physical labels that get date-stamped at packing time. */
function DateField({ label, value }: { label: string; value?: string }) {
  return (
    <p>
      <span className="font-medium">{label}: </span>
      {value ? (
        value
      ) : (
        <span className="inline-block w-24 border-b" style={{ borderColor: LABEL_COLORS.charcoal }} />
      )}
    </p>
  );
}

/**
 * Full field set — used only by the "card" (internal review) variant, so a
 * reviewer can see exactly what's still unconfirmed before something goes
 * to print. {{field}} placeholders are deliberate here: unmistakable, so
 * an incomplete record can't be mistaken for a finished one.
 */
const fullProductInfoRows = (coffee: Coffee): Array<[string, string]> => [
  ["Collection", getCollection(coffee)],
  ["Coffee", coffee.coffeeName],
  ["Product", getProductType(coffee)],
  ["Origin", BRAND.origin],
  ["Farm", coffee.farm ?? fieldPlaceholder("farm")],
  ["Process", coffee.process ?? fieldPlaceholder("process")],
  ["Harvest", coffee.harvest ?? fieldPlaceholder("harvest")],
  ["Producer", coffee.producer ?? fieldPlaceholder("producer")],
  ["Exporter", coffee.exporter ?? fieldPlaceholder("exporter")],
  ["Variety", coffee.variety ?? fieldPlaceholder("variety")],
  ["Elevation", coffee.elevation ?? fieldPlaceholder("elevation")],
];

/**
 * Reduced, physical-label field set — required/high-value facts only.
 * Farm, Producer, Exporter, Variety, Elevation, and Collection are
 * deliberately not printed on the bag; they still live on the Infinite
 * Coffee Passport™ website page, which isn't space-constrained (reachable
 * by looking up the Passport Number in "passport" mode — there's no QR on
 * this label to scan; see AMAZON_LABEL_ID_MODE in ./constants).
 * A field that isn't set yet is simply omitted — never a raw
 * {{placeholder}} on something meant for a customer's hands.
 */
const printProductInfoRows = (coffee: Coffee): Array<[string, string]> => {
  const rows: Array<[string, string | undefined]> = [
    ["Coffee", coffee.coffeeName],
    ["Product", getProductType(coffee)],
    ["Origin", BRAND.origin],
    ["Process", coffee.process],
    ["Harvest", coffee.harvest],
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
};

export default function BackLabel({
  coffee,
  variant = "card",
}: {
  coffee: Coffee;
  /**
   * "card": the on-screen review card — full field set (with {{field}}
   * placeholders), roomy spacing.
   * "print": the physical 4"x5" bag artwork — only required/high-value
   * fields, missing fields silently omitted (never a placeholder), larger
   * type.
   */
  variant?: "card" | "print";
}) {
  const compact = variant === "print";
  const logoScale = compact ? "scale-[0.34]" : "scale-75";
  // Mark.tsx's natural unscaled height is ~109px; clamp the wrapper to
  // roughly what logoScale actually paints so the print layout doesn't
  // reserve space for the un-scaled size. See the overflow-hidden wrapper
  // below.
  const logoWrapperHeight = 37;
  // Amazon-bound label: no QR code, no QR placeholder, no external URL or
  // scan instruction tied to the Coffee Passport — that part is settled.
  // What's still pending Amazon's written response (Case #21076327341) is
  // only whether the static Passport Number itself may appear on the bag.
  // "lot" mode: show only a bare Lot Number, no Passport branding at all —
  // the Passport still exists internally, the customer never sees it here.
  const isLotMode = AMAZON_LABEL_ID_MODE === "lot";
  const identifierLabel = isLotMode ? "Lot Number" : "Passport No.";
  const identifierValue = isLotMode ? coffee.lotNumber : formatPassportDisplay(coffee);
  // Print never fabricates a missing lot number — omit the whole block.
  // The card/preview variant must not silently look complete, so it shows
  // an explicit flag rather than the usual quiet {{placeholder}}.
  const lotNumberMissing = isLotMode && !coffee.lotNumber;
  const showIdentifierLine = !compact || Boolean(identifierValue);

  return (
    <div
      className={
        compact
          ? "h-full w-full text-left text-[11px] leading-[15px]"
          : "mx-auto w-full max-w-sm rounded-lg px-8 py-10 text-left text-xs leading-5 print:max-w-none print:rounded-none print:shadow-none"
      }
      style={{ backgroundColor: LABEL_COLORS.ivory, color: LABEL_COLORS.charcoal }}
    >
      <div className="flex flex-col items-center text-center">
        {/* transform:scale() shrinks what's painted but not the layout
            space reserved — clamp the wrapper to the actual scaled-down
            height so the flow doesn't reserve the full unscaled size. */}
        <div
          className="w-full overflow-hidden"
          style={compact ? { height: logoWrapperHeight } : undefined}
        >
          <div className={`origin-top ${logoScale}`}>
            <Mark variant="dark" />
          </div>
        </div>
        {/* Lot mode drops the Passport title entirely — the Amazon
            customer sees no Coffee Passport branding, only a lot number. */}
        {!isLotMode && (
          <p
            className={compact ? "font-heading text-[11px]" : "mt-1 font-heading text-sm"}
            style={{ color: LABEL_COLORS.forest }}
          >
            Infinite Coffee Passport™
          </p>
        )}
      </div>

      {/* No QR code, no QR placeholder, on either compliance mode — Amazon
          has already stated external QR codes on product packaging are
          prohibited. If a future insert is approved, the QR belongs on
          that separate asset, not here. */}
      <div className={`flex flex-col items-center text-center ${compact ? "mt-2" : "mt-4"}`}>
        {showIdentifierLine && (
          <p
            className={compact ? "text-[11px] font-medium" : "text-[13px] font-medium"}
            style={{ color: LABEL_COLORS.forest }}
          >
            {lotNumberMissing ? (
              <span style={{ color: "#B3413B" }}>LOT NUMBER REQUIRED</span>
            ) : (
              <>
                {identifierLabel} {identifierValue}
              </>
            )}
          </p>
        )}
      </div>

      {!compact && (
        <p className="mt-2 text-center text-[10px] italic" style={{ color: LABEL_COLORS.charcoal }}>
          {isLotMode
            ? "Amazon Label Mode: Lot Only — Conservative Fallback"
            : "Amazon Label Mode: Passport — Awaiting Amazon Confirmation"}
        </p>
      )}

      <Divider compact={compact} />

      {!compact && (
        <>
          <div className="text-center">
            <p className="font-medium tracking-wide" style={{ color: LABEL_COLORS.forest }}>
              OUR PROMISE
            </p>
            <p className="mt-1">{OUR_PROMISE}</p>
          </div>
          <Divider compact={compact} />
        </>
      )}

      <div>
        {!compact && (
          <p className="font-medium" style={{ color: LABEL_COLORS.forest }}>
            Product Information
          </p>
        )}
        <dl className={compact ? "space-y-0.5" : "mt-2 space-y-1"}>
          {(compact ? printProductInfoRows(coffee) : fullProductInfoRows(coffee)).map(
            ([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt>{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            )
          )}
        </dl>
      </div>

      <Divider compact={compact} />

      <div className={compact ? "space-y-0.5" : "space-y-2"}>
        <p className="font-medium tracking-wide" style={{ color: LABEL_COLORS.forest }}>
          {UNROASTED_NOTICE_HEADING}
        </p>
        <p>{UNROASTED_NOTICE_BODY}</p>
        <p>{PRODUCT_OF_PANAMA}</p>
      </div>

      <Divider compact={compact} />

      <div className={compact ? "space-y-0.5" : "space-y-3"}>
        <div>
          <p className="font-medium">Packed &amp; Exported by:</p>
          <p>{PACKED_EXPORTED_BY.name}</p>
          {!compact && <p>{PACKED_EXPORTED_BY.address}</p>}
        </div>
        <div>
          <p className="font-medium">Imported &amp; Distributed by:</p>
          <p>{IMPORTED_DISTRIBUTED_BY.name}</p>
          {!compact && (
            <>
              <p>{IMPORTED_DISTRIBUTED_BY.addressLine1}</p>
              <p>{IMPORTED_DISTRIBUTED_BY.addressLine2}</p>
            </>
          )}
        </div>
        <div>
          <p className="font-medium">Website:</p>
          <a href={WEBSITE_URL} className="underline underline-offset-2">
            {WEBSITE_DISPLAY}
          </a>
        </div>
      </div>

      <Divider compact={compact} />

      <div>
        <p className="font-medium">Storage:</p>
        <p>{coffee.storage}</p>
      </div>

      <Divider compact={compact} />

      <div className={compact ? "space-y-0.5" : "space-y-1"}>
        <DateField label="Packed On" value={coffee.packedOn} />
        <DateField label="Best By" value={coffee.bestBy} />
        {/* In lot mode the Lot Number is already the primary identifier
            shown once near the top — repeating it here would be a visible,
            accidental-looking duplicate, so it's suppressed entirely. In
            passport mode, Passport Number and Lot Number are different
            identifiers and both may appear. */}
        {!isLotMode &&
          (compact ? (
            coffee.lotNumber && (
              <p>
                <span className="font-medium">Lot No.: </span>
                {coffee.lotNumber}
              </p>
            )
          ) : (
            <p>
              <span className="font-medium">Lot No.: </span>
              {coffee.lotNumber ?? fieldPlaceholder("lotNumber")}
            </p>
          ))}
        {/* Passport No. already shown once near the top — not repeated on
            the print variant, where every line of vertical space matters. */}
        {!compact && !isLotMode && (
          <p>
            <span className="font-medium">Passport No.: </span>
            {coffee.passportNumber}
          </p>
        )}
      </div>
    </div>
  );
}
