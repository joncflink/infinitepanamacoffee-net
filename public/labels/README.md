# Infinite Panama Coffee™ — Master Label System

This is the permanent label system for every coffee Infinite Panama Coffee
ever offers. The artwork (`components/labels/FrontLabel.tsx`,
`BackLabel.tsx`) is meant to stay frozen — **adding a new coffee should
never require a design change, only a new entry in `data/coffees.ts`.**

## Still a physical prototype today

**Do not purchase premium waterproof labels until physical fit has been
approved on the actual Wantpack Kraft stand-up pouch.** Everything below
describes a system that's ready for real data — it does not mean the
*current* featured coffee (Boquete SHB Arabica Washed) is ready for real
production; it's a working/sample name and several fields (lot number,
pack/best-by dates) are still genuinely unconfirmed pending Casa Ruiz (see
"The `{{field}}` placeholder convention" below).

## Label generation workflow — how a new coffee goes from data to label

1. Add a new object to the `coffees` array in `data/coffees.ts` with a
   real `passportNumber` (get the next one from `getNextPassportNumber()`),
   `coffeeName`, and whatever fields are actually confirmed.
2. That's it. `/labels/[passportNumber]/front`, `/back`, `/set`,
   `/front/print`, `/back/print` all render automatically — nothing in
   `components/labels/` needs to change.
3. Once a field that was previously unset gets a real value (e.g. Casa
   Ruiz confirms the producer), just set it in the data. The `{{producer}}`
   placeholder disappears and the real name appears — same artwork, no
   redesign.
4. Once `/public/qr/[passportNumber].svg` exists (generated via
   `npx tsx scripts/generate-qr.ts`), the back label automatically shows
   the real QR instead of the "not generated yet" placeholder.

This is the whole point of the system: **the operator's only job is
keeping `data/coffees.ts` accurate.** No one should ever need to open a
design tool to ship a new coffee's label.

## Dynamic fields

Everything below is read live from the coffee record — nothing is
hardcoded per coffee anywhere in `components/labels/` or `app/labels/`:

| Field | Source | Fallback when unset |
|---|---|---|
| Collection | `getCollection(coffee)` (defaults to `BRAND.collection`, overridable per record for a future named collection) | — (always resolves) |
| Product Type | `getProductType(coffee)` (defaults to `BRAND.productType`, overridable per record — e.g. an Arabica-specific statement) | — (always resolves) |
| Coffee Name | `coffee.coffeeName` | — (required, never unset) |
| Process | `coffee.process` | `{{process}}` |
| Farm | `coffee.farm` | `{{farm}}` |
| Producer | `coffee.producer` | `{{producer}}` |
| Harvest | `coffee.harvest` | `{{harvest}}` |
| Variety | `coffee.variety` | `{{variety}}` |
| Elevation | `coffee.elevation` | `{{elevation}}` |
| Exporter | `coffee.exporter` | `{{exporter}}` |
| Lot Number | `coffee.lotNumber` | `{{lotNumber}}` |
| Passport Number | `coffee.passportNumber` | — (required, never unset) |
| Packed On | `coffee.packedOn` | a blank fill-in line (not a placeholder — see below) |
| Best By | `coffee.bestBy` | a blank fill-in line (same) |
| Origin | `BRAND.origin` (brand-wide, not per-record — see note) | — (always resolves) |
| Net Weight | `getSizeOption(coffee, "8 oz")` | `{{netWeight}}` |
| QR Code | `/public/qr/[passportNumber].svg`, checked server-side | `{{qrCode}}` |

