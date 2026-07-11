import Image from "next/image";
import Link from "next/link";
import Mark from "@/components/Mark";
import { BRAND, getFeaturedCoffee } from "@/data/coffees";

export default function Hero() {
  const featured = getFeaturedCoffee();

  return (
    <section className="relative flex min-h-[74vh] w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/boquete-valley.jpg"
        alt="Misty morning over the coffee highlands of Boquete, Panama"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(31,77,58,0.68) 0%, rgba(31,77,58,0.51) 40%, rgba(31,77,58,0.86) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center text-cream">
        <Mark variant="light" />

        <p className="mt-4 text-[0.91rem] tracking-[0.35em] text-gold-accessible">
          100% BOQUETE, PANAMA
        </p>
        <h1 className="mt-2 font-heading leading-tight">
          <span className="block text-4xl sm:text-6xl">{BRAND.collection}</span>
          <span className="block text-[1.65rem] tracking-wide sm:text-[2.75rem]">
            {featured.coffeeName}
          </span>
        </h1>
        <p className="mt-3 text-lg text-cream">
          Rare Green Coffee from the Highlands of Boquete
        </p>
        <p className="mt-3 text-sm italic tracking-wide text-cream/90">
          Selected with patience.
          <br />
          Built for generations.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href={`/passport/${featured.passportNumber}#reserve`}
            className="rounded-full bg-gold-accessible px-9 py-[1.1rem] text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-gold-accessible/90 hover:-translate-y-0.5"
          >
            Reserve Your Allocation
          </Link>
          <Link
            href={`/passport/${featured.passportNumber}#passport`}
            className="rounded-full border border-cream/80 px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:border-cream hover:bg-cream/10"
          >
            Explore Infinite Coffee Passport™
          </Link>
        </div>
      </div>
    </section>
  );
}
