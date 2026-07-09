# Infinite Coffee Passport™ QR Codes

## What each QR points to

Every QR in this folder encodes one fixed, bare URL — no query string:

```
https://infinitepanamacoffee.com/passport/[lotId]
```

For example, `IPC-ALT-001.svg` encodes `https://infinitepanamacoffee.com/passport/IPC-ALT-001`.

## File naming convention

For each lot, `scripts/generate-qr.ts` produces four files:

| File | Meaning |
|---|---|
| `[lotId].svg` | Plain — black modules on white, no icon. Maximum-contrast fallback. |
| `[lotId]-1024.png` | Plain, rasterized. |
| `[lotId]-branded.svg` | Brand-colored (forest on cream) with the Infinite icon centered. |
| `[lotId]-branded-1024.png` | Branded, rasterized. |

### Special case: `IPC-ALT-001` (Altura)

The Altura QR was designed, verified, and **cleared to print before this
naming convention existed**. Its already-existing `IPC-ALT-001.svg`,
`IPC-ALT-001-1024.png`, and `IPC-ALT-001-2048.png` are the **branded**
design (forest/cream, icon embedded) — they are what's actually on the
printed label, not a plain/no-icon fallback. `generate-qr.ts` will never
overwrite them (see "How to regenerate" below), so:

- `IPC-ALT-001.svg` / `-1024.png` / `-2048.png` = the real, live, printed design.
- `IPC-ALT-001-branded.svg` / `-branded-1024.png` = a fresh regeneration of
  the same branded design, added so the naming convention is consistent
  across lots. Content-verified (via jsQR) to decode to the same URL.
- A genuine plain/no-icon Altura QR has **not** been generated, because the
  branded version already scans reliably at 20mm/25mm/30mm (verified) and
  there's no reliability problem to work around. If one is ever needed,
  generate it to a new filename first and get it print-tested — never
  repurpose the `IPC-ALT-001.svg` slot, since that would silently change
  what a "re-download the original QR" action produces for an asset that's
  already on physical inventory.

Any coffee added after this convention was established gets clean,
genuinely-distinct plain and branded files from a normal script run.

## Why QR codes point to Passport pages, not Amazon

The Passport page is the one place that can show origin, harvest, lot,
process, and journey information — an Amazon listing can't. The Passport
page still links out to Amazon/WhatsApp for purchase. Routing through the
Passport also means the destination can gain features (journey timeline,
certificate, future account features) without ever needing to reprint a
label — the QR's job is just to reach the lot's permanent record.

## How to regenerate

```
npx tsx scripts/generate-qr.ts               # fill in anything missing, for every coffee
npx tsx scripts/generate-qr.ts IPC-ALT-001    # only this lot
npx tsx scripts/generate-qr.ts --force        # overwrite existing files too
```

**By default the script never overwrites an existing file.** Printed QR
codes cannot be changed after labels are produced, so an existing file is
assumed to possibly already be on physical inventory unless you know
otherwise. Only pass `--force` when you are certain the target file has
**not** been sent to a printer.

## Plain vs. branded fallback rule

If a branded (icon-embedded) QR is ever found to scan less reliably in
testing — smudged small prints, low-quality label stock, etc. — use the
plain black-on-white file for that print run instead. Never modify a QR's
appearance in a way that could reduce scan reliability (icon size, contrast,
quiet zone) without re-testing at 20mm/25mm/30mm first.

## Minimum print size

- 20mm — minimum tested size.
- 25mm — minimum recommended for production labels.
- 30mm — preferred where label space allows.

Maintain a clean white/ivory quiet zone (margin) around every code — don't
let other label artwork touch or overlap it.

## Testing instructions

1. Print at 20mm, 25mm, and 30mm on the actual label stock (not a laser
   proof on plain paper — real stock, real ink/toner).
2. Scan with at least two different phones, using both the native camera
   app and a dedicated QR scanner app.
3. Confirm the destination matches the lot's Passport URL exactly, with no
   redirect warning or delay.
4. Test in normal indoor light and in dim light.
5. Only approve a size for production once every phone/app combination
   succeeds.

`/qr-test` (internal, not linked in navigation, not indexed) renders every
lot's plain and branded codes with download links for this workflow.

## Never change a printed QR's destination

Once a label has been printed, its QR code is physically fixed. If a lot's
canonical URL ever needs to change, the *old* URL must keep working (a
redirect), because there is no way to reach and update coffee bags already
on a shelf or in a customer's kitchen. This is also why the QR encodes a
bare canonical URL with no query string — a query parameter added later
could never be retrofitted onto an already-printed code either.
