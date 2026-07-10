import type { ReactNode } from "react";
import { LABEL_COLORS } from "@/components/labels/constants";
import {
  ARTWORK_LEFT_IN,
  ARTWORK_TOP_IN,
  BLEED_HEIGHT_IN,
  BLEED_IN,
  BLEED_WIDTH_IN,
  PAGE_HEIGHT_IN,
  PAGE_WIDTH_IN,
  SAFE_MARGIN_IN,
  getCropMarks,
  inToCss,
} from "./printGeometry";

/**
 * One US-Letter page sized in physical inches (not viewport-relative
 * units), with a centered ivory bleed box, crop marks at the trim
 * corners, and a safe-margin-inset content area. Reused for every
 * exact-dimension print route (/front/print, /back/print, /test-sheet).
 * Print at 100% / Actual Size, no "Fit to page" — see public/labels/README.md.
 */
export default function PrintCanvas({ children }: { children: ReactNode }) {
  const cropMarks = getCropMarks();

  return (
    <div
      className="print-page relative bg-white"
      style={{ width: inToCss(PAGE_WIDTH_IN), height: inToCss(PAGE_HEIGHT_IN) }}
    >
      <style>{`
        @page { size: letter; margin: 0; }
        @media print {
          html, body { margin: 0; padding: 0; }
          .print-page { page-break-after: always; }
          .print-page:last-child { page-break-after: auto; }
        }
      `}</style>

      <div
        className="absolute"
        style={{
          left: inToCss(ARTWORK_LEFT_IN),
          top: inToCss(ARTWORK_TOP_IN),
          width: inToCss(BLEED_WIDTH_IN),
          height: inToCss(BLEED_HEIGHT_IN),
          backgroundColor: LABEL_COLORS.ivory,
        }}
      >
        <div
          className="absolute"
          style={{ inset: inToCss(BLEED_IN + SAFE_MARGIN_IN) }}
        >
          {children}
        </div>
      </div>

      {cropMarks.map((mark, i) => (
        <div
          key={i}
          className="absolute bg-black"
          style={{
            top: inToCss(mark.top),
            left: inToCss(mark.left),
            width: inToCss(mark.width),
            height: inToCss(mark.height),
          }}
        />
      ))}
    </div>
  );
}
