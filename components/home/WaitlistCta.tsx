import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function WaitlistCta() {
  return (
    <section id="waitlist" className="w-full bg-forest px-6 py-24 text-center text-cream sm:py-32">
      <ScrollReveal className="mx-auto max-w-2xl">
        <p className="text-[0.91rem] tracking-[0.35em] text-gold-accessible">HARVEST WAITLIST</p>
        <h2 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">
          Our First New-Crop Harvest from Boquete
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-cream/90">
          Green coffee for home roasters. Free to join, no payment now, and the
          waitlist hears first.
        </p>
        <Link
          href="/harvest"
          className="mt-10 inline-block rounded-full bg-gold-accessible px-9 py-[1.1rem] text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-gold-accessible/90 hover:-translate-y-0.5"
        >
          Join the Harvest Waitlist
        </Link>
      </ScrollReveal>
    </section>
  );
}
