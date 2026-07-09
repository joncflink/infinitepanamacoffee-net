import Link from "next/link";
import type { Coffee } from "@/data/coffees";
import {
  AMAZON_STORE_URL,
  STATUS_LABELS,
  formatLotDisplay,
  formatLotDisplayCompact,
  whatsAppUrl,
} from "@/data/coffees";
import { OUR_PROMISE } from "@/data/site";
import ReserveAction from "@/components/ReserveAction";
import PrintCertificateButton from "@/components/PrintCertificateButton";
import TrackedLink from "@/components/TrackedLink";
import QrScanLogger from "@/components/QrScanLogger";

function Divider() {
  return <hr className="mx-auto my-4 w-24 border-t border-gold/60" />;
}

type StringCoffeeKey =
  | "collection"
  | "productName"
  | "productType"
  | "origin"
  | "process"
  | "harvest"
  | "lotId"
  | "variety"
  | "elevation"
  | "producer"
  | "exporter";

const passportRows: Array<[string, StringCoffeeKey]> = [
  ["Collection", "collection"],
  ["Coffee", "productName"],
  ["Product Type", "productType"],
  ["Origin", "origin"],
  ["Harvest", "harvest"],
  ["Lot", "lotId"],
  ["Producer", "producer"],
  ["Exporter", "exporter"],
  ["Process", "process"],
  ["Elevation", "elevation"],
  ["Variety", "variety"],
];

const journeyStages = (coffee: Coffee) => [
  {
    label: "Seed & Cultivation",
    detail: `Boquete, Chiriquí highlands`,
    confirmed: true,
  },
  {
    label: "Farm",
    detail: coffee.producer,
    confirmed: Boolean(coffee.producer),
  },
  { label: "Harvest", detail: coffee.harvest, confirmed: true },
  { label: "Processing", detail: coffee.process, confirmed: true },
  { label: "Drying", detail: undefined, confirmed: false },
  { label: "Quality Inspection", detail: undefined, confirmed: false },
  {
    label: "Export",
    detail: coffee.exporter,
    confirmed: Boolean(coffee.exporter),
  },
  { label: "Ocean Transit", detail: undefined, confirmed: false },
  { label: "Import", detail: undefined, confirmed: false },
];

