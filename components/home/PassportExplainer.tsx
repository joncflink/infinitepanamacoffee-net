import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { PASSPORT_FIELDS } from "@/data/site";

export default function PassportExplainer() {
  return (
    <section className="w-full bg-forest px-6 py-28 text-cream sm:py-36">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-2xl sm:text-3xl">
          The Infinite Coffee Passport™
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-cream/90">
          Every bag carries a QR code. Scanning it opens that coffee&rsquo;s
          digital passport &mdash; a permanent, traceable record of where it
          came from and how it was grown.
        </p>

        <ul className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-x-10 gap-y-4 text-left text-sm leading-6 text-cream/90">
          {PASSPORT_FIELDS.map((field) => (
            <li key={field} className="flex items-start gap-3">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {field}
            </li>
          ))}
        </ul>

        <Link
          href="/passport/IPC-ALT-001#passport"
          className="mt-12 inline-block rounded-full border border-gold px-9 py-[1.1rem] text-sm tracking-wide text-gold transition-all duration-300 ease-out hover:bg-gold/10 hover:-translate-y-0.5"
        >
          Explore Infinite Coffee Passport™
        </Link>
      </ScrollReveal>
    </section>
  );
}
