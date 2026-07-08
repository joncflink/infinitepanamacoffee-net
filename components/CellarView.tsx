"use client";

import Link from "next/link";
import { useCellar } from "@/components/CellarProvider";
import { getCoffeeByLot, type Coffee } from "@/data/coffees";
import type { CellarItem } from "@/lib/cellar";

type SavedEntry = { item: CellarItem; coffee: Coffee };

export default function CellarView() {
  const { items, remove } = useCellar();

  const saved: SavedEntry[] = items.flatMap((item) => {
    const coffee = getCoffeeByLot(item.lotId);
    return coffee ? [{ item, coffee }] : [];
  });

  if (saved.length === 0) {
    return (
      <div className="text-center">
        <p className="text-base leading-8 text-dark-gray">
          Your cellar is empty. Explore a coffee&rsquo;s Passport™ and add it
          to start your collection.
        </p>
        <Link
          href="/passport/IPC-ALT-001"
          className="mt-8 inline-block rounded-full bg-forest px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90"
        >
          Explore Coffee Passport™
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {saved.map(({ item, coffee }) => (
        <div
          key={item.lotId}
          className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gold/25 px-6 py-5 text-left sm:flex-row"
        >
          <div>
            <p className="font-heading text-lg text-forest">
              {coffee.fullName}
            </p>
            <p className="mt-1 text-xs text-soft-gray">
              {coffee.lotId} &middot; Saved{" "}
              {new Date(item.savedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href={`/passport/${coffee.lotId}`}
              className="text-sm text-forest underline underline-offset-4 transition-colors duration-300 hover:text-forest/80"
            >
              View Passport
            </Link>
            <button
              type="button"
              onClick={() => remove(item.lotId)}
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
