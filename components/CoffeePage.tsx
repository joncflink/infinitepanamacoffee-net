import Link from "next/link";
import type { Coffee } from "@/data/coffees";
import { AMAZON_STORE_URL, STATUS_LABELS, whatsAppUrl } from "@/data/coffees";
import { OUR_PROMISE } from "@/data/site";
import ReserveAction from "@/components/ReserveAction";

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
  ["Process", "process"],
  ["Harvest", "harvest"],
  ["Lot", "lotId"],
  ["Variety", "variety"],
  ["Elevation", "elevation"],
  ["Producer", "producer"],
  ["Exporter", "exporter"],
];

export default function CoffeePage({ coffee }: { coffee: Coffee }) {
  const originParts = coffee.origin.split(", ");
  const originShort = `${originParts[0]}, ${originParts[originParts.length - 1]}`;
  const contactUrl = whatsAppUrl(coffee.productName);

  return (
    <>
      <main className="flex flex-1 flex-col items-center">
        {/* Hero */}
        <section className="w-full bg-cream px-6 py-20 text-center text-forest sm:py-28">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-10">
            <img
              src="/images/infinite-panama-coffee-logo.png"
              alt="Infinite Panama Coffee"
              width={900}
              height={510}
              className="brand-logo"
            />

            <div>
              <h1 className="font-heading text-3xl sm:text-5xl">
                {coffee.collection}
                <br />
                {coffee.productName.toUpperCase()}
              </h1>
              <p className="mt-6 text-lg text-charcoal">
                {coffee.productType} from {originShort}
              </p>
              <p className="mt-3 text-sm italic text-soft-gray">
                Selected with patience. Built for generations.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <a
                href="#reserve"
                className="rounded-full bg-forest px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90"
              >
                Reserve / Reorder Coffee
              </a>
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
              >
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <Divider />

        {/* Coffee Passport */}
        <section
          id="passport"
          className="w-full max-w-2xl px-6 py-20 text-center sm:py-24"
        >
          <h2 className="font-heading text-2xl text-forest">Coffee Passport™</h2>
          <dl className="mt-10 divide-y divide-gold/25 rounded-lg border border-gold/25 text-left">
            {passportRows.map(([label, key]) =>
              coffee[key] ? (
                <div key={key} className="flex justify-between gap-6 px-6 py-4">
                  <dt className="text-sm leading-6 text-soft-gray">{label}</dt>
                  <dd className="text-right text-sm font-medium leading-6 text-charcoal">
                    {coffee[key]}
                  </dd>
                </div>
              ) : null
            )}
            <div className="flex justify-between gap-6 px-6 py-4">
              <dt className="text-sm leading-6 text-soft-gray">Status</dt>
              <dd className="text-right text-sm font-medium leading-6 text-charcoal">
                {STATUS_LABELS[coffee.status]}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-6 text-soft-gray">
            Lot details may be updated as final inventory is confirmed.
          </p>
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
                  <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:items-end">
                    <ReserveAction
                      lotId={coffee.lotId}
                      href={whatsAppUrl(
                        coffee.productName,
                        `${option.size} — Reserve List`
                      )}
                      label="Join Reserve List"
                      className="w-full rounded-full bg-forest px-7 py-3 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 sm:w-auto"
                    />
                    <a
                      href={whatsAppUrl(
                        coffee.productName,
                        `${option.size} — Notify Me`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
                    >
                      Notify Me When Available
                    </a>
                  </div>
                ) : (
                  <ReserveAction
                    lotId={coffee.lotId}
                    href={
                      option.amazonUrl ||
                      whatsAppUrl(coffee.productName, option.size)
                    }
                    label={
                      option.amazonUrl ? "Reorder This Coffee" : "Reserve This Coffee"
                    }
                    className="w-full rounded-full bg-forest px-7 py-3 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 sm:w-auto"
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
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-gold px-9 py-4 text-sm tracking-wide text-charcoal transition-all duration-300 ease-out hover:bg-gold/90 sm:w-auto"
            >
              Message on WhatsApp
            </a>
            <a
              href={AMAZON_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-cream px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-cream/10 sm:w-auto"
            >
              Visit Amazon Store
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl px-6 py-16 text-center text-sm text-soft-gray">
        <p className="font-heading text-charcoal">Infinite Panama Coffee™</p>
        <p className="mt-2">A Member of The Infinite Companies™</p>
        <p className="mt-1">Boquete, Panama</p>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <a
            href="#passport"
            className="py-1 transition-colors duration-300 hover:text-forest"
          >
            Coffee Passport
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
