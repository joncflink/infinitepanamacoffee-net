import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { FOUNDER } from "@/data/site";

export default function Founder() {
  return (
    <section className="w-full max-w-4xl px-6 py-28 sm:py-40">
      <ScrollReveal className="mx-auto flex flex-col items-center gap-12 sm:flex-row sm:items-start sm:gap-20">
        <div className="relative aspect-[3/4] w-52 shrink-0 overflow-hidden rounded-xl shadow-[0_10px_40px_rgba(31,77,58,0.14)] sm:w-60">
          <Image
            src="/images/founder-jon.jpg"
            alt={`${FOUNDER.name}, ${FOUNDER.title}`}
            fill
            sizes="240px"
            className="object-cover"
          />
        </div>

        <div className="max-w-lg text-center sm:text-left">
          <h2 className="font-heading text-2xl text-forest sm:text-3xl">
            Meet the Founder
          </h2>
          <p className="mt-3 text-sm tracking-wide text-dark-gray">
            {FOUNDER.name} &mdash; {FOUNDER.title}
          </p>

          <div className="mt-8 space-y-6 text-base leading-8 text-dark-gray">
            {FOUNDER.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-8 text-sm italic tracking-wide text-forest">
            Selected with patience. Built for generations.
          </p>

          <Link
            href="/founders-letter"
            className="mt-10 inline-block rounded-full border border-forest px-9 py-[1.1rem] text-sm tracking-wide text-forest transition-all duration-300 ease-out hover:bg-forest/5 hover:-translate-y-0.5"
          >
            Read the Founder&rsquo;s Letter
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
