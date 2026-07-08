import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutBoquete() {
  return (
    <section className="w-full max-w-5xl px-6 py-24 sm:py-32">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-2xl text-forest sm:text-3xl">
          About Boquete
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-dark-gray">
          Boquete, Chiriquí is one of the world&rsquo;s premier
          coffee-growing regions &mdash; high elevations, volcanic soils,
          cool mountain air, and generations of specialty coffee cultivation.
        </p>
      </ScrollReveal>

      <ScrollReveal delayMs={100}>
        <div className="mt-16 grid gap-6 sm:grid-cols-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:col-span-3">
            <Image
              src="/images/coffee-drying-patio.jpg"
              alt="Washed coffee drying in the sun on a patio in Boquete, Panama"
              fill
              sizes="(min-width: 640px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:col-span-2">
            <Image
              src="/images/coffee-drying-beds.jpg"
              alt="Coffee beans drying on raised beds in Boquete, Panama"
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delayMs={200}>
        <div className="mt-8 aspect-[16/7] w-full overflow-hidden rounded-lg">
          <iframe
            title="Map of Boquete, Chiriquí, Panama"
            src="https://www.google.com/maps?q=Boquete,Chiriqui,Panama&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
