import type { Metadata } from "next";
import Image from "next/image";
import HarvestWaitlistForm from "@/components/HarvestWaitlistForm";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: "The First New-Crop Harvest from Boquete",
  description:
    "Join the free harvest waitlist for first access to the founding batch of green coffee from small farms in Boquete, Panama, for home roasters.",
  alternates: { canonical: "/harvest" },
};

export default function HarvestPage() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center">
        <section className="relative flex min-h-[56vh] w-full items-center justify-center overflow-hidden">
          <Image src="/images/boquete-valley.jpg" alt="Misty morning over the coffee highlands of Boquete, Panama" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(31,77,58,0.70) 0%, rgba(31,77,58,0.55) 40%, rgba(31,77,58,0.88) 100%)" }} />
          <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center text-cream">
            <p className="text-[0.91rem] tracking-[0.35em] text-gold-accessible">HARVEST WAITLIST</p>
            <h1 className="mt-3 font-heading text-3xl leading-tight sm:text-5xl">
              Our First New-Crop Harvest from Boquete
            </h1>
            <p className="mt-5 text-lg">Green coffee for home roasters, from the small farms of Jaramillo, Boquete, Panama.</p>
            <a href="#join" className="mt-8 inline-block rounded-full bg-gold-accessible px-9 py-[1.1rem] text-sm tracking-wide text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-accessible/90">
              Join the Free Waitlist
            </a>
          </div>
        </section>

        <section className="w-full max-w-2xl px-6 py-24 text-center">
          <h2 className="font-heading text-2xl text-forest sm:text-3xl">Where It Comes From</h2>
          <div className="mx-auto mt-8 h-px w-24 bg-gold" />
          <p className="mt-8 text-base leading-8 text-dark-gray">
            High above the town of Boquete, in the Jaramillo area of Chiriquí, small family farms tend coffee on steep volcanic slopes in cool mountain air. Picking for the new crop takes place through November and December.
          </p>
          <p className="mt-6 text-base leading-8 text-dark-gray">
            We work with Mr. Ruiz, who sources from about eleven small farms around Boquete. Our first lot is a washed Boquete SHB Arabica, <em>Altura</em> (lot IPC-ALT-001), sold green and unroasted, so you decide how it&rsquo;s roasted.
          </p>
        </section>

        <section className="w-full max-w-2xl px-6 pb-8 text-center">
          <h2 className="font-heading text-2xl text-forest sm:text-3xl">Made for Home Roasters</h2>
          <p className="mt-8 text-base leading-8 text-dark-gray">
            Whether you roast in a popcorn popper, a skillet, or a home drum roaster, this is raw coffee straight from the source, ready for your own roast profile.
          </p>
        </section>

        <section id="join" className="w-full max-w-xl scroll-mt-12 px-6 py-24">
          <div className="text-center">
            <h2 className="font-heading text-2xl text-forest sm:text-3xl">Get First Access to the Founding Batch</h2>
            <ul className="mx-auto mt-8 max-w-md space-y-2 text-sm leading-7 text-dark-gray">
              <li><strong className="text-forest">Free to join:</strong> no payment now.</li>
              <li><strong className="text-forest">Limited batch:</strong> the first lot is small, and the waitlist hears first.</li>
              <li><strong className="text-forest">Ship date announced later:</strong> we&rsquo;ll email you once it&rsquo;s set.</li>
            </ul>
          </div>
          <div className="mt-12">
            <HarvestWaitlistForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
