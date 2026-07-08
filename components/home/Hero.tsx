import Image from "next/image";
import Link from "next/link";
import Mark from "@/components/Mark";

export default function Hero() {
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
            "linear-gradient(180deg, rgba(31,77,58,0.62) 0%, rgba(31,77,58,0.45) 40%, rgba(31,77,58,0.8) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center text-cream">
        <Mark variant="light" />

        <p className="mt-9 text-xs tracking-[0.35em] text-gold">
          100% BOQUETE, PANAMA
        </p>
        <h1 className="mt-5 font-heading text-4xl leading-tight sm:text-6xl">
          Infinite Select™
          <br />
          ALTURA
        </h1>
        <p className="mt-6 text-lg text-cream">
          Specialty Green Coffee Beans
        </p>
        <p className="mt-3 text-sm italic tracking-wide text-cream/90">
          Selected with patience.
          <br />
          Built for generations.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/passport/IPC-ALT-001#reserve"
            className="rounded-full bg-gold px-9 py-4 text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-gold/90"
          >
            Reserve Your Coffee
          </Link>
          <Link
            href="/passport/IPC-ALT-001#passport"
            className="rounded-full border border-cream/80 px-9 py-4 text-sm tracking-wide text-cream transition-all duration-300 ease-out hover:border-cream hover:bg-cream/10"
          >
            Explore Coffee Passport™
          </Link>
        </div>
      </div>
    </section>
  );
}
