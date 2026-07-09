import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Passport Not Found",
  robots: { index: false, follow: true },
};

export default function PassportNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-soft-gray">
        INFINITE COFFEE PASSPORT™
      </p>
      <h1 className="mt-4 font-heading text-2xl text-forest sm:text-3xl">
        Passport Not Found
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base leading-8 text-charcoal">
        We could not locate this Infinite Coffee Passport™ in the registry.
        Please check the Passport No. or return to the Coffee Collection.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-forest px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5"
      >
        Return to the Coffee Collection
      </Link>
    </main>
  );
}