export default function CoffeePage({ coffee }: { coffee: Coffee }) {
  const originParts = coffee.origin.split(", ");
  const originShort = `${originParts[0]}, ${originParts[originParts.length - 1]}`;
  const contactUrl = whatsAppUrl(coffee.productName);
  const stages = journeyStages(coffee);

  return (
    <>
      <QrScanLogger lotId={coffee.lotId} passportNumber={coffee.lotId} />
      <main className="flex flex-1 flex-col items-center print:hidden">
        {/* Hero */}
        <section className="w-full bg-cream px-6 py-20 text-center text-forest sm:py-28">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <img
              src="/images/infinite-panama-coffee-logo.png"
              alt="Infinite Panama Coffee"
              width={900}
              height={510}
              className="brand-logo"
            />

            <div>
              <h1 className="font-heading leading-tight">
                <span className="block text-3xl sm:text-5xl">
                  {coffee.collection}
                </span>
                <span className="block text-[1.4rem] tracking-wide sm:text-[2.25rem]">
                  {coffee.productName}
                </span>
              </h1>
              <p className="mt-3 text-lg text-charcoal">
                {coffee.productType} from {originShort}
              </p>
              <p className="mt-3 text-sm italic text-soft-gray">
                Selected with patience. Built for generations.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <a
                href="#reserve"
                className="rounded-full bg-forest px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5"
              >
                Reserve Your Allocation
              </a>
              <TrackedLink
                lotId={coffee.lotId}
                passportNumber={coffee.lotId}
                action="whatsapp_clicked"
                href={contactUrl}
                className="py-1 text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
              >
                Contact on WhatsApp
              </TrackedLink>
            </div>
          </div>
        </section>

        <Divider />

        {/* Infinite Coffee Passport */}
        <section
          id="passport"
          className="w-full max-w-2xl px-6 py-20 text-center sm:py-24"
        >
          <h2 className="font-heading text-2xl text-forest">
            Infinite Coffee Passport™
          </h2>
          <p className="mt-2 text-sm tracking-wide text-soft-gray">
            by Infinite Panama Coffee™
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm italic text-soft-gray">
            A permanent provenance record for this coffee.
          </p>
          <dl className="mt-10 divide-y divide-gold/25 rounded-lg border border-gold/25 text-left">
            {passportRows.map(([label, key]) =>
              coffee[key] ? (
                <div key={key} className="flex justify-between gap-6 px-6 py-6">
                  <dt className="text-sm leading-6 text-soft-gray">{label}</dt>
                  <dd className="text-right text-sm font-medium leading-6 text-charcoal">
                    {key === "lotId" ? formatLotDisplay(coffee) : coffee[key]}
                  </dd>
                </div>
              ) : null
            )}
            <div className="flex justify-between gap-6 px-6 py-6">
              <dt className="text-sm leading-6 text-soft-gray">Status</dt>
              <dd className="text-right">
                <span className="flex items-center justify-end gap-1.5 text-xs font-medium tracking-[0.15em] text-forest">
                  <span className="text-gold">●</span>VERIFIED
                </span>
                <span className="mt-1 block text-sm font-medium leading-6 text-charcoal">
                  {STATUS_LABELS[coffee.status]}
                </span>
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-6 text-soft-gray">
            Lot details may be updated as final inventory is confirmed.
          </p>
          <div className="mt-6">
            <PrintCertificateButton />
          </div>
          <p className="mx-auto mt-6 max-w-md text-xs italic leading-6 text-soft-gray">
            This passport permanently records the origin, harvest, process,
            and journey of this coffee. No two Infinite Coffee Passports™
            are ever the same.
          </p>
        </section>

        <Divider />

        {/* Founder's Notes */}
        <section className="w-full max-w-xl px-6 py-16 text-center sm:py-20">
          <h2 className="font-heading text-xl text-forest/90">
            Founder&rsquo;s Notes
          </h2>
          <p className="mx-auto mt-7 max-w-md text-sm italic leading-8 text-charcoal">
            &ldquo;I selected this coffee because it represents the kind of
            long-term sourcing Infinite Panama Coffee was created to
            support: patient, traceable, and rooted in place. This lot is
            intentionally limited. It is not meant to be everything to
            everyone. It is meant to be worthy of the Infinite name.&rdquo;
          </p>
          <p className="mt-5 font-heading text-base italic tracking-wide text-forest/70">
            Jon Flink
          </p>
          <p className="mt-1 text-xs text-soft-gray">
            Founder, Infinite Panama Coffee™
          </p>
        </section>

        <Divider />

        {/* Journey Timeline */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Journey Timeline</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-soft-gray">
            Every Infinite Coffee Passport™ tracks this coffee&rsquo;s path
            from seed to import. Stages update as each milestone is
            confirmed.
          </p>
          <ol className="mx-auto mt-10 max-w-md text-left">
            {stages.map((stage, i) => (
              <li key={stage.label} className="relative flex gap-5 pb-8 last:pb-0">
                {i < stages.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-px bg-gold/25" />
                )}
                <span
                  className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                    stage.confirmed
                      ? "border-forest bg-forest"
                      : "border-gold/50 bg-cream"
                  }`}
                />
                <div>
                  <p className="font-heading text-base text-forest">
                    {stage.label}
                  </p>
                  <p className="mt-1 text-sm text-soft-gray">
                    {stage.confirmed ? stage.detail : "Pending confirmation"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Divider />

        {/* Available Sizes */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Available Sizes</h2>
          <div className="mt-10 space-y-4">
            {coffee.sizeOptions.map((option) => (
              <div
                key={option.sku}
                className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gold/25 px-6 py-5 sm:flex-row"
              >
                <div className="text-left">
                  <p className="font-heading text-lg text-forest">
                    {option.size}
                    <span className="ml-2 text-sm font-normal text-soft-gray">
                      ({option.netWeight})
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-soft-gray">{option.sku}</p>
                </div>
                {coffee.status === "sold_out" ? (
                  <ReserveAction
                    lotId={coffee.lotId}
                    passportNumber={coffee.lotId}
                    href={whatsAppUrl(
                      coffee.productName,
                      `${option.size} — Next Harvest List`
                    )}
                    label="Join Next Harvest List"
                    action="join_next_harvest_clicked"
                    className="w-full rounded-full bg-forest px-7 py-3.5 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5 sm:w-auto"
                  />
                ) : (
                  <ReserveAction
                    lotId={coffee.lotId}
                    passportNumber={coffee.lotId}
                    href={
                      option.amazonUrl ||
                      whatsAppUrl(coffee.productName, option.size)
                    }
                    label={
                      option.amazonUrl
                        ? "Reorder This Coffee"
                        : "Reserve This Allocation"
                    }
                    action={option.amazonUrl ? "reorder_clicked" : "reserve_clicked"}
                    className="w-full rounded-full bg-forest px-7 py-3.5 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5 sm:w-auto"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* The Story */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">The Story</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            {coffee.story}
          </p>
        </section>

        <Divider />

        {/* Traceability */}
        <section className="w-full max-w-3xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Traceability</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            This lot originates from the Boquete growing region. Exact farm
            coordinates will be added to this Infinite Coffee Passport™ once
            the producer is confirmed.
          </p>
          <div className="mt-10 aspect-[16/7] w-full overflow-hidden rounded-lg">
            <iframe
              title={`Map of ${coffee.origin}`}
              src="https://www.google.com/maps?q=Boquete,Chiriqui,Panama&output=embed"
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <Divider />

        {/* Our Promise */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Our Promise</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            {OUR_PROMISE}
          </p>
        </section>

        <Divider />

        {/* From the Highlands of Boquete */}
        <section className="w-full max-w-3xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">
            From the Highlands of Boquete
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            Boquete, Chiriquí is one of Panama&rsquo;s most respected
            coffee-growing regions, known for high elevations, volcanic soils,
            cool mountain air, and a long tradition of specialty coffee
            cultivation.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              "High Elevation",
              "Volcanic Soils",
              "Cool Mountain Climate",
              "Specialty Coffee Tradition",
            ].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-gold/25 px-4 py-8 text-sm leading-6 text-forest"
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Green Coffee Notice */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Please Note</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            This product is specialty green coffee intended for home roasters,
            small roasters, and coffee enthusiasts who understand green coffee
            preparation and storage.
          </p>
        </section>

        <Divider />

        {/* Storage */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Storage</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            {coffee.storage}
          </p>
        </section>

        <Divider />

        {/* Authenticity */}
        <section className="w-full max-w-2xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">Authenticity</h2>
          <div className="mx-auto mt-8 max-w-xl space-y-2 text-sm leading-6 text-charcoal">
            <p>Authentic Infinite Coffee Passport™</p>
            <p>Verified Infinite Panama Coffee Product</p>
            <p>Connected to Lot {coffee.lotId}</p>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs leading-6 text-soft-gray">
            This record is generated and maintained exclusively by Infinite
            Panama Coffee and cannot be edited by customers.
          </p>
        </section>

        <Divider />

        {/* The Living Passport */}
        <section className="w-full max-w-3xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-heading text-2xl text-forest">
            The Living Passport
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-charcoal">
            This Infinite Coffee Passport™ will continue to grow. The
            following will appear here as Infinite Panama Coffee&rsquo;s
            verification system comes online.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              "Passport History",
              "Verification History",
              "Producer Notes",
              "Harvest Updates",
              "Cellar Status",
              "Owner Notes",
              "Verification Count",
              "Future Release Availability",
            ].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-dashed border-gold/25 px-4 py-8 text-sm leading-6 text-soft-gray"
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Reserve / Reorder */}
        <section
          id="reserve"
          className="mt-4 w-full bg-forest px-6 py-24 text-center text-cream sm:py-28"
        >
          <h2 className="font-heading text-2xl">Reserve or Reorder</h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8">
            Infinite Panama Coffee is currently preparing its first launch lots.
            For availability, pre-orders, or questions, contact us directly.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink
              lotId={coffee.lotId}
              passportNumber={coffee.lotId}
              action="whatsapp_clicked"
              href={contactUrl}
              className="w-full rounded-full bg-gold px-9 py-[1.1rem] text-sm tracking-wide text-charcoal transition-all duration-300 ease-out hover:bg-gold/90 hover:-translate-y-0.5 sm:w-auto"
            >
              Message on WhatsApp
            </TrackedLink>
            <TrackedLink
              lotId={coffee.lotId}
              passportNumber={coffee.lotId}
              action="amazon_clicked"
              href={AMAZON_STORE_URL}
              className="w-full rounded-full border border-cream px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-cream/10 hover:-translate-y-0.5 sm:w-auto"
            >
              Visit Amazon Store
            </TrackedLink>
          </div>
        </section>
      </main>

      {/* Certificate of Provenance (print only) */}
      <div className="relative hidden print:flex print:min-h-screen print:w-full print:flex-col print:items-center print:justify-center print:gap-7 print:p-16 print:text-center">
        <img
          src="/images/infinite-panama-coffee-logo.png"
          alt="Infinite Panama Coffee"
          width={220}
          height={125}
        />
        <div>
          <p className="text-xs tracking-[0.3em] text-soft-gray">
            INFINITE PANAMA COFFEE
          </p>
          <h1 className="mt-3 font-heading text-2xl text-forest">
            Certificate of Provenance
          </h1>
          <p className="mt-2 text-sm tracking-wide text-soft-gray">
            Infinite Coffee Passport™
          </p>
        </div>

        <div className="h-px w-16 bg-gold/60" />

        <dl className="space-y-2 text-sm text-charcoal">
          <div>
            <dt className="inline font-medium">Passport No.: </dt>
            <dd className="inline">{formatLotDisplayCompact(coffee)}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Coffee: </dt>
            <dd className="inline">{coffee.fullName}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Harvest: </dt>
            <dd className="inline">{coffee.harvest}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Producer: </dt>
            <dd className="inline">
              {coffee.producer ?? "Pending Producer Confirmation"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium">Origin: </dt>
            <dd className="inline">{coffee.origin}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Passport Recorded: </dt>
            <dd className="inline">{coffee.createdAt}</dd>
          </div>
        </dl>

        <img
          src={coffee.sizeOptions[0]?.qrCodePath}
          alt="Infinite Coffee Passport QR Code"
          width={182}
          height={182}
        />
        <p className="max-w-[220px] text-xs leading-5 text-soft-gray">
          Scan to verify this passport in the Infinite Coffee Passport™
          Registry.
        </p>

        <div className="mt-2 text-xs leading-6 text-soft-gray">
          <p>Authenticated by</p>
          <p className="font-medium text-forest">Infinite Coffee Passport™</p>
          <p>www.infinitepanamacoffee.com</p>
        </div>

        <p className="absolute bottom-10 right-14 text-[10px] tracking-wide text-soft-gray/70">
          Registry Edition 1.0
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-3xl px-6 py-16 text-center text-sm text-soft-gray print:hidden">
        <p className="font-heading text-charcoal">Infinite Panama Coffee™</p>
        <p className="mt-2">A Member of The Infinite Companies™</p>
        <p className="mt-1">Boquete, Panama</p>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <a
            href="#passport"
            className="py-1 transition-colors duration-300 hover:text-forest"
          >
            Infinite Coffee Passport
          </a>
          <a
            href="#reserve"
            className="py-1 transition-colors duration-300 hover:text-forest"
          >
            Contact
          </a>
          <a
            href={AMAZON_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 transition-colors duration-300 hover:text-forest"
          >
            Amazon Store
          </a>
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 transition-colors duration-300 hover:text-forest"
          >
            WhatsApp
          </a>
          <Link
            href="/cellar"
            className="py-1 transition-colors duration-300 hover:text-forest"
          >
            My Cellar
          </Link>
        </nav>
      </footer>
    </>
  );
}
