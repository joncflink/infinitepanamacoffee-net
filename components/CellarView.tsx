"use client";

import Link from "next/link";
import { useCellar } from "@/components/CellarProvider";
import {
  STATUS_LABELS,
  getFeaturedCoffee,
  formatPassportDisplay,
} from "@/data/coffees";
import { logReorderEvent } from "@/lib/supabase/track";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-gold/15 py-2 text-sm first:border-t-0 first:pt-0">
      <dt className="text-soft-gray">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  );
}

export default function CellarView() {
  const { items, remove } = useCellar();

  if (items.length === 0) {
    const featured = getFeaturedCoffee();
    return (
      <div className="text-center">
        <h2 className="font-heading text-2xl text-forest">
          Your Infinite Cellar™ is ready.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-8 text-dark-gray">
          Add a coffee from any Infinite Coffee Passport™ to begin building
          your personal collection.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/passport"
            className="rounded-full bg-forest px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5"
          >
            Find a Coffee Passport
          </Link>
          <Link
            href={`/passport/${featured.passportNumber}`}
            className="rounded-full border border-gold px-9 py-4 text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-gold/10 hover:-translate-y-0.5"
          >
            Explore Current Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {items.map((coffee) => {
        const reorderUrl = coffee.sizeOptions.find((s) => s.amazonUrl)?.amazonUrl;

        return (
          <div
            key={coffee.passportNumber}
            className="rounded-lg border border-gold/25 px-7 py-6"
          >
            <p className="font-heading text-xl text-forest">
              {coffee.coffeeName}
            </p>

            <dl className="mt-4">
              <DetailRow label="Passport Number" value={formatPassportDisplay(coffee)} />
              <DetailRow label="Collection" value={coffee.collection} />
              {coffee.process && <DetailRow label="Process" value={coffee.process} />}
              {coffee.harvest && <DetailRow label="Harvest" value={coffee.harvest} />}
              <DetailRow label="Status" value={STATUS_LABELS[coffee.status]} />
              <DetailRow
                label="Date Added"
                value={new Date(coffee.addedAt).toLocaleDateString()}
              />
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gold/15 pt-4">
              <Link
                href={`/passport/${coffee.passportNumber}`}
                className="text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
              >
                View Passport
              </Link>
              {reorderUrl && (
                <a
                  href={reorderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    logReorderEvent({
                      lotId: coffee.lotNumber ?? coffee.passportNumber,
                      passportNumber: coffee.passportNumber,
                      action: "reorder_clicked",
                      destinationUrl: reorderUrl,
                    })
                  }
                  className="text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
                >
                  Reorder
                </a>
              )}
              <button
                type="button"
                onClick={() => remove(coffee.passportNumber)}
                className="text-sm text-soft-gray underline underline-offset-4 transition-colors duration-300 hover:text-forest"
              >
                Remove from Cellar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