**Brand vs. per-record fields:** `BRAND.name` and `BRAND.origin` stay
global constants — every coffee this brand sells is Infinite Panama
Coffee™, from Boquete. `collection` and `productType` both have a
per-record override (`coffee.collection`, `coffee.productType`), added so
a genuinely new collection (Estate Reserve™, Geisha Collection™, etc.) or
a differently-worded product statement (e.g. "Single-Origin Green Arabica
Coffee Beans") can exist later as pure data, with zero template changes.
`collection` is unset on every current coffee (all resolve to "Infinite
Select™"); `productType` is set on Boquete SHB Arabica Washed and unset
(falling back to `BRAND.productType`) on Altura.

## The `{{field}}` placeholder convention

When a field is genuinely unconfirmed, the label shows literal
`{{fieldName}}` template syntax — not a soft phrase like "Pending
Confirmation." This is deliberate: prose placeholders read enough like
real copy that an incomplete record could get sent to print without
anyone noticing. Raw template syntax cannot be mistaken for real content
by anyone who looks at it — it's an intentional, impossible-to-miss stop
sign. **A label showing any `{{...}}` text is not production-ready.**

`Packed On` / `Best By` are the one exception — they render as a blank
underscore line instead, matching how physical food labels actually work
(a line pre-printed on the label, then a real date stamped on at packing
time). That's a real workflow, not a missing-data placeholder, so it gets
different treatment.

## Print workflow

| Route | What it is |
|---|---|
| `/labels` | Index — lists every coffee (production catalog + development samples), links to all views. |
| `/labels/[passportNumber]/front`, `/back`, `/set` | On-screen review cards. Roomy spacing, not physically constrained. |
| `/labels/[passportNumber]/front/print`, `/back/print` | The actual print artwork. No chrome, no nav. 4.00"×5.00" trim, 0.125" bleed, 0.25" safe margin, crop marks, centered on US Letter. |
| `/labels/test-sheet` | Front + back + an instructions page, one 3-page print job, for the current featured coffee. |

**Browser print settings that matter:** US Letter paper, **100% scale**
(never "Fit to page"), **0 margins**, background graphics **enabled**.
Get any of these wrong and the physical size will be off — the whole
point of the crop marks is that they're only trustworthy at 100%.

**Physical test procedure:**

1. Print `/labels/test-sheet` on plain paper at 100% scale.
2. Cut on the crop marks.
3. Tape the front and back labels to the Wantpack 8 oz pouch.
4. Position the top edge approximately 0.75" below the zipper.
5. Fill the pouch with green coffee before final evaluation.
6. Check: brand visibility, coffee-name readability, QR scan
   reliability, label curvature, edge spacing, and overall premium
   appearance.
7. Do not order production labels until the physical bag test is
   approved.

## Print quality — what's actually true today

- **Vector, not raster.** The logo (`components/Mark.tsx`) and QR codes
  are all SVG/vector; all label copy is real text. Nothing on the label
  is a pixel image, so there's no raster resolution to get wrong and no
  "300 DPI" setting to configure — vector content prints crisply at
  whatever native resolution the printer uses.
- **Colors are RGB, not CMYK-profiled.** `components/labels/constants.ts`
  defines the print palette as hex/RGB (`#255D2A` forest, `#D4B15A` gold,
  `#666666` charcoal, `#F7F3EA` ivory) — the same values used for the
  crop-marked artwork and this PDF pipeline. This is **not** a CMYK color
  build. For a real commercial print run where exact color match matters,
  give the print vendor these hex values directly and have them build a
  proper CMYK profile — don't assume this PDF's colors survive an RGB→CMYK
  conversion unchanged.
- **Bleed, crop marks, safe margins, centering** are computed in
  `components/labels/print/printGeometry.ts` and verified against a real
  generated PDF (not just trusted math) — the 4.25"×5.25" bleed box lands
  at exactly (2.125", 2.875") on the 8.5"×11" page.

## Amazon Grocery & Gourmet Food / FDA notes

**This is not a substitute for a real food-labeling compliance review.**
What's true about the current label:

- Present: brand name, statement of identity (coffee name + product
  type), net weight, country of origin ("Product of Panama"), packer/
  exporter and importer/distributor name & address, unroasted/not-ready-
  to-drink notice, storage instructions, lot code, pack/best-by dates.
- No organic, health, or certification claims are made anywhere, because
  none exist in the data model — the system has no field for them, so
  there's nothing to invent.
- **Deliberately not added:** an ingredients statement and a Nutrition
  Facts panel. Raw, unroasted green coffee is a raw agricultural
  commodity, not a ready-to-eat food (the label says so explicitly), and
  single-ingredient raw commodities are commonly exempt from both
  requirements — but "commonly exempt" is not the same as "confirmed
  exempt for this product." Verify this with an actual food-labeling
  professional before real production; don't take this README's word for
  it, and don't take mine.
- A UPC/FNSKU barcode is not part of this artwork — that's typically
  applied separately during Amazon FBA prep, not baked into the base
  label design.

## Future proofing

The data model already supports coffees this brand doesn't sell yet:
`coffee.collection` for a new named collection, `coffee.farm` /
`coffee.producer` / `coffee.variety` / `coffee.elevation` for full
estate-level traceability, and a fully generic `sizeOptions[]` array for
whatever pack sizes exist. None of `components/labels/` cares which
specific coffee or collection it's rendering — it only cares that the
fields exist (or shows `{{field}}` honestly when they don't). Adding
"Estate Reserve™" or a future cacao product means writing a new data
record with the fields that apply to it, not touching this system.
