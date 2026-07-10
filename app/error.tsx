"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary — catches any otherwise-uncaught render error
 * anywhere under the root layout so a bug never surfaces as a blank page
 * or Next's bare default error screen. Deliberately never renders
 * `error.message` or `error.stack` — those are for the server log, not a
 * customer.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled render error:", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-soft-gray">
        INFINITE PANAMA COFFEE
      </p>
      <h1 className="mt-4 font-heading text-2xl text-forest sm:text-3xl">
        Something Went Wrong
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base leading-8 text-charcoal">
        We hit an unexpected error loading this page. Please try again, or
        return to the homepage.
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
          href="/"
          className="rounded-full border border-gold px-9 py-4 text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-gold/10 hover:-translate-y-0.5"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
