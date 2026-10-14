"use client";

import { useState } from "react";
import { MONTHLY_LBS, ROAST_METHODS } from "@/lib/waitlist/validate";

type Status = "idle" | "sending" | "done" | "error";

const inputCls =
  "w-full rounded-md border border-forest/25 bg-white px-4 py-3 text-sm text-charcoal focus:border-forest focus:outline-none";

export default function HarvestWaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          firstName: fd.get("firstName"),
          roastMethod: fd.get("roastMethod") || undefined,
          monthlyLbs: fd.get("monthlyLbs") || undefined,
          subscriptionInterest: fd.get("subscriptionInterest") === "on",
          company: fd.get("company"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-lg border border-gold/60 bg-white p-8 text-center">
        <p className="font-heading text-xl text-forest">You&rsquo;re on the list.</p>
        <p className="mt-3 text-sm leading-7 text-dark-gray">
          We&rsquo;ll email you first when the founding batch is ready, along with the ship date.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 text-left" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-forest">
          First name
          <input name="firstName" required maxLength={80} autoComplete="given-name" className={`mt-2 ${inputCls}`} />
        </label>
        <label className="block text-sm text-forest">
          Email
          <input name="email" type="email" required autoComplete="email" className={`mt-2 ${inputCls}`} />
        </label>
      </div>
      <label className="block text-sm text-forest">
        How do you roast? <span className="text-dark-gray">(optional)</span>
        <select name="roastMethod" defaultValue="" className={`mt-2 ${inputCls}`}>
          <option value="">Choose one</option>
          {ROAST_METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-forest">
        About how many pounds of green coffee do you roast a month?{" "}
        <span className="text-dark-gray">(optional)</span>
        <select name="monthlyLbs" defaultValue="" className={`mt-2 ${inputCls}`}>
          <option value="">Choose one</option>
          {MONTHLY_LBS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-3 text-sm text-forest">
        <input name="subscriptionInterest" type="checkbox" className="mt-1 h-4 w-4 accent-[#1f4d3a]" />
        <span>I&rsquo;d be interested in a monthly green-coffee subscription. <span className="text-dark-gray">(optional)</span></span>
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-forest px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 hover:bg-forest/90 disabled:opacity-60"
      >
        {status === "sending" ? "Joining…" : "Join the Free Harvest Waitlist"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-center text-sm text-red-700">{message}</p>
      )}
      <p className="text-center text-xs leading-6 text-dark-gray">
        Free to join. No payment now. We&rsquo;ll only email you about the harvest and founding batch, and you can unsubscribe anytime. See our{" "}
        <a href="/privacy" className="underline hover:text-forest">Privacy Policy</a>.
      </p>
    </form>
  );
}
