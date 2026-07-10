"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Cellar-specific error boundary. Deliberately does NOT offer a homepage
 * link — recovery stays inside the Cellar/Passport experience, same as the
 * empty-Cellar state in CellarView.tsx. Never renders `error.message` or
 * `error.stack`.
 */
export default function CellarError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Cellar error:", error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-24 text-center sm:py-32">
      <h1 className="font-heading text-3xl text-forest sm:text-4xl">
        My Infinite Cellar™
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-dark-gray">
        We hit an unexpected error loading your Cellar. Your saved coffees
        are still there — please try again.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-forest px-9 py-[1.1rem] text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5"
        >
          Try Again
        </button>
        <Link
          href="/passport"
          className="rounded-full border border-gold px-9 py-4 text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-gold/10 hover:-translate-y-0.5"
        >
          Find a Coffee Passport
        </Link>
      </div>
    </main>
  );
}
