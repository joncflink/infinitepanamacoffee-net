/**
 * Reusable QR generator for Infinite Coffee Passport lots.
 *
 * Usage:
 *   npx tsx scripts/generate-qr.ts               generate any missing files for every coffee
 *   npx tsx scripts/generate-qr.ts IPC-ALT-001    only this lot
 *   npx tsx scripts/generate-qr.ts --force        regenerate everything, overwriting existing files
 *
 * SAFETY: by default this never overwrites an existing file. Printed QR
 * codes cannot be changed once labels are produced, so a file that has
 * already been generated, decoded/verified, and possibly sent to a
 * printer must never be silently regenerated. Only pass --force when you
 * specifically intend to replace an asset that has NOT gone to print.
 *
 * For each coffee this writes four files to /public/qr/:
 *   [lotId].svg              plain, black-on-white, no icon (max-reliability fallback)
 *   [lotId]-1024.png         plain, rasterized
 *   [lotId]-branded.svg      brand-colored (forest/cream) with the Infinite icon centered
 *   [lotId]-branded-1024.png branded, rasterized
 *
 * All encode the exact same canonical URL:
 *   https://infinitepanamacoffee.com/passport/[lotId]
 * No query string — a param can never be added retroactively to an
 * already-printed label, so the canonical QR destination stays bare.
 */

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";
import { coffees } from "../data/coffees";

const CANONICAL_ORIGIN = "https://infinitepanamacoffee.com";
const OUT_DIR = path.join(process.cwd(), "public", "qr");

const BRAND_DARK = "#1F4D3A"; // forest
const BRAND_LIGHT = "#F7F2E8"; // cream

// Same simplified single-path rendering of the master icon (components/Mark.tsx)
// already used in the currently-printed QR's center mark, so a fresh
// "-branded" render matches what's already on the shelf. Bounding box in
// this coordinate space: x 20..140 (width 120), y 24.24..75.76 (height 51.52).
const ICON_RIBBON_PATH =
  "M140.000,50.000 C140.000,56.072 138.360,63.921 135.430,68.218 C132.500,72.505 127.840,75.760 122.430,75.760 C117.010,75.760 110.030,72.505 102.960,68.218 C95.890,63.921 87.650,56.072 80.000,50.000 C72.350,43.928 64.110,36.079 57.040,31.782 C49.970,27.495 42.990,24.240 37.570,24.240 C32.160,24.240 27.500,27.495 24.570,31.782 C21.640,36.079 20.000,43.928 20.000,50.000 C20.000,56.072 21.640,63.921 24.570,68.218 C27.500,72.505 32.160,75.760 37.570,75.760 C42.990,75.760 49.970,72.505 57.040,68.218 C64.110,63.921 72.350,56.072 80.000,50.000 C87.650,43.928 95.890,36.079 102.960,31.782 C110.030,27.495 117.010,24.240 122.430,24.240 C127.840,24.240 132.500,27.495 135.430,31.782 C138.360,36.079 140.000,43.928 140.000,50.000 Z";
const ICON_STAR_PATH =
  "M80,32.45 C81,37.45 83,39.45 88,40.45 C83,41.45 81,44.06 80,49.06 C79,44.06 77,41.45 72,40.45 C77,39.45 79,37.45 80,32.45 Z";
const ICON_LOCAL_X = 20;
const ICON_LOCAL_Y = 24.24;
const ICON_LOCAL_WIDTH = 120;
const ICON_LOCAL_HEIGHT = 51.52;

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Inserts an ivory backing plate + centered icon into a QR SVG string. Icon sized to 20% of QR width (within the required 18-22% band). */
function brandSvg(baseSvg: string): string {
  const viewBoxMatch = baseSvg.match(/viewBox="0 0 ([\d.]+) \1"/);
  const size = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 49;

  const iconWidth = size * 0.2;
  const scale = iconWidth / ICON_LOCAL_WIDTH;
  const iconHeight = ICON_LOCAL_HEIGHT * scale;

  const padding = iconWidth * 0.14;
  const plateWidth = iconWidth + padding * 2;
  const plateHeight = iconHeight + padding * 2;
  const plateX = (size - plateWidth) / 2;
  const plateY = (size - plateHeight) / 2;

  const iconX = (size - iconWidth) / 2 - ICON_LOCAL_X * scale;
  const iconY = (size - iconHeight) / 2 - ICON_LOCAL_Y * scale;

  const overlay = `<rect x="${plateX.toFixed(3)}" y="${plateY.toFixed(3)}" width="${plateWidth.toFixed(3)}" height="${plateHeight.toFixed(3)}" rx="${(plateHeight * 0.14).toFixed(3)}" fill="${BRAND_LIGHT}" /><g transform="translate(${iconX.toFixed(4)}, ${iconY.toFixed(4)}) scale(${scale.toFixed(6)})"><path d="${ICON_RIBBON_PATH}" fill="none" stroke="${BRAND_DARK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" /><path d="${ICON_STAR_PATH}" fill="#C8A44D" /></g>`;

  return baseSvg.replace("</svg>", `${overlay}</svg>`);
}

async function svgToPng(svg: string, sizePx: number): Promise<Buffer> {
  return sharp(Buffer.from(svg)).resize(sizePx, sizePx).png().toBuffer();
}

async function writeIfAllowed(
  filePath: string,
  data: string | Buffer,
  force: boolean
): Promise<void> {
  if (!force && (await fileExists(filePath))) {
    console.log(`  skip (already exists): ${path.relative(process.cwd(), filePath)}`);
    return;
  }
  await writeFile(filePath, data);
  console.log(`  wrote: ${path.relative(process.cwd(), filePath)}`);
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlyLotId = args.find((a) => !a.startsWith("--"));

  await mkdir(OUT_DIR, { recursive: true });

  const targets = onlyLotId
    ? coffees.filter((c) => c.lotId === onlyLotId.toUpperCase())
    : coffees;

  if (targets.length === 0) {
    console.error(`No coffee found for lot "${onlyLotId}"`);
    process.exit(1);
  }

  for (const coffee of targets) {
    const url = `${CANONICAL_ORIGIN}/passport/${coffee.lotId}`;
    console.log(`\n${coffee.lotId} -> ${url}`);

    const plainSvg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 4,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
    const brandedBaseSvg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 4,
      color: { dark: BRAND_DARK, light: BRAND_LIGHT },
    });
    const brandedSvg = brandSvg(brandedBaseSvg);

    await writeIfAllowed(path.join(OUT_DIR, `${coffee.lotId}.svg`), plainSvg, force);
    await writeIfAllowed(
      path.join(OUT_DIR, `${coffee.lotId}-branded.svg`),
      brandedSvg,
      force
    );

    const plainPng1024 = await svgToPng(plainSvg, 1024);
    await writeIfAllowed(
      path.join(OUT_DIR, `${coffee.lotId}-1024.png`),
      plainPng1024,
      force
    );

    const brandedPng1024 = await svgToPng(brandedSvg, 1024);
    await writeIfAllowed(
      path.join(OUT_DIR, `${coffee.lotId}-branded-1024.png`),
      brandedPng1024,
      force
    );
  }

  console.log("\nDone. Verify output with jsQR before sending anything to print.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
