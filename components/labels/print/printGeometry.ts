/**
 * Physical print geometry for the 8oz retail label prototype. All units
 * are inches, matching the CSS spec's fixed 96px = 1in conversion — these
 * numbers translate directly into CSS `in` values with no DPI ambiguity
 * for vector/text content (see public/labels/README.md for the raster/DPI
 * caveat, which doesn't apply here since nothing on the label is a raster
 * image).
 */

export const PAGE_WIDTH_IN = 8.5; // US Letter
export const PAGE_HEIGHT_IN = 11;

export const TRIM_WIDTH_IN = 4;
export const TRIM_HEIGHT_IN = 5;

export const BLEED_IN = 0.125;
export const SAFE_MARGIN_IN = 0.25;

export const BLEED_WIDTH_IN = TRIM_WIDTH_IN + BLEED_IN * 2;
export const BLEED_HEIGHT_IN = TRIM_HEIGHT_IN + BLEED_IN * 2;

/** Top-left corner of the bleed box, centered on the page. */
export const ARTWORK_LEFT_IN = (PAGE_WIDTH_IN - BLEED_WIDTH_IN) / 2;
export const ARTWORK_TOP_IN = (PAGE_HEIGHT_IN - BLEED_HEIGHT_IN) / 2;

const TRIM_LEFT_IN = ARTWORK_LEFT_IN + BLEED_IN;
const TRIM_TOP_IN = ARTWORK_TOP_IN + BLEED_IN;
const TRIM_RIGHT_IN = TRIM_LEFT_IN + TRIM_WIDTH_IN;
const TRIM_BOTTOM_IN = TRIM_TOP_IN + TRIM_HEIGHT_IN;

const CROP_MARK_GAP_IN = 0.0625; // gap between the bleed edge and where a mark starts
const CROP_MARK_LENGTH_IN = 0.1875;
const CROP_MARK_WEIGHT_IN = 0.01; // hairline

export function inToCss(valueIn: number): string {
  return `${valueIn}in`;
}

export type CropMarkRect = { top: number; left: number; width: number; height: number };

function verticalMark(xIn: number, yStartIn: number, yEndIn: number): CropMarkRect {
  return {
    left: xIn - CROP_MARK_WEIGHT_IN / 2,
    top: yStartIn,
    width: CROP_MARK_WEIGHT_IN,
    height: yEndIn - yStartIn,
  };
}

function horizontalMark(yIn: number, xStartIn: number, xEndIn: number): CropMarkRect {
  return {
    top: yIn - CROP_MARK_WEIGHT_IN / 2,
    left: xStartIn,
    height: CROP_MARK_WEIGHT_IN,
    width: xEndIn - xStartIn,
  };
}

/**
 * 8 hairline segments (2 per corner) marking the trim edge, positioned
 * with a small gap beyond the bleed edge and extending further out into
 * the page's margin — standard print-shop convention. All 8 stay safely
 * within the US Letter page bounds given the trim/bleed sizes above.
 */
export function getCropMarks(): CropMarkRect[] {
  return [
    // Top-left
    verticalMark(TRIM_LEFT_IN, ARTWORK_TOP_IN - CROP_MARK_GAP_IN - CROP_MARK_LENGTH_IN, ARTWORK_TOP_IN - CROP_MARK_GAP_IN),
    horizontalMark(TRIM_TOP_IN, ARTWORK_LEFT_IN - CROP_MARK_GAP_IN - CROP_MARK_LENGTH_IN, ARTWORK_LEFT_IN - CROP_MARK_GAP_IN),
    // Top-right
    verticalMark(TRIM_RIGHT_IN, ARTWORK_TOP_IN - CROP_MARK_GAP_IN - CROP_MARK_LENGTH_IN, ARTWORK_TOP_IN - CROP_MARK_GAP_IN),
    horizontalMark(TRIM_TOP_IN, ARTWORK_LEFT_IN + BLEED_WIDTH_IN + CROP_MARK_GAP_IN, ARTWORK_LEFT_IN + BLEED_WIDTH_IN + CROP_MARK_GAP_IN + CROP_MARK_LENGTH_IN),
    // Bottom-left
    verticalMark(TRIM_LEFT_IN, ARTWORK_TOP_IN + BLEED_HEIGHT_IN + CROP_MARK_GAP_IN, ARTWORK_TOP_IN + BLEED_HEIGHT_IN + CROP_MARK_GAP_IN + CROP_MARK_LENGTH_IN),
    horizontalMark(TRIM_BOTTOM_IN, ARTWORK_LEFT_IN - CROP_MARK_GAP_IN - CROP_MARK_LENGTH_IN, ARTWORK_LEFT_IN - CROP_MARK_GAP_IN),
    // Bottom-right
    verticalMark(TRIM_RIGHT_IN, ARTWORK_TOP_IN + BLEED_HEIGHT_IN + CROP_MARK_GAP_IN, ARTWORK_TOP_IN + BLEED_HEIGHT_IN + CROP_MARK_GAP_IN + CROP_MARK_LENGTH_IN),
    horizontalMark(TRIM_BOTTOM_IN, ARTWORK_LEFT_IN + BLEED_WIDTH_IN + CROP_MARK_GAP_IN, ARTWORK_LEFT_IN + BLEED_WIDTH_IN + CROP_MARK_GAP_IN + CROP_MARK_LENGTH_IN),
  ];
}
