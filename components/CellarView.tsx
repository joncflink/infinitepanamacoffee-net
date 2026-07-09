"use client";

import Link from "next/link";
import { useCellar } from "@/components/CellarProvider";
import { getCoffeeByPassportNumber, getFullName, type Coffee } from "@/data/coffees";
import type { CellarItem } from "@/lib/cellar";

type SavedEntry = { item: CellarItem; coffee: Coffee };

export default function CellarView() {
  const { items, remove } = useCellar();

  const saved: SavedEntry[] = items.flatMap((item) => {
    const coffee = getCoffeeByPassportNumber(item.passportNumber);
    return coffee ? [{ item, coffee }] : [];
  });

  if (saved.length === 0) {
    return (
      <div className="text-center">
        <p className="text-base leading-8 text-dark-gray">
          Your cellar is empty. Explore an Infinite Coffee Passport™ and add
          it to start your collection.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-forest px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5"
        >
          Explore the Coffee Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {saved.map(({ item, coffee }) => (
        <div
          key={item.passportNumber}
          className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gold/25 px-6 py-5 text-left sm:flex-row"
        >
          <div>
            <p className="font-heading text-lg text-forest">
              {getFullName(coffee)}
            </p>
            <p className="mt-1 text-xs text-soft-gray">
              {coffee.passportNumber} &middot; Saved{" "}
              {new Date(item.savedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href={`/passport/${coffee.passportNumber}`}
              className="text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
            >
              View Passport
            </Link>
            <button
              type="button"
              onClick={() => remove(item.passportNumber)}
              className="text-sm text-soft-gray underline underline-offset-4 transition-colors duration-300 hover:text-forest"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
