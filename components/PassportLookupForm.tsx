"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCoffeeByPassportNumber } from "@/data/coffees";
import { logProductEvent } from "@/lib/supabase/track";

/**
 * Shared "enter your Passport Number" form — used on the homepage (embedded)
 * and on /passport (standalone). No QR code, no scan language: this is the
 * manual-entry path for customers whose bag may not carry a QR at all (see
 * AMAZON_LABEL_ID_MODE in components/labels/constants.ts).
 */
export default function PassportLookupForm({
  className = "",
  source,
}: {
  className?: string;
  /** Where this form instance lives, e.g. "homepage" or "passport_page" — passed through to product_events. */
  source: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = value.trim().toUpperCase();

    if (!normalized) {
      setError("Please enter the Passport Number printed on your bag.");
      return;
    }

    logProductEvent({ event: "passport_lookup_started", passportNumber: normalized, source });

    setChecking(true);
    const coffee = getCoffeeByPassportNumber(normalized);
    setChecking(false);

    if (!coffee) {
      setError(
        "We couldn't find a coffee with that Passport Number. Please check the number printed on your bag and try again."
      );
      logProductEvent({
        event: "passport_lookup_not_found",
        passportNumber: normalized,
        source,
      });
      return;
    }

    setError(null);
    logProductEvent({
      event: "passport_lookup_success",
      passportNumber: coffee.passportNumber,
      source,
    });
    router.push(`/passport/${coffee.passportNumber}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="passport-number" className="sr-only">
          Passport Number
        </label>
        <input
          id="passport-number"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="IPC-000001"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "passport-number-error" : undefined}
          className="w-full rounded-full border border-gold/50 bg-cream px-6 py-4 text-center text-sm tracking-[0.15em] text-charcoal placeholder:text-dark-gray/50 focus:border-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:text-left"
        />
        <button
          type="submit"
          disabled={checking}
          className="shrink-0 rounded-full bg-forest px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:bg-forest/90 hover:-translate-y-0.5 disabled:opacity-60"
        >
          View My Passport
        </button>
      </div>
      <p className="mt-3 text-xs text-dark-gray/80">
        Example format: <span className="tracking-[0.1em]">IPC-000001</span>
      </p>
      {error && (
        <p
          id="passport-number-error"
          role="alert"
          className="mt-3 text-sm"
          style={{ color: "#B3413B" }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
