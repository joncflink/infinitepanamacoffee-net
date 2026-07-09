import Mark from "@/components/Mark";
import {
  BRAND,
  PENDING_CONFIRMATION,
  formatPassportDisplay,
  type Coffee,
} from "@/data/coffees";
import {
  IMPORTED_DISTRIBUTED_BY,
  LABEL_COLORS,
  PACKED_EXPORTED_BY,
  PENDING_LOT_SELECTION,
  PRODUCT_OF_PANAMA,
  QR_PENDING_MESSAGE,
  UNROASTED_NOTICE_BODY,
  UNROASTED_NOTICE_HEADING,
  WEBSITE_DISPLAY,
  WEBSITE_URL,
} from "./constants";

function Divider() {
  return (
    <hr
      className="my-4 w-full border-t"
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

const productInfoRows = (coffee: Coffee): Array<[string, string]> => [
  ["Collection", BRAND.collection],
  ["Coffee", coffee.coffeeName],
  ["Product", BRAND.productType],
  ["Origin", BRAND.origin],
  ["Process", coffee.process ?? PENDING_LOT_SELECTION],
  ["Harvest", coffee.harvest ?? PENDING_LOT_SELECTION],
  ["Producer", coffee.producer ?? PENDING_CONFIRMATION],
  ["Exporter", coffee.exporter ?? PENDING_CONFIRMATION],
  ["Variety", coffee.variety ?? PENDING_LOT_SELECTION],
  ["Elevation", coffee.elevation ?? PENDING_LOT_SELECTION],
];

export default function BackLabel({
  coffee,
  qrSvgPath,
  qrExists,
}: {
  coffee: Coffee;
  qrSvgPath: string;
  qrExists: boolean;
}) {
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-lg px-8 py-10 text-left text-xs leading-5 print:max-w-none print:rounded-none print:shadow-none"
      style={{ backgroundColor: LABEL_COLORS.ivory, color: LABEL_COLORS.charcoal }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="origin-top scale-75">
          <Mark variant="dark" />
        </div>
        <p
          className="mt-1 font-heading text-sm"
          style={{ color: LABEL_COLORS.forest }}
        >
          Infinite Coffee Passport™
        </p>
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        {qrExists ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrSvgPath} alt="Infinite Coffee Passport QR Code" width={110} height={110} />
        ) : (
          <div
            className="flex h-[110px] w-[110px] flex-col items-center justify-center rounded-md border border-dashed px-3 text-center text-[10px] italic"
            style={{ borderColor: LABEL_COLORS.gold, color: LABEL_COLORS.charcoal }}
          >
            {QR_PENDING_MESSAGE}
          </div>
        )}
        <p className="mt-2 text-[11px] font-medium" style={{ color: LABEL_COLORS.forest }}>
          Passport No. {formatPassportDisplay(coffee)}
        </p>
        <p className="mt-1 max-w-[220px] text-[10px] italic">
          Scan to verify this coffee&rsquo;s permanent provenance record.
        </p>
      </div>

      <Divider />

      <div>
        <p className="font-medium" style={{ color: LABEL_COLORS.forest }}>
          Product Information
        </p>
        <dl className="mt-2 space-y-1">
          {productInfoRows(coffee).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt>{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Divider />

      <div className="space-y-2">
        <p className="font-medium tracking-wide" style={{ color: LABEL_COLORS.forest }}>
          {UNROASTED_NOTICE_HEADING}
        </p>
        <p>{UNROASTED_NOTICE_BODY}</p>
        <p>{PRODUCT_OF_PANAMA}</p>
      </div>

      <Divider />

      <div className="space-y-3">
        <div>
          <p className="font-medium">Packed &amp; Exported by:</p>
          <p>{PACKED_EXPORTED_BY.name}</p>
          <p>{PACKED_EXPORTED_BY.address}</p>
        </div>
        <div>
          <p className="font-medium">Imported &amp; Distributed by:</p>
          <p>{IMPORTED_DISTRIBUTED_BY.name}</p>
          <p>{IMPORTED_DISTRIBUTED_BY.addressLine1}</p>
          <p>{IMPORTED_DISTRIBUTED_BY.addressLine2}</p>
        </div>
        <div>
          <p className="font-medium">Website:</p>
          <a href={WEBSITE_URL} className="underline underline-offset-2">
            {WEBSITE_DISPLAY}
          </a>
        </div>
      </div>

      <Divider />

      <div>
        <p className="font-medium">Storage:</p>
        <p>{coffee.storage}</p>
      </div>

      <Divider />

      <div className="space-y-1">
        <DateField label="Packed On" value={coffee.packedOn} />
        <DateField label="Best By" value={coffee.bestBy} />
        <p>
          <span className="font-medium">Lot No.: </span>
          {coffee.lotNumber ?? PENDING_LOT_SELECTION}
        </p>
        <p>
          <span className="font-medium">Passport No.: </span>
          {coffee.passportNumber}
        </p>
      </div>
    </div>
  );
}
